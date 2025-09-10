# Crypto Purchasing Power Calculator
A real-time calculator that makes cryptocurrency prices relatable by comparing them to familiar purchases like coffee, gas, groceries, and streaming subscriptions. This application translates abstract crypto values into tangible, everyday purchasing power, helping users understand what their digital assets can truly buy.

## Features
*   **Real-time Cryptocurrency Data**: Fetches current prices for a wide range of cryptocurrencies from CoinGecko.
*   **Multiple Fiat Currencies**: Allows users to select various fiat currencies (e.g., USD, EUR, GBP) for comparison, with exchange rates powered by Frankfurter API.
*   **Everyday Item Comparisons**: Displays how many common items (coffee, gas, groceries, etc.) a specified amount of cryptocurrency can purchase.
*   **Dynamic Calculations**: Instantly updates purchasing power calculations based on user-selected crypto, amount, and fiat currency.
*   **User-Friendly Interface**: Provides an intuitive and responsive design for easy navigation and input.
*   **Dark/Light Mode**: Supports theme switching for a personalized viewing experience.
*   **Clear Error Handling**: Offers informative feedback for any issues encountered during data fetching or calculations.
*   **MCP Server Integration**: Utilizes a custom-generated MCP server for seamless API interactions with AI agents and enhanced automation capabilities.

## Technologies Used
This application is built using a modern web development stack:
*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **UI Components**: Shadcn/UI (built with Radix UI and Tailwind CSS)
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Forms**: React Hook Form with Zod for validation
*   **State Management**: React Context API, `useState`, `useReducer`
*   **Notifications**: Sonner
*   **Animation**: `tailwindcss-animate`
*   **Data Fetching**: Native `fetch` API for external APIs (CoinGecko, Frankfurter API)
*   **MCP Server**: Custom-generated using Postman's MCP Generator for AI agent integration

## MCP Server Integration
This project utilizes a custom Model Context Protocol (MCP) server generated through Postman's MCP Generator to enable seamless integration with AI agents and enhanced automation capabilities.

### MCP Server Setup
The MCP server was created using:
- **Postman MCP Generator**: [https://www.postman.com/explore/mcp-generator](https://www.postman.com/explore/mcp-generator)
- **CoinGecko API Integration**: Leverages CoinGecko's public API from the Postman API Network
- **Frankfurter API Integration**: Utilizes currency exchange rate APIs for multi-currency support

### Benefits of MCP Integration
- **AI Agent Compatibility**: Enables AI assistants like Claude to interact with cryptocurrency data
- **Automated Workflows**: Supports automated price monitoring and purchasing power calculations
- **Standardized Protocol**: Uses the open Model Context Protocol standard for reliable AI-to-API communication
- **Extensible Architecture**: Easy to add new cryptocurrency APIs and features through the MCP framework

### Using the MCP Server
The generated MCP server can be integrated with:
- Claude Desktop
- VS Code with MCP extensions
- Other MCP-compatible AI development environments

For detailed setup instructions, refer to the [Postman MCP Documentation](https://learning.postman.com/docs/postman-ai-developer-tools/mcp-servers/overview/)

## Postman Notebook Documentation
This project includes a comprehensive **Postman Notebook** that provides an interactive walkthrough of the Crypto Purchasing Power Calculator's API integrations and workflows.
What's Included in the Notebook
The Postman Notebook offers a hands-on experience with:
- **Interactive API Testing**: Live requests to CoinGecko API for real-time cryptocurrency data[82]
- **Currency Conversion Workflows**: Step-by-step examples of fetching exchange rates from Frankfurter API[82]

Accessing the Notebook
   **[View Interactive Notebook →](https://documenter.postman.com/view/your-notebook-id/your-notebook-key)**


## Getting Started
Follow these steps to set up and run the project locally:

### Prerequisites
*   Node.js (LTS version recommended)
*   npm, yarn, pnpm, or bun (your preferred package manager)


### Cloning the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Installation

Install the project dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application. The page will auto-update as you edit the files.

