#!/bin/bash

echo "Starting Pet Adoption Application..."
echo

echo "Starting Backend (Spring Boot) on port 9090..."
cd springapp
mvn spring-boot:run &
BACKEND_PID=$!

echo "Waiting 10 seconds for backend to start..."
sleep 10

echo "Starting Frontend (Angular) on port 4200..."
cd ../app
npm start &
FRONTEND_PID=$!

echo
echo "Both applications are starting..."
echo "Backend: http://localhost:9090"
echo "Frontend: http://localhost:4200"
echo
echo "Press Ctrl+C to stop both applications..."

# Function to cleanup processes on exit
cleanup() {
    echo "Stopping applications..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait

