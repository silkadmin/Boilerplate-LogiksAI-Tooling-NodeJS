# LogiksAI Tooling - Node.js

A Node.js-based tooling server that provides REST API, WebSocket and LPI functionality for running tools with background processing capabilities to provide hot plug tools to LogiksAI Server for tooling purpose.

This project is a boilerplate for all future use.

## Features

- Dynamically handle multiple tools.
- Simple architecture for adding new tools.
- MCP Compatibility

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp env_sample .env
   ```
   Edit `.env` with your configuration values.

## Usage

Start the server:
```bash
npm start
```

This will simultaneously start:
- REST API server
- WebSocket server  
- LAI Plugin client

## Project Structure

```
├── api/
│   ├── server.js       # Express REST API server
│   ├── socket.js       # WebSocket server
│   ├── laiplugin.js    # LAI Plugin client
│   └── run.js          # Tool execution logic
├── tools/
│   └── test.js         # Example tool implementation
├── data/               # Cached results storage
├── samples/            # Sample files
├── tools.json          # Tool definitions
├── main.js             # Application entry point
└── ecosystem.config.js # PM2 configuration
```

## Tool Configuration

Tools are defined in `tools.json` with the following structure:
```json
{
  "toolName": {
    "name": "toolName",
    "description": "Tool description",
    "inputSchema": {
      "type": "object",
      "properties": {
        "param1": {
          "type": "string",
          "description": "Parameter description"
        }
      },
      "required": ["param1"]
    },
    "identitySchema": {
      "type": "object",
      "description": "Identity schema for API",
      "properties": {
        "apikey": {
          "type": "string",
          "description": "API key for authentication"
        }
      },
      "required": ["apikey"]
    }
  }
}
```

## API Endpoints

The REST API provides endpoints for:
- Tool execution with background processing
- Retrieving cached results
- Listing available tools
- Health checks

## Development

The project uses ES modules (`"type": "module"`) and requires Node.js with support for modern JavaScript features.

## License

See [LICENSE](LICENSE) file for details.