import './polyfills' // Load polyfills first
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@crayonai/react-ui/styles/index.css' // Crayon UI styles for C1 components
import './index.css' // CERANOS design system (overrides Crayon UI)

console.log('[Main] Starting application initialization');
console.log('[Main] Environment mode:', import.meta.env.MODE);
console.log('[Main] Timestamp:', new Date().toISOString());

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('[Main] FATAL: Root element not found in DOM');
    throw new Error('Root element #root not found');
  }
  
  console.log('[Main] Root element found, creating React root');
  const root = createRoot(rootElement);
  
  console.log('[Main] Rendering App component');
  root.render(<App />);
  
  console.log('[Main] ✓ Application initialized successfully');
} catch (error) {
  console.error('[Main] ✗ Fatal initialization error:', error);
  
  // Display error in DOM as fallback
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #fff;
        padding: 20px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          max-width: 600px;
          padding: 40px;
          background: #f5f5f5;
          border: 2px solid #dc2626;
        ">
          <h1 style="color: #dc2626; margin: 0 0 16px 0; font-size: 24px;">
            Fatal Application Error
          </h1>
          <p style="color: #666; margin: 0 0 16px 0;">
            The application failed to initialize. Please refresh the page or contact support.
          </p>
          <pre style="
            background: #fff;
            padding: 16px;
            overflow: auto;
            font-size: 12px;
            border: 1px solid #ddd;
          ">${error instanceof Error ? error.message : String(error)}</pre>
          <button 
            onclick="window.location.reload()" 
            style="
              margin-top: 16px;
              padding: 12px 24px;
              background: #3b82f6;
              color: white;
              border: none;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
            "
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
  
  throw error;
}
