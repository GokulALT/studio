# CocoWise - Smart Coconut Farming Assistant

CocoWise is a Next.js application designed to help coconut farmers optimize their harvest schedules and manage farm data effectively. It leverages AI-powered insights for better decision-making.

## Features

*   **Harvest Logging:** Keep detailed records of coconut harvests, including count, weight, sales price, labor costs, and other expenses.
*   **Rainfall Tracking:** Log rainfall data, either manually or by fetching from online weather services, to correlate with harvest yields.
*   **AI-Powered Analysis:** Get recommendations on optimal harvest timings based on historical data, rainfall, and custom-defined intervals.
*   **Data Visualization:** View charts and graphs for harvest trends, rainfall patterns, and financial overviews.
*   **Custom Harvest Intervals:** Define specific harvest schedules or triggers relevant to your farm.
*   **Settings Management:** Configure application preferences and custom parameters.

## Tech Stack

*   **Next.js:** React framework for building the user interface and server-side logic.
*   **React:** JavaScript library for building user interfaces.
*   **ShadCN UI Components:** Pre-built UI components for a consistent and modern look and feel.
*   **Tailwind CSS:** Utility-first CSS framework for styling.
*   **Genkit (for AI):** Toolkit for integrating generative AI models (e.g., for analysis and recommendations).
*   **MongoDB:** NoSQL database for storing application data.
*   **TypeScript:** Superset of JavaScript for type safety and improved developer experience.

## Getting Started

This project is a starter for Firebase Studio. To get started, explore the `src/app/page.tsx` file to see the main dashboard.

### Prerequisites

*   Node.js (version 18.x or later recommended)
*   npm or yarn

### Environment Variables

Create a `.env` file in the root of your project and add the following, replacing the placeholder with your actual MongoDB connection string:

```env
MONGODB_URI="your_mongodb_connection_string"
MONGODB_DB_NAME="cocowiseData" # Or your preferred database name
```

### Running Locally

1.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

2.  Run the Genkit development server (for AI flows, in a separate terminal):
    ```bash
    npm run genkit:dev
    ```

3.  Run the Next.js development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) (or your configured port) in your browser to see the application.

### Building for Production

```bash
npm run build
```

### Starting the Production Server

```bash
npm run start
```

## Project Structure

*   `src/app/`: Next.js App Router pages and API routes.
*   `src/components/`: Reusable React components.
*   `src/ai/`: Genkit flows and tools for AI functionality.
*   `src/lib/`: Utility functions, type definitions, and MongoDB connection.
*   `src/context/`: React Context for global state management.
*   `public/`: Static assets.

