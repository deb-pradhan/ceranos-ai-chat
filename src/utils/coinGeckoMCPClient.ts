import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

/**
 * CoinGecko MCP Tool interface
 */
export interface CoinGeckoMCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

/**
 * Tool call request structure
 */
export interface CoinGeckoMCPToolCall {
  tool_call_id: string;
  name: string;
  args: Record<string, unknown>;
}

/**
 * Tool execution result
 */
export interface CoinGeckoMCPToolResult {
  tool_call_id: string;
  role: "tool";
  content: string;
}

/**
 * CoinGecko Pro MCP Client
 * Connects to the CoinGecko Pro MCP server via HTTP Server-Sent Events
 */
export class CoinGeckoMCPClient {
  private mcp: Client;
  private transport: SSEClientTransport | null = null;
  public tools: CoinGeckoMCPTool[] = [];
  private isConnected = false;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.mcp = new Client({
      name: "ceranos-ai-chat-coingecko-mcp-client",
      version: "1.0.0",
    });
  }

  /**
   * Connect to the CoinGecko Pro MCP server and discover available tools
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('[CoinGecko MCP] Already connected');
      return;
    }

    console.log('[CoinGecko MCP] Connecting to CoinGecko Pro MCP server...');
    
    try {
      // Connect to CoinGecko Pro MCP server via HTTP SSE
      this.transport = new SSEClientTransport(
        new URL("https://mcp.pro-api.coingecko.com/sse")
      );

      await this.mcp.connect(this.transport);
      console.log('[CoinGecko MCP] Connected successfully');
      
      // List available tools from the MCP server (76+ tools with Pro API)
      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => ({
        name: tool.name,
        description: tool.description || "",
        inputSchema: tool.inputSchema,
      }));
      
      this.isConnected = true;
      console.log('[CoinGecko MCP] Discovered tools:', this.tools.map(t => t.name));
    } catch (error) {
      console.error('[CoinGecko MCP] Connection failed:', error);
      throw error;
    }
  }

  /**
   * Execute a tool on the CoinGecko MCP server
   */
  async runTool({ tool_call_id, name, args }: CoinGeckoMCPToolCall): Promise<CoinGeckoMCPToolResult> {
    if (!this.isConnected) {
      throw new Error('CoinGecko MCP client is not connected');
    }

    console.log('[CoinGecko MCP] Executing tool:', name, 'with args:', args);
    
    try {
      const result = await this.mcp.callTool({
        name,
        arguments: args,
      });

      console.log('[CoinGecko MCP] Tool execution successful:', name);

      return {
        tool_call_id,
        role: "tool",
        content: JSON.stringify(result.content),
      };
    } catch (error) {
      console.error('[CoinGecko MCP] Tool execution failed:', name, error);
      throw error;
    }
  }

  /**
   * Get available tools in OpenAI function format
   */
  getAvailableTools(): CoinGeckoMCPTool[] {
    return this.tools;
  }

  /**
   * Check if client is connected
   */
  isClientConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect from the CoinGecko MCP server
   */
  async disconnect(): Promise<void> {
    if (this.transport) {
      await this.mcp.close();
      this.isConnected = false;
      this.transport = null;
      console.log('[CoinGecko MCP] Disconnected');
    }
  }
}

/**
 * Singleton instance of the CoinGecko MCP client
 */
let coinGeckoMCPClientInstance: CoinGeckoMCPClient | null = null;

/**
 * Get the singleton CoinGecko MCP client instance
 */
export function getCoinGeckoMCPClient(): CoinGeckoMCPClient {
  if (!coinGeckoMCPClientInstance) {
    const apiKey = "CG-EkFpJi8M9zfqnEXKYbFzzQy5";
    coinGeckoMCPClientInstance = new CoinGeckoMCPClient(apiKey);
  }
  return coinGeckoMCPClientInstance;
}

/**
 * Ensure CoinGecko MCP client is connected and return the instance
 */
export async function ensureCoinGeckoMCPConnection(): Promise<CoinGeckoMCPClient> {
  const client = getCoinGeckoMCPClient();
  if (!client.isClientConnected()) {
    await client.connect();
  }
  return client;
}
