import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ 
  content, 
  className = "" 
}) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Code copied to clipboard"
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headers
          h1: ({...props}) => <h1 className="text-lg sm:text-xl font-bold text-text-primary mb-3 mt-4 first:mt-0" {...props} />,
          h2: ({...props}) => <h2 className="text-base sm:text-lg font-bold text-text-primary mb-2 mt-3" {...props} />,
          h3: ({...props}) => <h3 className="text-sm sm:text-base font-semibold text-text-primary mb-2 mt-3" {...props} />,
          
          // Paragraphs
          p: ({...props}) => <p className="text-sm text-text-primary mb-3 leading-relaxed break-words" {...props} />,
          
          // Lists
          ul: ({...props}) => <ul className="list-disc list-inside mb-3 text-sm text-text-primary space-y-1 ml-2" {...props} />,
          ol: ({...props}) => <ol className="list-decimal list-inside mb-3 text-sm text-text-primary space-y-1 ml-2" {...props} />,
          li: ({...props}) => <li className="break-words" {...props} />,
          
          // Links
          a: ({...props}) => <a className="text-accent-blue hover:text-accent-blue/80 underline break-all" target="_blank" rel="noopener noreferrer" {...props} />,
          
          // Code blocks
          pre: ({ children, ...props }) => {
            const getTextContent = (element: any): string => {
              if (typeof element === 'string') return element;
              if (Array.isArray(element)) return element.map(getTextContent).join('');
              if (element?.props?.children) return getTextContent(element.props.children);
              return '';
            };
            
            return (
              <div className="relative group">
                <pre className="bg-bg-elevated border border-border-primary rounded-lg p-3 mb-3 overflow-x-auto text-xs sm:text-sm" {...props}>
                  {children}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(getTextContent(children))}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-panel/80 hover:bg-bg-elevated border border-border-primary"
                >
                  <Copy className="icon-xs" />
                </Button>
              </div>
            );
          },
          
          // Inline code
          code: ({...props}) => <code className="bg-bg-elevated text-accent-blue px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono break-all" {...props} />,
          
          // Blockquotes
          blockquote: ({...props}) => <blockquote className="border-l-4 border-accent-blue/30 pl-4 mb-3 text-text-secondary italic" {...props} />,
          
          // Tables
          table: ({...props}) => (
            <div className="overflow-x-auto mb-3">
              <table className="w-full border border-border-primary rounded-lg text-xs sm:text-sm" {...props} />
            </div>
          ),
          th: ({...props}) => <th className="border border-border-primary p-2 bg-bg-elevated font-semibold text-text-primary text-left" {...props} />,
          td: ({...props}) => <td className="border border-border-primary p-2 text-text-primary break-words" {...props} />,
          
          // Strong and emphasis
          strong: ({...props}) => <strong className="font-bold text-text-primary" {...props} />,
          em: ({...props}) => <em className="italic" {...props} />,
          
          // Horizontal rule
          hr: ({...props}) => <hr className="border-border-primary my-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};