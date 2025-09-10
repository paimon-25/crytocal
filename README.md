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

