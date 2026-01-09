import express from "express";
import { 
  McpServer
} from "@modelcontextprotocol/sdk/server/mcp.js";
import {  StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(express.json());

/**
 * Création du serveur MCP
 */

function getServer() {
  const mcpServer = new McpServer({
    name: "example-mcp-server",
    version: "1.0.0",
  });

  /**
   * Déclaration d’un tool MCP
   */
  mcpServer.registerTool(
    "additionner",
    {
      description: "Additionne deux nombres",
      inputSchema: {
        a: z.number().describe("Premier nombre"),
        b: z.number().describe("Deuxième nombre"),
      }
    },
    async ({ a, b }) => {
      // Résultat final
      return {
        content: [
          {
            type: "text",
            text: `Résultat: ${a + b}`,
          },
        ],
      };
    }
  );
  // Tool simple
  mcpServer.registerTool(
    "ping",
    {
      description: "function that allow to ping",
      argsSchema: {}
    },
    async () => ({
      content: [{ type: "text", text: "pong" }],
    })
  );
  return mcpServer;
}


app.post("/mcp", async (req, res) => {
  try {
    console.log("POUET");
    const server = getServer();
    const transport = new StreamableHTTPServerTransport({sessionIdGenerator: undefined});
    console.log("POUET 2", req);
    res.on('close', () => {
      console.log('Request Closed');
      transport.close()
      server.close();
    });


    await server.connect(transport);
    await transport.handleRequest(req, res, req.body)
    console.log("POUET 3");
  }
  catch(error) {
    console.error('Error handling MCP request', error);
    if(!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Iternal Server error"
        },
        id: null
      })
    }
  }
});



/**
 * Endpoint Streamable HTTP MCP
 */
// app.post("/mcp", async (req, res) => {
//   console.log("POUET");
//   const server = getServer();
//   const transport = new StreamableHTTPServerTransport(req, res);
//   console.log("POUET 2", req);
//   res.on('close', () => {
//     console.log('Request Closed');
//     transport.close()
//     server.close();
//   });


//   await mcpServer.connect(transport);
//   console.log("POUET 3");
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ MCP Server prêt sur http://localhost:3000/mcp");
});
