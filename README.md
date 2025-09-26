# NASDAQ App

A modern, real-time NASDAQ stock explorer built with React, TypeScript, and Vite. This application provides an intuitive interface for browsing and searching NASDAQ stocks with smooth performance and responsive design.

## 🚀 Features

- **Real-time Stock Data**: Browse and search NASDAQ stocks with live data
- **Infinite Scroll**: Seamless pagination with automatic loading
- **Search Functionality**: Search stocks by symbol or company name
- **Responsive Design**: Optimized for desktop and mobile devices
- **Network Status**: Real-time network connectivity indicator
- **Performance Optimized**: Built with React 19, Vite, and modern optimization techniques
- **Smooth Animations**: Polished UI with loading states and transitions

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Radix UI components
- **State Management**: TanStack Query (React Query)
- **Routing**: TanStack Router
- **Icons**: Lucide React
- **Build Tool**: Vite with React Compiler
- **Package Manager**: PNPM

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

## 📁 Project Structure

```
nasdaq-app/
├── apps/
│   └── web/                 # Main React application
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── hooks/       # Custom React hooks
│       │   ├── lib/         # Utility functions and configurations
│       │   ├── routes/      # TanStack Router routes
│       │   └── types/       # TypeScript type definitions
│       ├── public/          # Static assets
│       └── package.json     # Web app dependencies
├── packages/                # Shared packages (currently empty)
│   ├── api/                 # Future API package
│   ├── core/                # Future core utilities
│   └── storage/             # Future storage utilities
└── package.json             # Root package configuration
```

## 🔧 Available Scripts

### Root Level Commands

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm test` - Run tests across all packages

### Web App Specific Commands

Navigate to `apps/web/` and run:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🎨 Key Components

- **ExploreScreen**: Main stock browsing interface with search and infinite scroll
- **StockCard**: Individual stock display component
- **SplashScreen**: Application loading screen
- **PerformanceMonitor**: Performance tracking component

## 🔍 Features in Detail

### Search & Filtering
- Real-time search with debounced input
- Search by stock symbol or company name
- URL-synced search parameters

### Performance Optimizations
- React 19 with React Compiler enabled
- Infinite scroll with intersection observer
- Debounced search to reduce API calls
- Optimized re-renders with proper memoization

### Network Handling
- Network status monitoring
- Graceful offline handling
- Error boundaries and fallback states

## 🌐 Browser Support

This application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

- The project uses PNPM workspaces for monorepo management
- React Compiler is enabled for automatic optimizations
- Tailwind CSS 4 is used for styling with custom design tokens
- The app follows modern React patterns with hooks and functional components

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Dependencies not installing**
```bash
# Clear PNPM cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

**Build errors**
```bash
# Clean build and rebuild
pnpm build --clean
```

## 📄 License

This project is licensed under the ISC License.

---
