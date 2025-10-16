import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

/**
 * MCP Tool interface matching the server's tool definition
 */
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

/**
 * Tool call request structure
 */
export interface MCPToolCall {
  tool_call_id: string;
  name: string;
  args: Record<string, unknown>;
}

/**
 * Tool execution result
 */
export interface MCPToolResult {
  tool_call_id: string;
  role: "tool";
  content: string;
}

/**
 * JLabs MCP Client
 * Connects to the JLabs MCP server via HTTP Server-Sent Events
 */
export class JLabsMCPClient {
  private mcp: Client;
  private transport: SSEClientTransport | null = null;
  public tools: MCPTool[] = [];
  private isConnected = false;

  constructor() {
    this.mcp = new Client({
      name: "ceranos-ai-chat-mcp-client",
      version: "1.0.0",
    });
  }

  /**
   * Connect to the JLabs MCP server and discover available tools
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('[MCP] Already connected');
      return;
    }

    console.log('[MCP] Connecting to JLabs MCP server...');
    
    try {
      // Connect to JLabs MCP server via HTTP SSE
      this.transport = new SSEClientTransport(
        new URL("https://jlabs-mcp.up.railway.app/mcp")
      );

      await this.mcp.connect(this.transport);
      console.log('[MCP] Connected successfully');
      
      // List available tools from the MCP server
      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => ({
        name: tool.name,
        description: tool.description || "",
        inputSchema: tool.inputSchema,
      }));
      
      this.isConnected = true;
      console.log('[MCP] Discovered tools:', this.tools.map(t => t.name));
    } catch (error) {
      console.error('[MCP] Connection failed:', error);
      throw error;
    }
  }

  /**
   * Execute a tool on the MCP server
   */
  async runTool({ tool_call_id, name, args }: MCPToolCall): Promise<MCPToolResult> {
    if (!this.isConnected) {
      throw new Error('MCP client is not connected');
    }

    console.log('[MCP] Executing tool:', name, 'with args:', args);
    
    try {
      const result = await this.mcp.callTool({
        name,
        arguments: args,
      });

      console.log('[MCP] Tool execution successful:', name);

      return {
        tool_call_id,
        role: "tool",
        content: JSON.stringify(result.content),
      };
    } catch (error) {
      console.error('[MCP] Tool execution failed:', name, error);
      throw error;
    }
  }

  /**
   * Get available tools in OpenAI function format
   */
  getAvailableTools(): MCPTool[] {
    return this.tools;
  }

  /**
   * Check if client is connected
   */
  isClientConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect(): Promise<void> {
    if (this.transport) {
      await this.mcp.close();
      this.isConnected = false;
      this.transport = null;
      console.log('[MCP] Disconnected');
    }
  }
}

/**
 * Singleton instance of the MCP client
 */
let mcpClientInstance: JLabsMCPClient | null = null;

/**
 * Get the singleton MCP client instance
 */
export function getMCPClient(): JLabsMCPClient {
  if (!mcpClientInstance) {
    mcpClientInstance = new JLabsMCPClient();
  }
  return mcpClientInstance;
}

/**
 * Ensure MCP client is connected and return the instance
 */
export async function ensureMCPConnection(): Promise<JLabsMCPClient> {
  const client = getMCPClient();
  if (!client.isClientConnected()) {
    await client.connect();
  }
  return client;
}
