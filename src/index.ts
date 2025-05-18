#!/usr/bin/env node

/**
 * This is an MCP server that implements shadcn UI component generation.
 * It provides tools to:
 * - List available shadcn UI components
 * - Generate shadcn UI components with customization options
 * - Initialize shadcn in a project
 * - Get component documentation
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * List of available shadcn UI components
 */
const SHADCN_COMPONENTS = [
  { id: "accordion", name: "Accordion", description: "A vertically stacked set of interactive headings that each reveal a section of content." },
  { id: "alert", name: "Alert", description: "Displays a callout for user attention." },
  { id: "alert-dialog", name: "Alert Dialog", description: "A modal dialog that interrupts the user with important content and expects a response." },
  { id: "aspect-ratio", name: "Aspect Ratio", description: "Displays content within a desired ratio." },
  { id: "avatar", name: "Avatar", description: "An image element with a fallback for representing the user." },
  { id: "badge", name: "Badge", description: "Displays a badge or a component that looks like a badge." },
  { id: "button", name: "Button", description: "Displays a button or a component that looks like a button." },
  { id: "calendar", name: "Calendar", description: "A date field component that allows users to enter and edit date." },
  { id: "card", name: "Card", description: "Displays a card with header, content, and footer." },
  { id: "carousel", name: "Carousel", description: "A carousel component." },
  { id: "checkbox", name: "Checkbox", description: "A control that allows the user to toggle between checked and not checked." },
  { id: "collapsible", name: "Collapsible", description: "An interactive component which expands/collapses a panel." },
  { id: "combobox", name: "Combobox", description: "Autocomplete input and command palette with a list of suggestions." },
  { id: "command", name: "Command", description: "Command menu for quick actions." },
  { id: "context-menu", name: "Context Menu", description: "Displays a menu to the user — such as a set of actions or functions." },
  { id: "data-table", name: "Data Table", description: "Powerful table and datagrids with sorting, filtering and pagination." },
  { id: "date-picker", name: "Date Picker", description: "A date picker component with range and presets." },
  { id: "dialog", name: "Dialog", description: "A window overlaid on either the primary window or another dialog window." },
  { id: "drawer", name: "Drawer", description: "A panel that slides out from the edge of the screen." },
  { id: "dropdown-menu", name: "Dropdown Menu", description: "Displays a menu to the user — such as a set of actions or functions." },
  { id: "form", name: "Form", description: "Building forms with React Hook Form and Zod." },
  { id: "hover-card", name: "Hover Card", description: "For sighted users to preview content available behind a link." },
  { id: "input", name: "Input", description: "Displays a form input field or a component that looks like an input field." },
  { id: "label", name: "Label", description: "Renders an accessible label associated with controls." },
  { id: "menubar", name: "Menubar", description: "A horizontal menu bar with dropdown menus." },
  { id: "navigation-menu", name: "Navigation Menu", description: "A responsive navigation menu." },
  { id: "popover", name: "Popover", description: "Displays rich content in a portal, triggered by a button." },
  { id: "progress", name: "Progress", description: "Displays an indicator showing the completion progress of a task." },
  { id: "radio-group", name: "Radio Group", description: "A set of checkable buttons—known as radio buttons." },
  { id: "scroll-area", name: "Scroll Area", description: "Visually or semantically separates content." },
  { id: "select", name: "Select", description: "Displays a list of options for the user to pick from—triggered by a button." },
  { id: "separator", name: "Separator", description: "Visually or semantically separates content." },
  { id: "sheet", name: "Sheet", description: "Extends the Dialog component to display content that complements the main content of the screen." },
  { id: "skeleton", name: "Skeleton", description: "Used to show a placeholder while content is loading." },
  { id: "slider", name: "Slider", description: "An input where the user selects a value from within a given range." },
  { id: "sonner", name: "Sonner", description: "An opinionated toast component for React." },
  { id: "switch", name: "Switch", description: "A control that allows the user to toggle between checked and not checked." },
  { id: "table", name: "Table", description: "A responsive table component." },
  { id: "tabs", name: "Tabs", description: "A set of layered sections of content—known as tab panels." },
  { id: "textarea", name: "Textarea", description: "Displays a form textarea or a component that looks like a textarea." },
  { id: "toast", name: "Toast", description: "A succinct message that is displayed temporarily." },
  { id: "toggle", name: "Toggle", description: "A two-state button that can be either on or off." },
  { id: "toggle-group", name: "Toggle Group", description: "A set of two-state buttons that can be toggled on or off." },
  { id: "tooltip", name: "Tooltip", description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it." },
];

/**
 * Import package.json to get version information
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get version
const packageJsonPath = resolve(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const MCP_VERSION = packageJson.version;

/**
 * Create an MCP server with capabilities for resources and tools
 */
const server = new Server(
  {
    name: "shadcn-mcp",
    version: MCP_VERSION,
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    }
  }
);

