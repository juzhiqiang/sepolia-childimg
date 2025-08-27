# Makefile for The Graph Subgraph Development

.PHONY: install codegen build test deploy clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make install   - Install dependencies"
	@echo "  make codegen   - Generate TypeScript bindings" 
	@echo "  make build     - Build the subgraph"
	@echo "  make test      - Run unit tests"
	@echo "  make deploy    - Deploy to The Graph Studio"
	@echo "  make local     - Start local development environment"
	@echo "  make clean     - Clean generated files and containers"

# Install dependencies
install:
	npm install
	@echo "✅ Dependencies installed"

# Generate TypeScript bindings
codegen:
	@echo "🔄 Generating TypeScript bindings..."
	rm -rf generated/
	npx graph codegen
	@echo "✅ Codegen completed"

# Build the subgraph  
build: codegen
	@echo "🔨 Building subgraph..."
	npx graph build
	@echo "✅ Build completed"

# Run tests
test: codegen
	@echo "🧪 Running tests..."
	npx graph test
	@echo "✅ Tests completed"

# Deploy to The Graph Studio
deploy: build
	@echo "🚀 Deploying to The Graph Studio..."
	npx graph deploy --studio sepolia-childimg
	@echo "✅ Deployment completed"

# Start local development environment
local:
	@echo "🐳 Starting local Graph node..."
	docker-compose up -d
	@echo "✅ Local environment started"
	@echo "Graph Node: http://localhost:8000"
	@echo "GraphiQL: http://localhost:8000/subgraphs/name/sepolia-childimg"

# Create local subgraph
create-local:
	npx graph create --node http://localhost:8020/ sepolia-childimg

# Deploy to local node
deploy-local: build
	npx graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001 sepolia-childimg

# Clean everything
clean:
	@echo "🧹 Cleaning..."
	rm -rf generated/
	rm -rf build/
	rm -rf node_modules/
	docker-compose down -v --remove-orphans 2>/dev/null || true
	@echo "✅ Cleanup completed"

# Full setup for new developers
setup: install codegen build
	@echo "🎉 Setup completed! Ready to develop."