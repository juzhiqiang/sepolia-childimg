# Sepolia ChildImg Subgraph

This subgraph indexes the ChildImg contract on Ethereum Sepolia testnet.

## Contract Information
- **Network**: Ethereum Sepolia
- **Contract Address**: `0x3ae524c8ec173e7081007e1c87193cdf53b78042`
- **Contract Type**: ERC721 (NFT)

## Quick Start

### Prerequisites
- Node.js (v16 or later)
- Yarn or npm
- The Graph CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/juzhiqiang/sepolia-childimg.git
cd sepolia-childimg
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install The Graph CLI globally (if not already installed):
```bash
npm install -g @graphprotocol/graph-cli
```

### Build and Deploy

1. Generate code from schema and ABIs:
```bash
npm run codegen
# or
yarn codegen
```

2. Build the subgraph:
```bash
npm run build
# or
yarn build
```

3. Deploy to The Graph Studio:
```bash
# First, authenticate with The Graph Studio
graph auth --studio <YOUR_DEPLOY_KEY>

# Then deploy
npm run deploy
# or
yarn deploy
```

## Entities

The subgraph tracks the following entities:

- **Transfer**: Records all token transfers
- **Approval**: Records individual token approvals
- **ApprovalForAll**: Records operator approvals
- **Token**: Represents each NFT with metadata
- **User**: Represents addresses that interact with the contract

## Example Queries

### Get all tokens owned by an address
```graphql
query GetUserTokens($owner: Bytes!) {
  user(id: $owner) {
    id
    tokensOwned {
      id
      tokenId
      tokenURI
      createdAtTimestamp
    }
  }
}
```

### Get recent transfers
```graphql
query GetRecentTransfers {
  transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    id
    from
    to
    tokenId
    blockTimestamp
    transactionHash
  }
}
```

### Get token details
```graphql
query GetToken($tokenId: String!) {
  token(id: $tokenId) {
    id
    tokenId
    owner
    approved
    tokenURI
    createdAtTimestamp
  }
}
```

## Development

### Local Development

For local development with a local Graph node:

1. Start a local Graph node (requires Docker)
2. Create the subgraph locally:
```bash
npm run create-local
```

3. Deploy locally:
```bash
npm run deploy-local
```

### Testing

The subgraph includes test templates. To run tests:

```bash
# Install matchstick-as for testing
npm install --save-dev matchstick-as

# Run tests
graph test
```

## Configuration

The main configuration is in `subgraph.yaml`:

- **Network**: sepolia
- **Start Block**: 0 (you may want to set this to the actual deployment block for better performance)
- **Contract Address**: 0x3ae524c8ec173e7081007e1c87193cdf53b78042

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

MIT License
