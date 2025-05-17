# Shadcn UI MCP Server

A Model Context Protocol (MCP) server that provides tools for working with [shadcn/ui](https://ui.shadcn.com/) components in your projects.

This MCP server allows Claude AI to generate and manage shadcn UI components in your projects, making it easier to build beautiful, accessible interfaces with Claude's assistance.

## Features

### Resources
- Access documentation for all shadcn UI components via `shadcn://` URIs
- Each component has detailed information and usage examples
- Plain text documentation for easy consumption

### Tools
- `list_components` - List all available shadcn UI components
- `generate_component` - Generate a shadcn UI component in your project
  - Supports TypeScript and JavaScript
  - Configurable Tailwind CSS integration
- `get_component_info` - Get detailed information about a specific component

## Installation

### Prerequisites
- Node.js 18+ and npm
- Claude AI (Desktop app or VSCode extension)

### Quick Install

1. Clone this repository:
```bash
git clone https://github.com/yourusername/shadcn-mcp.git
cd shadcn-mcp
```

2. Install dependencies and build:
```bash
npm install
npm run build
```

3. Run the installation script:
```bash
node install.js
```

This will automatically configure the MCP server for both Claude Desktop and VSCode extension (if installed). The script preserves any existing MCP server configurations and only adds or updates the shadcn-mcp server.

### Manual Installation

#### For Claude Desktop

Edit your Claude Desktop configuration file:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Add the following configuration:
```json
{
  "mcpServers": {
    "shadcn-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/shadcn-mcp/build/index.js"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

#### For Claude VSCode Extension

Edit your Claude VSCode extension configuration file:
- macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Windows: `%APPDATA%/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Linux: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

Add the following configuration:
```json
{
  "mcpServers": {
    "shadcn-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/shadcn-mcp/build/index.js"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## Usage

Once installed, you can ask Claude to:

1. List available shadcn UI components:
```
What shadcn UI components are available?
```

2. Generate a component in your project:
```
Generate a shadcn UI button component in my project at /path/to/my/project
```

3. Get information about a specific component:
```
Tell me about the shadcn dialog component
```

## Development

For development with auto-rebuild:
```bash
npm run watch
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
