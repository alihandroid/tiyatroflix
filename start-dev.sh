#!/bin/bash

# TiyatroFlix Development Startup Script
# This script launches both the frontend and backend in development mode

set -e

echo "🚀 Starting TiyatroFlix Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to handle cleanup on script exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down development servers...${NC}"
    
    # Kill all background jobs
    if jobs -p > /dev/null 2>&1; then
        jobs -p | xargs -r kill
    fi
    
    echo -e "${GREEN}✅ Cleanup complete${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if required tools are installed
check_dependencies() {
    echo -e "${BLUE}🔍 Checking dependencies...${NC}"
    
    if ! command -v dotnet &> /dev/null; then
        echo -e "${RED}❌ .NET 8 SDK is not installed${NC}"
        echo "Please install .NET 8 SDK from https://dotnet.microsoft.com/download"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        echo -e "${RED}❌ pnpm is not installed${NC}"
        echo "Please install pnpm: npm install -g pnpm"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Dependencies OK${NC}"
}

# Start backend
start_backend() {
    echo -e "${BLUE}🔧 Starting Backend (.NET API)...${NC}"
    cd backend/TiyatroFlix.Api
    
    # Restore packages if needed
    if [ ! -d "bin" ] || [ ! -d "obj" ]; then
        echo -e "${YELLOW}📦 Restoring .NET packages...${NC}"
        dotnet restore
    fi
    
    # Start the API in background
    dotnet run --urls "http://localhost:5141" &
    BACKEND_PID=$!
    
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    echo -e "   📍 API: http://localhost:5141"
    echo -e "   📍 Swagger: http://localhost:5141/swagger"
    
    cd ../..
}

# Start frontend
start_frontend() {
    echo -e "${BLUE}⚛️  Starting Frontend (React + Vite)...${NC}"
    cd frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
        pnpm install
    fi
    
    # Set API base URL for development mode
    export VITE_API_BASE_URL="http://localhost:5141"
    
    # Start the frontend in background
    pnpm dev &
    FRONTEND_PID=$!
    
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo -e "   📍 App: http://localhost:3000"
    
    cd ..
}

# Wait for services to be ready
wait_for_services() {
    echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
    
    # Wait a moment for services to initialize
    sleep 3
    
    # Check if backend is responding
    echo -e "${BLUE}🔍 Checking backend health...${NC}"
    for i in {1..10}; do
        if curl -k -s http://localhost:5141/swagger > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend is ready!${NC}"
            break
        elif [ $i -eq 10 ]; then
            echo -e "${YELLOW}⚠️  Backend may still be starting up...${NC}"
        else
            echo -e "${YELLOW}   Attempt $i/10 - Backend not ready yet...${NC}"
            sleep 2
        fi
    done
    
    # Check if frontend is responding
    echo -e "${BLUE}🔍 Checking frontend health...${NC}"
    for i in {1..10}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend is ready!${NC}"
            break
        elif [ $i -eq 10 ]; then
            echo -e "${YELLOW}⚠️  Frontend may still be starting up...${NC}"
        else
            echo -e "${YELLOW}   Attempt $i/10 - Frontend not ready yet...${NC}"
            sleep 2
        fi
    done
}

# Main execution
main() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  🎭 TiyatroFlix Development Setup 🎭${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    check_dependencies
    
    echo -e "\n${BLUE}🚀 Starting services...${NC}"
    start_backend
    sleep 2  # Give backend a head start
    start_frontend
    
    wait_for_services
    
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}🎉 Development environment is ready!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "📍 Frontend: ${BLUE}http://localhost:3000${NC}"
    echo -e "📍 Backend:  ${BLUE}http://localhost:5141${NC}"
    echo -e "📍 Swagger:  ${BLUE}http://localhost:5141/swagger${NC}"
    echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"
    
    # Wait for user to stop the services
    wait
}

# Run main function
main