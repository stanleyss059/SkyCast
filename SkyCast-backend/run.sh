#!/bin/bash

echo "Starting SkyCast Backend..."

# Check if Redis is running
if ! pgrep -x "redis-server" > /dev/null; then
    echo "Redis is not running. Starting Redis..."
    redis-server --daemonize yes
    sleep 2
fi

# Build and run the application
echo "Building and running SkyCast Backend..."
mvn clean spring-boot:run 