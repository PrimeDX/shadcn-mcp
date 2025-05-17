# Contributing to Shadcn UI MCP Server

Thank you for considering contributing to the Shadcn UI MCP Server! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with the following information:
- A clear, descriptive title
- A detailed description of the issue
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment information (OS, Node.js version, etc.)

### Suggesting Features

If you have an idea for a new feature, please create an issue on GitHub with the following information:
- A clear, descriptive title
- A detailed description of the feature
- Why this feature would be useful
- Any implementation ideas you have

### Pull Requests

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Submit a pull request

Please include the following in your pull request:
- A clear, descriptive title
- A detailed description of the changes
- Any related issues (e.g., "Fixes #123")

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shadcn-mcp.git
cd shadcn-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. For development with auto-rebuild:
```bash
npm run watch
```

## Adding New Components

If you want to add support for new shadcn UI components:

1. Add the component to the `SHADCN_COMPONENTS` array in `src/index.ts`
2. Update any relevant documentation
3. Test the component generation

## Testing

Before submitting a pull request, please test your changes:

```bash
npm test
```

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
