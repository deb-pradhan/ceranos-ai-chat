import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const THESYS_API_KEY = Deno.env.get('THESYS_API_KEY');
    if (!THESYS_API_KEY) {
      throw new Error('THESYS_API_KEY is not configured');
    }

    console.log('Calling Thesys C1 API with', messages.length, 'messages');

    // Call Thesys C1 API with streaming enabled
    const response = await fetch('https://api.thesys.dev/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${THESYS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'c1',
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Thesys API error:', response.status, errorText);
      throw new Error(`Thesys API returned ${response.status}: ${errorText}`);
    }

    // Return the SSE stream directly to the client
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat-c1 function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
