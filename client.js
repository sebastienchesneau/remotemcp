import {
  Client,
} from "@modelcontextprotocol/sdk/client/index.js";
import {
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/sdk/client/streamableHttp.js";

/**
 * Transport HTTP streamable
 */
const transport = new StreamableHTTPClientTransport(
  "http://localhost:3000/mcp"
);

/**
 * Client MCP
 */
const client = new Client(
  {
    name: "example-mcp-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);
console.log('ss');
await client.connect(transport);
console.log('ss2');
/**
 * Appel du tool MCP
 */
const result = await client.callTool({
  name: "add",
  arguments: {
    a: 10,
    b: 32,
  },
});

console.log("📦 Résultat MCP :", result);
