import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function callWebhookWithRetry(message: string, maxRetries = 3): Promise<string> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Webhook attempt ${attempt}/${maxRetries} for message:`, message);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const webhookResponse = await fetch('https://automate.aboss.tech/webhook/ceranos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      console.log(`Webhook response status: ${webhookResponse.status}`);

      if (!webhookResponse.ok) {
        throw new Error(`Webhook returned ${webhookResponse.status}: ${webhookResponse.statusText}`);
      }

      const responseData = await webhookResponse.text();
      console.log(`Webhook response received (${responseData.length} chars):`, responseData.substring(0, 200) + '...');
      
      // Validate response is not empty
      if (!responseData || responseData.trim().length === 0) {
        throw new Error('Empty response from webhook');
      }
      
      return responseData;
      
    } catch (error) {
      lastError = error;
      console.error(`Webhook attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const { message } = await req.json();
    
    if (!message) {
      console.error('Missing message in request body');
      throw new Error('Message is required');
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      console.error('Invalid message format:', typeof message);
      throw new Error('Message must be a non-empty string');
    }

    console.log('Processing chat request:', { 
      messageLength: message.length,
      timestamp: new Date().toISOString() 
    });

    const responseData = await callWebhookWithRetry(message);
    
    const duration = Date.now() - startTime;
    console.log(`Chat request completed successfully in ${duration}ms`);

    return new Response(JSON.stringify({ 
      response: responseData,
      success: true,
      duration: duration 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Chat-webhook function failed:', {
      error: error.message,
      duration: duration,
      timestamp: new Date().toISOString()
    });
    
    // Return user-friendly error messages
    let userMessage = 'Service temporarily unavailable. Please try again.';
    if (error.name === 'AbortError') {
      userMessage = 'Request timed out. Please try again.';
    } else if (error.message.includes('504')) {
      userMessage = 'Service is experiencing heavy load. Please try again in a moment.';
    } else if (error.message.includes('502') || error.message.includes('503')) {
      userMessage = 'Service is temporarily down. Please try again later.';
    }
    
    return new Response(JSON.stringify({ 
      error: userMessage,
      success: false,
      duration: duration
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});