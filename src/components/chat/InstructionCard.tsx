import React from 'react';
import { X, TrendingUp, PieChart, Activity, Clock, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InstructionCardProps {
  onDismiss: () => void;
  onExampleClick: (example: string) => void;
}

const examples = [
  {
    icon: TrendingUp,
    category: "Sentiment",
    text: "BTC vs ETH 24h funding & perp skew — bullish, neutral, bearish?",
    color: "state-positive"
  },
  {
    icon: PieChart,
    category: "Distribution", 
    text: "Top holders & 30d changes for HYPE.",
    color: "accent-blue"
  },
  {
    icon: Activity,
    category: "Liquidity",
    text: "DEX + CEX liquidity map for SOL today.",
    color: "state-positive"
  },
  {
    icon: Clock,
    category: "Outlooks",
    text: "Short / few days / few weeks / few months view for BTC, ALTs, GOLD, SPX.",
    color: "accent-blue"
  },
  {
    icon: Shield,
    category: "On-chain",
    text: "Active addresses & SOPR trend for BTC (7D/30D).",
    color: "state-positive"
  },
  {
    icon: AlertTriangle,
    category: "Risks",
    text: "Critical hacks/mergers last 12h with impact.",
    color: "state-negative"
  }
];

export const InstructionCard: React.FC<InstructionCardProps> = ({ 
  onDismiss, 
  onExampleClick 
}) => {
  return (
    <Card className="mx-4 lg:mx-6 mb-8 bg-gradient-to-br from-bg-panel/90 to-bg-elevated/90 border-border-subtle/50 shadow-xl backdrop-blur-lg animate-fade-in-scale">
      <CardHeader className="pb-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-hierarchy-primary tracking-tight">
            Ask CERANOS about the markets
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-9 w-9 p-0 hover:bg-bg-elevated/60 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-hierarchy-secondary text-base leading-relaxed mt-3">
          Get instant insights on crypto markets, sentiment analysis, and on-chain metrics. 
          Try one of these examples to get started:
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examples.map((example, index) => {
            const IconComponent = example.icon;
            return (
              <button
                key={index}
                onClick={() => onExampleClick(example.text)}
                className="group text-left p-5 rounded-2xl border border-border-subtle/60 glass-effect hover:shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:ring-offset-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-xl bg-${example.color}/15 text-${example.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 shadow-md`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-hierarchy-tertiary uppercase tracking-wider mb-2">
                      {example.category}
                    </p>
                    <p className="text-sm text-hierarchy-primary font-medium group-hover:text-accent-blue transition-colors duration-300 leading-relaxed">
                      {example.text}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 p-5 bg-gradient-to-r from-accent-blue/10 to-accent-blue-subtle/10 border border-accent-blue/30 rounded-2xl backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-subtle flex items-center justify-center flex-shrink-0 shadow-md">
              <div className="w-5 h-5 text-white font-bold">💡</div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-hierarchy-primary mb-2 tracking-tight">Pro tip</p>
              <p className="text-sm text-hierarchy-secondary leading-relaxed">
                Be specific with your questions. Include timeframes, asset classes, or particular markets you're interested in for more targeted analysis.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};