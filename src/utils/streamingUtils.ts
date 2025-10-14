/**
 * Utility functions for handling Server-Sent Events (SSE) streaming from Thesys C1 API
 */

export interface StreamChunk {
  type: 'text' | 'ui' | 'done' | 'error';
  content?: string;
  uiSpec?: any;
  error?: string;
}

/**
 * Parse SSE stream from Thesys C1 API
 * Handles both text deltas and UI specifications
 */
export async function* parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<StreamChunk> {
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        // Process any remaining data in buffer
        if (buffer.trim()) {
          const chunk = parseSSEChunk(buffer);
          if (chunk) yield chunk;
        }
        yield { type: 'done' };
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        const chunk = parseSSEChunk(line);
        if (chunk) yield chunk;
      }
    }
  } catch (error) {
    console.error('Error parsing SSE stream:', error);
    yield { 
      type: 'error', 
      error: error instanceof Error ? error.message : 'Stream parsing error' 
    };
  }
}

/**
 * Parse a single SSE chunk
 */
function parseSSEChunk(line: string): StreamChunk | null {
  const trimmed = line.trim();
  
  // Skip empty lines and comments
  if (!trimmed || trimmed.startsWith(':')) {
    return null;
  }

  // Handle SSE data format
  if (trimmed.startsWith('data: ')) {
    const jsonStr = trimmed.slice(6);
    
    // Check for stream end marker
    if (jsonStr === '[DONE]') {
      return { type: 'done' };
    }

    try {
      const data = JSON.parse(jsonStr);
      
      // Handle different response types from Thesys C1
      if (data.choices && data.choices[0]) {
        const choice = data.choices[0];
        
        // Text delta
        if (choice.delta?.content) {
          return {
            type: 'text',
            content: choice.delta.content
          };
        }
        
        // UI specification
        if (choice.delta?.ui_spec) {
          return {
            type: 'ui',
            uiSpec: choice.delta.ui_spec
          };
        }
      }
      
      // Handle error responses
      if (data.error) {
        return {
          type: 'error',
          error: data.error.message || 'Unknown API error'
        };
      }
    } catch (error) {
      console.error('Failed to parse SSE JSON:', jsonStr, error);
      return null;
    }
  }

  return null;
}

/**
 * Stream assistant response from Thesys C1 API
 */
export async function streamC1Response(
  messages: Array<{ role: string; content: string }>,
  onChunk: (chunk: StreamChunk) => void
): Promise<void> {
  const CHAT_URL = `https://egqbvpsasbmxcmwzxizv.supabase.co/functions/v1/chat-c1`;
  
  const response = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const reader = response.body.getReader();
  
  for await (const chunk of parseSSEStream(reader)) {
    onChunk(chunk);
  }
}
