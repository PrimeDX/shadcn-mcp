#!/usr/bin/env node

/**
 * Installation script for the Shadcn UI MCP Server
 * This script automatically configures the MCP server for Claude Desktop and VSCode extension
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the absolute path to the build/index.js file
const serverPath = path.resolve(__dirname, 'build', 'index.js');

// Check if the build exists
if (!fs.existsSync(serverPath)) {
  console.error('Error: Server build not found. Please run "npm run build" first.');
  process.exit(1);
}

// Make the server executable
try {
  fs.chmodSync(serverPath, '755');
  console.log('✅ Made server executable');
} catch (error) {
  console.warn('⚠️ Could not make server executable:', error.message);
}

// Configuration object for the MCP server
const serverConfig = {
  "command": "node",
  "args": [serverPath],
  "disabled": false,
  "autoApprove": []
};

// Get the home directory
const homeDir = os.homedir();

// Configure for Claude Desktop
function configureClaudeDesktop() {
  let configPath;
  
  // Determine the config path based on the OS
  switch (process.platform) {
    case 'darwin': // macOS
      configPath = path.join(homeDir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
      break;
    case 'win32': // Windows
      configPath = path.join(homeDir, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
      break;
    case 'linux': // Linux
      configPath = path.join(homeDir, '.config', 'Claude', 'claude_desktop_config.json');
      break;
    default:
      console.warn('⚠️ Unsupported platform for Claude Desktop configuration');
      return false;
  }

  // Create the directory if it doesn't exist
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    try {
      fs.mkdirSync(configDir, { recursive: true });
    } catch (error) {
      console.warn(`⚠️ Could not create directory ${configDir}:`, error.message);
      return false;
    }
  }

  // Read the existing config or create a new one
  let config = { mcpServers: {} };
  if (fs.existsSync(configPath)) {
    try {
      const configData = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(configData);
      if (!config.mcpServers) {
        config.mcpServers = {};
      }
    } catch (error) {
      console.warn(`⚠️ Could not read config file ${configPath}:`, error.message);
    }
  }

  // Check if the server is already configured
  const isUpdate = config.mcpServers['shadcn-mcp'] !== undefined;
  
  // Add the server configuration
  config.mcpServers['shadcn-mcp'] = serverConfig;

  // Write the updated config
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    if (isUpdate) {
      console.log(`✅ Updated existing shadcn-mcp configuration in Claude Desktop (${configPath})`);
    } else {
      console.log(`✅ Added shadcn-mcp configuration to Claude Desktop (${configPath})`);
    }
    return true;
  } catch (error) {
    console.warn(`⚠️ Could not write config file ${configPath}:`, error.message);
    return false;
  }
}

// Configure for Claude VSCode Extension
function configureClaudeVSCode() {
  let configPath;
  
  // Determine the config path based on the OS
  switch (process.platform) {
    case 'darwin': // macOS
      configPath = path.join(homeDir, 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');
      break;
    case 'win32': // Windows
      configPath = path.join(homeDir, 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');
      break;
    case 'linux': // Linux
      configPath = path.join(homeDir, '.config', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');
      break;
    default:
      console.warn('⚠️ Unsupported platform for Claude VSCode configuration');
      return false;
  }

  // Check if the VSCode extension is installed
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    console.log('ℹ️ Claude VSCode extension not detected, skipping configuration');
    return false;
  }

  // Create the settings directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    try {
      fs.mkdirSync(configDir, { recursive: true });
    } catch (error) {
      console.warn(`⚠️ Could not create directory ${configDir}:`, error.message);
      return false;
    }
  }

  // Read the existing config or create a new one
  let config = { mcpServers: {} };
  if (fs.existsSync(configPath)) {
    try {
      const configData = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(configData);
      if (!config.mcpServers) {
        config.mcpServers = {};
      }
    } catch (error) {
      console.warn(`⚠️ Could not read config file ${configPath}:`, error.message);
    }
  }

  // Check if the server is already configured
  const isUpdate = config.mcpServers['shadcn-mcp'] !== undefined;
  
  // Add the server configuration
  config.mcpServers['shadcn-mcp'] = serverConfig;

  // Write the updated config
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    if (isUpdate) {
      console.log(`✅ Updated existing shadcn-mcp configuration in Claude VSCode Extension (${configPath})`);
    } else {
      console.log(`✅ Added shadcn-mcp configuration to Claude VSCode Extension (${configPath})`);
    }
    return true;
  } catch (error) {
    console.warn(`⚠️ Could not write config file ${configPath}:`, error.message);
    return false;
  }
}

// Main installation process
console.log('🚀 Installing Shadcn UI MCP Server...');

const desktopConfigured = configureClaudeDesktop();
const vscodeConfigured = configureClaudeVSCode();

if (desktopConfigured || vscodeConfigured) {
  console.log('\n✨ Installation complete!');
  console.log('\nYou can now use the Shadcn UI MCP Server with Claude AI.');
  console.log('Try asking Claude:');
  console.log('  - "What shadcn UI components are available?"');
  console.log('  - "Generate a shadcn UI button component in my project at /path/to/my/project"');
  console.log('  - "Tell me about the shadcn dialog component"');
} else {
  console.error('\n❌ Installation failed. Please try manual installation as described in the README.md file.');
}
