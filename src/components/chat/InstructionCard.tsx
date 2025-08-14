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
    <Card className="mx-4 md:mx-6 mt-4 md:mt-6 mb-4 border-border-subtle bg-bg-panel/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
        <CardTitle className="text-lg md:text-xl font-semibold text-text-primary tracking-tight">
          Ask CERANOS about the markets
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-9 w-9 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-text-secondary text-sm md:text-base leading-relaxed">
          Get instant insights on crypto markets, sentiment analysis, and on-chain metrics. 
          Try asking about specific coins, market trends, or risk assessments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {examples.map((example, index) => {
            const IconComponent = example.icon;
            return (
              <button
                key={index}
                onClick={() => onExampleClick(example.text)}
                className="flex items-start gap-3 md:gap-4 p-4 md:p-5 border border-border-subtle bg-bg-elevated hover:bg-bg-base hover:border-accent-blue/30 hover:shadow-md rounded-xl transition-all duration-300 text-left group"
              >
                <div className={`p-2 md:p-2.5 bg-${example.color}/15 text-${example.color} group-hover:bg-${example.color}/25 rounded-lg transition-all duration-300 flex-shrink-0 shadow-sm`}>
                  <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-accent-blue mb-2 tracking-wide uppercase">
                    {example.category}
                  </div>
                  <div className="text-sm md:text-base text-text-primary group-hover:text-accent-blue transition-all duration-300 leading-relaxed">
                    {example.text}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-border-subtle">
          <p className="text-sm text-text-secondary leading-relaxed">
            💡 <strong className="text-text-primary">Pro tip:</strong> Be specific about timeframes, coins, and metrics for better insights
          </p>
        </div>
      </CardContent>
    </Card>
  );
};