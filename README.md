# Shadcn UI MCP Server

A Model Context Protocol (MCP) server that provides tools for working with [shadcn/ui](https://ui.shadcn.com/) components in your projects.

This MCP server allows AI coding assistants like Claude, Cursor, or Windsurf to generate and manage shadcn UI components in your projects, making it easier to build beautiful, accessible interfaces with AI assistance.

## Why Shadcn UI?

Shadcn UI offers elegant, accessible components that are easy to customize and integrate into modern React projects. Instead of generating UI components from scratch with AI (which can be token-intensive and expensive), you can leverage pre-built, beautifully designed components that follow best practices.

Benefits include:
- **Beautifully designed** components that are accessible and follow modern design principles
- **Easy to customize** with your own styling and branding
- **Code distribution** rather than package installation, giving you full control
- **Framework agnostic** with support for various React frameworks
- **Open source** and free to use

## What This MCP Server Does

The Shadcn Registry MCP makes your design system AI-ready with zero configuration. It allows your AI coding assistant to:

1. Browse available shadcn components
2. Generate components directly in your project
3. Access documentation and usage examples
4. Automate the entire setup process

This means you can simply tell your AI assistant which component you want to use, and it will handle the installation and configuration automatically.

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
- `init_shadcn` - Initialize shadcn in your project
  - Supports TypeScript and JavaScript
  - Configurable Tailwind CSS integration
- `get_component_info` - Get detailed information about a specific component

## Installation

### Prerequisites
- Node.js 18+ and npm
- An AI coding assistant (Claude, Cursor, or Windsurf)

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

This will automatically configure the MCP server for your AI assistant. The script preserves any existing MCP server configurations and only adds or updates the shadcn-mcp server.

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

#### For Claude VSCode Extension (Cline)

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

Once installed, you can ask your AI assistant to:

1. List available shadcn UI components:
```
What shadcn UI components are available?
```

2. Generate a component in your project:
```
Generate a shadcn UI button component in my project at /path/to/my/project
```

3. Initialize shadcn in your project:
```
Initialize shadcn in my project at /path/to/my/project
```

4. Get information about a specific component:
```
Tell me about the shadcn dialog component
```

5. Create a complete UI with multiple components:
```
Create a dashboard using shadcn components in my Next.js project
```

### Working with Next.js Projects

For Next.js projects, you can initialize a new project with shadcn UI using:

```bash
npx create-next-app@latest my-app
cd my-app
npx shadcn@latest init
```

Then ask your AI assistant to add specific components to your project.

### Alternative: Using Client Rules (for Cline)

As an alternative to the MCP server, you can also use Client Rules in Cline to work with shadcn components:

1. Create a file named `client_rules.md` in your project
2. Add the following content:

```markdown
Always use shadcn components where applicable.
Leverage the Context 7 MCP tool as your primary discovery engine for UI primitives, tokens, and unknown packages.
```

3. Save the file and Cline will follow these rules when working with your project

## Benefits Over Manual Component Generation

Using this MCP server with your AI assistant offers several advantages:

1. **Token Efficiency**: Generating UI components from scratch with AI can consume 100k-500k tokens, which can be expensive with models like GPT-4 or Claude 3 Opus. This approach is much more efficient.

2. **Zero Configuration**: The MCP server handles all the setup and configuration automatically.

3. **Consistency**: Components follow shadcn's design principles and best practices.

4. **Accessibility**: All components are built with accessibility in mind.

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
