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
    <Card className="mx-6 mt-6 mb-4 border-border-line bg-bg-panel">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-text-primary">
          Ask CERANOS about the markets
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-8 w-8 text-text-secondary hover:text-text-primary hover:bg-bg-base"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-text-secondary text-sm leading-relaxed">
          Get instant insights on crypto markets, sentiment analysis, and on-chain metrics. 
          Try asking about specific coins, market trends, or risk assessments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examples.map((example, index) => {
            const IconComponent = example.icon;
            return (
              <button
                key={index}
                onClick={() => onExampleClick(example.text)}
                className="flex items-start gap-3 p-3 border border-border-line bg-bg-base hover:bg-bg-panel transition-smooth text-left group"
              >
                <div className={`p-1.5 bg-${example.color}/10 text-${example.color} group-hover:bg-${example.color}/20 transition-smooth`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-accent-blue mb-1">
                    {example.category}
                  </div>
                  <div className="text-sm text-text-primary group-hover:text-accent-blue transition-smooth line-clamp-2">
                    {example.text}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border-line">
          <p className="text-xs text-text-secondary">
            💡 <strong>Pro tip:</strong> Be specific about timeframes, coins, and metrics for better insights
          </p>
        </div>
      </CardContent>
    </Card>
  );
};