/**
 * Handler for listing available shadcn UI components as resources.
 * Each component is exposed as a resource with:
 * - A shadcn:// URI scheme
 * - Plain text MIME type
 * - Human readable name and description
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: SHADCN_COMPONENTS.map(component => ({
      uri: `shadcn:///${component.id}`,
      mimeType: "text/plain",
      name: component.name,
      description: component.description
    }))
  };
});

/**
 * Handler for reading the documentation of a specific shadcn UI component.
 * Takes a shadcn:// URI and returns the component documentation as plain text.
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = url.pathname.replace(/^\//, '');
  const component = SHADCN_COMPONENTS.find(c => c.id === id);

  if (!component) {
    throw new Error(`Component ${id} not found`);
  }

  // Fetch documentation from shadcn UI website
  try {
    const response = await axios.get(`https://ui.shadcn.com/docs/components/${id}`);
    // Extract the main content from the HTML response
    // This is a simplified approach and might need adjustment based on the actual website structure
    const content = `# ${component.name}\n\n${component.description}\n\nFor detailed documentation and examples, visit: https://ui.shadcn.com/docs/components/${id}`;

    return {
      contents: [{
        uri: request.params.uri,
        mimeType: "text/plain",
        text: content
      }]
    };
  } catch (error) {
    // Fallback if we can't fetch the documentation
    return {
      contents: [{
        uri: request.params.uri,
        mimeType: "text/plain",
        text: `# ${component.name}\n\n${component.description}\n\nFor detailed documentation and examples, visit: https://ui.shadcn.com/docs/components/${id}`
      }]
    };
  }
});

/**
 * Handler that lists available tools.
 * Exposes tools for working with shadcn UI components.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_components",
        description: "List all available shadcn UI components",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "generate_component",
        description: "Generate a shadcn UI component in your project",
        inputSchema: {
          type: "object",
          properties: {
            component: {
              type: "string",
              description: "The name of the component to generate (e.g., button, card, dialog)"
            },
            project_path: {
              type: "string",
              description: "The path to your project where the component should be generated"
            },
            tailwind_css: {
              type: "boolean",
              description: "Whether your project uses Tailwind CSS (default: true)"
            },
            typescript: {
              type: "boolean",
              description: "Whether your project uses TypeScript (default: true)"
            }
          },
          required: ["component", "project_path"]
        }
      },
      {
        name: "init_shadcn",
        description: "Initialize shadcn in your project",
        inputSchema: {
          type: "object",
          properties: {
            project_path: {
              type: "string",
              description: "The path to your project where shadcn should be initialized"
            },
            tailwind_css: {
              type: "boolean",
              description: "Whether your project uses Tailwind CSS (default: true)"
            },
            typescript: {
              type: "boolean",
              description: "Whether your project uses TypeScript (default: true)"
            }
          },
          required: ["project_path"]
        }
      },
      {
        name: "get_component_info",
        description: "Get detailed information about a shadcn UI component",
        inputSchema: {
          type: "object",
          properties: {
            component: {
              type: "string",
              description: "The name of the component to get information about"
            }
          },
          required: ["component"]
        }
      }
    ]
  };
});

/**
 * Handler for the shadcn UI tools.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "list_components": {
      return {
        content: [{
          type: "text",
          text: JSON.stringify(SHADCN_COMPONENTS, null, 2)
        }]
      };
    }

    case "generate_component": {
      const component = String(request.params.arguments?.component);
      const projectPath = String(request.params.arguments?.project_path);
      const tailwindCss = request.params.arguments?.tailwind_css !== false;
      const typescript = request.params.arguments?.typescript !== false;

      // Validate component
      if (!SHADCN_COMPONENTS.some(c => c.id === component)) {
        return {
          content: [{
            type: "text",
            text: `Error: Component "${component}" not found. Use the list_components tool to see available components.`
          }],
          isError: true
        };
      }

      try {
        // Check if components.json exists
        const componentsJsonPath = `${projectPath}/components.json`;
        let componentsJsonExists = false;
        
        try {
          await execAsync(`test -f ${componentsJsonPath}`);
          componentsJsonExists = true;
        } catch (error) {
          // File doesn't exist, we'll handle this below
        }
        
        // If components.json doesn't exist, we need to initialize shadcn first
        if (!componentsJsonExists) {
          // Return the init command instead of executing it
          const initCommand = `cd ${projectPath} && npx shadcn@latest init -y`;
          return {
            content: [{
              type: "text",
              text: `Components.json not found. Please initialize shadcn first with this command:\n\n\`\`\`bash\n${initCommand}\n\`\`\`\n\nAfter initialization, you can add the ${component} component with:\n\n\`\`\`bash\ncd ${projectPath} && npx shadcn@latest add ${component} -y\n\`\`\``
            }]
          };
        }
        
        // Return the command to add the component
        const command = `cd ${projectPath} && npx shadcn@latest add ${component} -y`;
        
        return {
          content: [{
            type: "text",
            text: `To add the ${component} component to your project, run this command:\n\n\`\`\`bash\n${command}\n\`\`\``
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error generating component command: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }

    case "init_shadcn": {
      const projectPath = String(request.params.arguments?.project_path);
      const tailwindCss = request.params.arguments?.tailwind_css !== false;
      const typescript = request.params.arguments?.typescript !== false;
      
      // Return the command to initialize shadcn
      const initCommand = `cd ${projectPath} && npx shadcn@latest init -y`;
      
      // Also provide instructions for updating components.json if needed
      const updateTsCommand = typescript ? 
        `\n\n# After initialization, you may want to update components.json to set TypeScript:\njq '.tsx = true' ${projectPath}/components.json > ${projectPath}/components.json.tmp && mv ${projectPath}/components.json.tmp ${projectPath}/components.json` : '';
      
      return {
        content: [{
          type: "text",
          text: `To initialize shadcn in your project, run this command:\n\n\`\`\`bash\n${initCommand}\n\`\`\`${updateTsCommand}\n\nThis will set up shadcn UI in your project with the default configuration. You'll be prompted to select a base color during initialization.`
        }]
      };
    }

    case "get_component_info": {
      const componentId = String(request.params.arguments?.component);
      const component = SHADCN_COMPONENTS.find(c => c.id === componentId);

      if (!component) {
        return {
          content: [{
            type: "text",
            text: `Error: Component "${componentId}" not found. Use the list_components tool to see available components.`
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: "text",
          text: `# ${component.name}\n\n${component.description}\n\nFor detailed documentation and examples, visit: https://ui.shadcn.com/docs/components/${componentId}`
        }]
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Shadcn UI MCP server v${MCP_VERSION} running on stdio`);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
