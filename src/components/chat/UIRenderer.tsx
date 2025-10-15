import React from 'react';
import { C1Component, ThemeProvider } from '@thesysai/genui-sdk';

interface UIRendererProps {
  uiSpec: any;
  isStreaming?: boolean;
}

export const UIRenderer: React.FC<UIRendererProps> = ({ uiSpec, isStreaming = false }) => {
  if (!uiSpec) return null;

  return (
    <ThemeProvider>
      <div className="my-4">
        <C1Component c1Response={uiSpec} isStreaming={isStreaming} />
      </div>
    </ThemeProvider>
  );
};
