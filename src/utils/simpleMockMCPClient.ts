/**
 * Simple Mock MCP Client - No Initialization Required
 * Returns hardcoded mock tools immediately without async operations
 */

export interface SimpleMCPTool {
  name: string;
  description: string;
  inputSchema: any;
  source: 'jlabs' | 'coingecko';
}

export interface SimpleMCPToolCall {
  tool_call_id: string;
  name: string;
  args: Record<string, unknown>;
  source: 'jlabs' | 'coingecko';
}

export interface SimpleMCPToolResult {
  tool_call_id: string;
  role: "tool";
  content: string;
  source: 'jlabs' | 'coingecko';
}

/**
 * SimpleMockMCPManager - Returns mock tools instantly
 * No initialization, no async, no CORS errors
 */
export class SimpleMockMCPManager {
  private mockTools: SimpleMCPTool[] = [
    // CoinGecko Mock Tools
    {
      name: 'get_crypto_price',
      description: 'Get current cryptocurrency price and market data',
      source: 'coingecko',
      inputSchema: {
        type: 'object',
        properties: {
          coin_id: {
            type: 'string',
            description: 'The coin ID (e.g., bitcoin, ethereum)',
          },
          vs_currency: {
            type: 'string',
            description: 'The target currency (e.g., usd, eur)',
            default: 'usd',
          },
        },
        required: ['coin_id'],
      },
    },
    {
      name: 'search_coins',
      description: 'Search for cryptocurrencies by name or symbol',
      source: 'coingecko',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (name or symbol)',
          },
        },
        required: ['query'],
      },
    },
    // JLabs Mock Tools
    {
      name: 'get_defi_metrics',
      description: 'Get DeFi protocol metrics and analytics',
      source: 'jlabs',
      inputSchema: {
        type: 'object',
        properties: {
          protocol: {
            type: 'string',
            description: 'The DeFi protocol name',
          },
        },
        required: ['protocol'],
      },
    },
  ];

  /**
   * Get all available mock tools - INSTANT, NO ASYNC
   */
  getAllTools(): SimpleMCPTool[] {
    return this.mockTools;
  }

  /**
   * Execute a mock tool call
   */
  async runTool({ tool_call_id, name, args, source }: SimpleMCPToolCall): Promise<SimpleMCPToolResult> {
    console.log(`[SimpleMockMCP] Executing ${source} tool: ${name}`, args);

    // Generate mock responses based on tool name
    let content = '';

    if (name === 'get_crypto_price') {
      const coin = args.coin_id || 'bitcoin';
      const currency = args.vs_currency || 'usd';
      content = JSON.stringify({
        coin_id: coin,
        current_price: Math.random() * 50000 + 10000,
        market_cap: Math.random() * 1000000000000,
        volume_24h: Math.random() * 50000000000,
        price_change_24h: (Math.random() - 0.5) * 1000,
        currency: currency,
      });
    } else if (name === 'search_coins') {
      const query = String(args.query || '');
      content = JSON.stringify({
        results: [
          { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
          { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
        ].filter(coin => 
          coin.name.toLowerCase().includes(query.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(query.toLowerCase())
        ),
      });
    } else if (name === 'get_defi_metrics') {
      const protocol = args.protocol || 'unknown';
      content = JSON.stringify({
        protocol: protocol,
        tvl: Math.random() * 10000000000,
        volume_24h: Math.random() * 1000000000,
        users_24h: Math.floor(Math.random() * 100000),
      });
    } else {
      content = JSON.stringify({
        error: 'Unknown tool',
        tool: name,
      });
    }

    return {
      tool_call_id,
      role: 'tool',
      content,
      source,
    };
  }
}

// Singleton instance - NO INITIALIZATION NEEDED
let simpleMockMCPInstance: SimpleMockMCPManager | null = null;

/**
 * Get simple mock MCP manager - INSTANT, NO ASYNC
 */
export function getSimpleMockMCPConnection(): SimpleMockMCPManager {
  if (!simpleMockMCPInstance) {
    simpleMockMCPInstance = new SimpleMockMCPManager();
  }
  return simpleMockMCPInstance;
}
