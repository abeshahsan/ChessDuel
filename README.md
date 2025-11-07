# ♟️ ChessDuel - Real-Time Multiplayer Chess Platform

> **A sophisticated real-time chess application showcasing modern web development expertise and clean architecture principles**

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Material-UI](https://img.shields.io/badge/MUI-6.3.1-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.5.0-764ABC?style=for-the-badge&logo=redux&logoColor=white)

</div>

## 🎯 Project Overview

ChessDuel is a production-ready, real-time multiplayer chess platform built with cutting-edge web technologies. This project demonstrates advanced full-stack development skills, emphasizing clean architecture, real-time communication, and modern UI/UX principles.

### 🌟 Key Highlights

- **🏗️ Modern Architecture**: Built with Next.js 15 App Router and React 19 Server Components
- **⚡ Real-Time Multiplayer**: WebSocket-based gameplay using Socket.IO for instant move synchronization
- **🎨 Professional UI**: Material-UI design system with custom theming and responsive layouts
- **🔐 Authentication**: Secure OAuth integration with GitHub and Google providers
- **♟️ Chess Logic**: Comprehensive game validation using chess.js with move history and game state management
- **📱 Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
- **🧩 Modular Codebase**: SOLID principles implementation with clean component separation

## 🚀 Technical Stack

### Frontend
- **⚛️ React 19** - Latest React with concurrent features and server components
- **📘 TypeScript 5** - Strict type safety and modern ES features
- **🎨 Material-UI 6.3.1** - Professional component library with custom theming
- **💅 TailwindCSS 3.4** - Utility-first CSS framework for rapid styling
- **🎲 Redux Toolkit 2.5** - State management with modern Redux patterns
- **♞ react-chessboard 4.7** - Interactive chess board component

### Backend & Infrastructure
- **⚡ Next.js 15.5.6** - Full-stack framework with App Router and Turbopack
- **🔌 Socket.IO 4.8.1** - Real-time bidirectional communication
- **🔐 NextAuth 5.0** - Secure authentication with multiple providers
- **🎯 chess.js 1.0** - Chess game logic and move validation
- **📦 Node.js** - Server-side runtime environment

### Development Tools
- **🛠️ ESLint** - Code quality and consistency
- **🎨 PostCSS** - Advanced CSS processing
- **📱 Responsive Design** - Mobile-first development approach

## ✨ Core Features

### 🎮 Gameplay Features
- **Real-time Chess Matches** - Instant move synchronization between players
- **Move Validation** - Complete chess rule enforcement with illegal move prevention  
- **Game History** - Full move tracking and game state persistence
- **Match Creation & Joining** - Seamless multiplayer match setup
- **Captured Pieces Display** - Visual tracking of captured pieces
- **Game Status Indicators** - Check, checkmate, and draw detection

### 🎨 User Interface
- **Dark/Light Theme Toggle** - Persistent theme preference with system detection
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Interactive Chessboard** - Drag-and-drop piece movement with visual feedback
- **Navigation Drawer** - Clean sidebar navigation with Material Design
- **Loading States** - Smooth transitions and loading indicators
- **Modal Dialogs** - Professional game creation and join interfaces

### 🔒 Authentication & Security
- **OAuth Integration** - GitHub and Google provider authentication
- **Session Management** - Secure server-side session handling
- **Protected Routes** - Authentication-based route protection
- **Error Handling** - Comprehensive error boundaries and user feedback

## 🏗️ Architecture Highlights

### 🧩 SOLID Principles Implementation
The codebase demonstrates professional software architecture through:

- **Single Responsibility**: Components have focused, single purposes
- **Open/Closed**: Modular design allowing extension without modification
- **Dependency Inversion**: Abstractions control dependencies, not concretions

### 📁 Project Structure
```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes and endpoints
│   │   ├── auth/                 # Authentication endpoints
│   │   └── matches/              # Match management API
│   ├── auth/                     # Authentication pages
│   ├── components/               # Shared components
│   ├── global-components/        # Global UI components
│   │   ├── chessboard/          # Modular chess components
│   │   ├── navbar/              # Navigation components
│   │   └── sidebar/             # Sidebar components
│   ├── match/                    # Match-specific pages and components
│   ├── providers/                # Context providers
│   └── store/                    # Redux store configuration
├── lib/                          # Utility libraries
└── pages/api/                    # Socket.IO API handlers
```

### 🔄 State Management Architecture
- **Redux Toolkit** for global state management
- **Custom hooks** for component-level logic
- **Socket.IO integration** with Redux middleware
- **Persistent client ID** management for reconnection handling

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chessduel.git
   cd chessduel
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Configure authentication providers
   NEXTAUTH_SECRET=your_nextauth_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) to start playing!

## 🎯 Usage Guide

### Creating a Match
1. **Sign in** using GitHub or Google authentication
2. **Navigate** to "New Match" from the sidebar
3. **Share** the generated match URL with your opponent
4. **Start playing** once both players have joined

### Joining a Match
1. **Sign in** to your account
2. **Use** the match URL provided by your opponent
3. **Automatically join** the game session
4. **Begin playing** immediately

### Game Controls
- **Click and drag** pieces to make moves
- **Valid moves** are highlighted in green
- **Active square** is highlighted in blue
- **Captured pieces** are displayed alongside the board

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Configure environment variables in Vercel dashboard
```

### Docker Deployment
```bash
# Build Docker image
docker build -t chessduel .

# Run container
docker run -p 3000:3000 chessduel
```

### Manual Deployment
```bash
# Build production bundle
npm run build

# Start production server
npm start
```

## 🧪 Testing & Quality Assurance

### Code Quality
- **ESLint** configuration for consistent code style
- **TypeScript** strict mode for type safety
- **Component testing** with React Testing Library
- **E2E testing** capabilities with Playwright

### Performance Optimization
- **Next.js optimization** with automatic code splitting
- **Image optimization** with next/image
- **Font optimization** with next/font
- **Bundle analysis** for size optimization

## 📈 Technical Achievements

### 🔧 Advanced Patterns Implemented
- **Server Components** with Next.js 15 App Router
- **Custom Hook Architecture** for reusable logic
- **Redux Toolkit** with modern patterns
- **WebSocket Integration** with state synchronization
- **Theme Provider** with system preference detection
- **Route Protection** with authentication middleware

### 🏆 Development Best Practices
- **TypeScript** for complete type safety
- **Component Composition** over inheritance
- **Custom Hooks** for logic separation
- **Error Boundaries** for robust error handling
- **Responsive Design** with mobile-first approach
- **Performance Optimization** with React 19 features

## 🤝 Contributing

This project welcomes contributions! Please feel free to:

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Create** a Pull Request

