# NASDAQ App

A modern, real-time NASDAQ stock explorer built with React, TypeScript, and Vite. This application provides an intuitive interface for browsing and searching NASDAQ stocks with smooth performance and responsive design.

- Splash screen has 3000ms delay for demo but in production splash screen chunk is loaded alone to appear instant and it pre-fetches the explore screen data to appear instant as well

## Initial architecture descussions
# When I looked at the task we have 3 main features
- Splash screen -> I saw opportunity for bundle splitting because you normally want landing page to be instant and fast, then explore screen is loaded in parallel with data pre-fetched
- Explore screen -> Main app functionality 
   - BE Search while typing -> normal use case would be a 300ms (usually less but it depends) debounce after last key stroke
      - If we want to go extra we can have deferred local search (we search our query cache or IDB if we have presisted data if not found we go to BE) but I found it not ideal because of how search works in Polygon
   - Stock Grid -> to show the stocks ideally it we want virtualization but it was a bit a stretch for our use case (if we want extra reusability could use LegendList v2 for web and RN)
   
# Lib choices
- server-state maanagement tanstack query was an easy choice for -> infinte loading, in memory caching (also presistense if we wanted), also works fine if we want WS realtime will just batch update the query cache or maybe RTQ Query? 
- client-state management -> React local state was enough
- routing -> tanstack router not needed but i just wanted to try it
- styling -> tailwind v4 with shadcn ui components (no brainer also we can fight about using base-ui instead)
- testing -> vitest and react testing library
- linting -> eslint with typescript and react rules (But I would go for biomejs or ultracite)
- zod -> no brainer for data validation (But Usually I would do Automatic generation from BE swagger spec) and treat my API as an SDK (seperate package for web and RN)
- ts-pattern -> for exhaustive matching and better code organization (again just trying things out)

## 🚀 Features

- **Infinite Scroll**: Seamless pagination with automatic loading
- **Search Functionality**: Search stocks by symbol or company name
- **Responsive Design**: Optimized for desktop and mobile devices
- **Bundle splitting and pre-fetching**: For instant loading
- **Caching**: API responses are cached to reduce redundant requests
- **Error Handling**: Graceful error handling and retry mechanism
- **Rate Limiting**: Graceful handling of rate limit errors with user feedback and retry after 15 seconds
- **RTL Support**: Respect RTL when doing UI
- **Unit Tests**: Basic unit tests for critical components



## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **PNPM** (version 8 or higher)

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nasdaq-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application


## 🔧 Available Scripts

### Root Level Commands

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm test` - Run tests across all packages
- `pnpm --filter web lint` - Lint web app

### Web App Specific Commands

Navigate to `apps/web/` and run:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
