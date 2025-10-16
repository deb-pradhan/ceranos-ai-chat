import { JLabsMCPClient, getMCPClient as getJLabsClient, ensureMCPConnection as ensureJLabsConnection } from './mcpClient';
import { CoinGeckoMCPClient, getCoinGeckoMCPClient, ensureCoinGeckoMCPConnection } from './coinGeckoMCPClient';

/**
 * Unified MCP Tool interface with source tracking
 */
export interface UnifiedMCPTool {
  name: string;
  description: string;
  inputSchema: any;
  source: 'jlabs' | 'coingecko';
}

/**
 * Unified tool call request structure
 */
export interface UnifiedMCPToolCall {
  tool_call_id: string;
  name: string;
  args: Record<string, unknown>;
  source: 'jlabs' | 'coingecko';
}

/**
 * Unified tool execution result
 */
export interface UnifiedMCPToolResult {
  tool_call_id: string;
  role: "tool";
  content: string;
  source: 'jlabs' | 'coingecko';
}

/**
 * Unified MCP Manager
 * Manages multiple MCP servers and prevents tool name conflicts
 */
export class UnifiedMCPManager {
  private jlabsClient: JLabsMCPClient | null = null;
  private coinGeckoClient: CoinGeckoMCPClient | null = null;
  private allTools: UnifiedMCPTool[] = [];
  private isInitialized = false;

  /**
   * Initialize connections to all MCP servers
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[Unified MCP] Already initialized');
      return;
    }

    console.log('[Unified MCP] Initializing all MCP connections...');

    // Initialize JLabs MCP client
    try {
      this.jlabsClient = await ensureJLabsConnection();
      const jlabsTools = this.jlabsClient.getAvailableTools();
      this.allTools.push(...jlabsTools.map(tool => ({
        ...tool,
        source: 'jlabs' as const
      })));
      console.log('[Unified MCP] JLabs MCP:', jlabsTools.length, 'tools loaded');
    } catch (error) {
      console.warn('[Unified MCP] JLabs MCP connection failed:', error);
    }

    // Initialize CoinGecko MCP client
    try {
      this.coinGeckoClient = await ensureCoinGeckoMCPConnection();
      const coinGeckoTools = this.coinGeckoClient.getAvailableTools();
      this.allTools.push(...coinGeckoTools.map(tool => ({
        ...tool,
        source: 'coingecko' as const
      })));
      console.log('[Unified MCP] CoinGecko MCP:', coinGeckoTools.length, 'tools loaded');
    } catch (error) {
      console.warn('[Unified MCP] CoinGecko MCP connection failed:', error);
    }

    this.isInitialized = true;
    console.log('[Unified MCP] Manager initialized with', this.allTools.length, 'total tools');
  }

  /**
   * Execute a tool on the appropriate MCP server
   */
  async runTool({ tool_call_id, name, args, source }: UnifiedMCPToolCall): Promise<UnifiedMCPToolResult> {
    if (!this.isInitialized) {
      throw new Error('Unified MCP Manager is not initialized');
    }

    console.log('[Unified MCP] Executing tool:', name, 'from source:', source);

    if (source === 'jlabs' && this.jlabsClient) {
      const result = await this.jlabsClient.runTool({
        tool_call_id,
        name,
        args,
      });
      return { ...result, source: 'jlabs' };
    } else if (source === 'coingecko' && this.coinGeckoClient) {
      const result = await this.coinGeckoClient.runTool({
        tool_call_id,
        name,
        args,
      });
      return { ...result, source: 'coingecko' };
    } else {
      throw new Error(`Unknown MCP source: ${source} or client not available`);
    }
  }

  /**
   * Get all available tools from all MCP servers
   */
  getAllTools(): UnifiedMCPTool[] {
    return this.allTools;
  }

  /**
   * Check if manager is initialized
   */
  isManagerInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Disconnect all MCP clients
   */
  async disconnectAll(): Promise<void> {
    if (this.jlabsClient) {
      await this.jlabsClient.disconnect();
    }
    if (this.coinGeckoClient) {
      await this.coinGeckoClient.disconnect();
    }
    this.isInitialized = false;
    this.allTools = [];
    console.log('[Unified MCP] All clients disconnected');
  }
}

/**
 * Singleton instance of the Unified MCP Manager
 */
let unifiedMCPManagerInstance: UnifiedMCPManager | null = null;

/**
 * Get the singleton Unified MCP Manager instance
 */
export function getUnifiedMCPManager(): UnifiedMCPManager {
  if (!unifiedMCPManagerInstance) {
    unifiedMCPManagerInstance = new UnifiedMCPManager();
  }
  return unifiedMCPManagerInstance;
}

/**
 * Ensure Unified MCP Manager is initialized and return the instance
 */
export async function ensureUnifiedMCPConnection(): Promise<UnifiedMCPManager> {
  const manager = getUnifiedMCPManager();
  if (!manager.isManagerInitialized()) {
    await manager.initialize();
  }
  return manager;
}
