#!/bin/bash

# The Graph codegen script
# This script ensures proper code generation for the subgraph

echo "🚀 Starting The Graph codegen process..."

# Check if graph CLI is installed
if ! command -v graph &> /dev/null; then
    echo "❌ Graph CLI not found. Installing..."
    npm install -g @graphprotocol/graph-cli
fi

# Clean previous generated files
echo "🧹 Cleaning previous generated files..."
rm -rf generated/
rm -rf build/

# Generate TypeScript types and bindings
echo "📝 Generating TypeScript bindings..."
graph codegen

# Check if codegen was successful
if [ $? -eq 0 ]; then
    echo "✅ Codegen completed successfully!"
    echo "📁 Generated files:"
    ls -la generated/ 2>/dev/null || echo "   No generated files found"
else
    echo "❌ Codegen failed!"
    exit 1
fi

echo "🎯 Ready to build with: npm run build"