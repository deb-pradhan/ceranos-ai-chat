import React from 'react';
import { C1Component, ThemeProvider } from '@thesysai/genui-sdk';

interface UIRendererProps {
  uiSpec: any;
  isStreaming?: boolean;
}

export const UIRenderer: React.FC<UIRendererProps> = ({ uiSpec, isStreaming = false }) => {
  if (!uiSpec) {
    console.log('[UIRenderer] No uiSpec provided');
    return null;
  }

  // Detailed logging for debugging
  console.log('[UIRenderer] Rendering:', {
    type: typeof uiSpec,
    isStreaming,
    length: typeof uiSpec === 'string' ? uiSpec.length : 'N/A',
    preview: typeof uiSpec === 'string' 
      ? uiSpec.substring(0, 100) 
      : JSON.stringify(uiSpec).substring(0, 100)
  });

  try {
    return (
      <ThemeProvider>
        <div className="my-4">
          <C1Component 
            c1Response={uiSpec}
            isStreaming={isStreaming}
          />
        </div>
      </ThemeProvider>
    );
  } catch (error) {
    console.error('[UIRenderer] Render error:', error);
    console.error('[UIRenderer] Failed uiSpec:', uiSpec);
    
    return (
      <div className="my-4 p-4 border border-red-500 rounded bg-red-50">
        <p className="text-red-700 font-semibold mb-2">⚠️ UI Rendering Error</p>
        <pre className="text-xs text-red-600 overflow-auto max-h-40">
          {error instanceof Error ? error.message : String(error)}
        </pre>
        <details className="mt-2">
          <summary className="text-xs text-red-600 cursor-pointer">View raw data</summary>
          <pre className="text-xs mt-1 overflow-auto max-h-40">
            {typeof uiSpec === 'string' ? uiSpec : JSON.stringify(uiSpec, null, 2)}
          </pre>
        </details>
      </div>
    );
  }
};
