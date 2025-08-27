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
- Docker (for local development)

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

4. Copy environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
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

## Local Development

### Using Docker

1. Start the local Graph node:
```bash
npm run start
# or
docker-compose up
```

2. Create the subgraph locally:
```bash
npm run create-local
```

3. Deploy to local node:
```bash
npm run deploy-local
```

4. Stop the local node:
```bash
npm run stop
# or
docker-compose down
```

### Testing

Run unit tests:
```bash
npm run test
# or
yarn test
```

## Entities

The subgraph tracks the following entities:

### Transfer
Records all token transfers with complete transaction details.

### Approval  
Records individual token approvals between owners and approved addresses.

### ApprovalForAll
Records operator approvals allowing an address to manage all tokens of an owner.

### Token
Represents each NFT with metadata including:
- Token ID
- Current owner
- Approved address (if any)
- Token URI
- Creation timestamp and block

### User
Represents addresses that interact with the contract, with relationships to:
- Owned tokens
- Approved tokens
- Transfer history

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
query GetRecentTransfers($first: Int = 10) {
  transfers(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
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

### Get all approvals for a token
```graphql
query GetTokenApprovals($tokenId: BigInt!) {
  approvals(where: { tokenId: $tokenId }) {
    id
    owner
    approved
    blockTimestamp
    transactionHash
  }
}
```

### Get user's approval history
```graphql
query GetUserApprovals($user: Bytes!) {
  approvals(where: { owner: $user }) {
    id
    approved
    tokenId
    blockTimestamp
  }
  approvalForAlls(where: { owner: $user }) {
    id
    operator
    approved
    blockTimestamp
  }
}
```

## File Structure

```
sepolia-childimg/
├── abis/
│   └── ChildImg.json          # Contract ABI
├── src/
│   └── child-img.ts           # Event handlers
├── tests/
│   ├── child-img.test.ts      # Unit tests
│   └── child-img-utils.ts     # Test utilities
├── package.json               # Dependencies and scripts
├── schema.graphql             # GraphQL schema
├── subgraph.yaml             # Subgraph configuration
├── tsconfig.json             # TypeScript configuration
├── docker-compose.yml        # Local development setup
├── networks.json             # Network configurations
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Configuration

### subgraph.yaml
Main configuration file that defines:
- Network: sepolia
- Contract address: 0x3ae524c8ec173e7081007e1c87193cdf53b78042
- Start block: 0 (you may want to update this to the actual deployment block)
- Event handlers and their mappings

### networks.json
Contains network-specific configurations including contract addresses and start blocks.

## Graph Init Command

This subgraph was created using the equivalent of:
```bash
graph init --protocol ethereum \
           --network sepolia \
           --contract-name ChildImg \
           --from-contract 0x3ae524c8ec173e7081007e1c87193cdf53b78042 \
           sepolia-childimg
```

## Features

✅ **Complete ERC721 Support**: Handles all standard ERC721 events  
✅ **Token Metadata**: Automatically fetches tokenURI from contract  
✅ **User Tracking**: Maintains relationships between users and tokens  
✅ **Transfer History**: Complete audit trail of all token movements  
✅ **Approval Management**: Tracks individual and operator approvals  
✅ **Error Handling**: Robust error handling for contract calls  
✅ **Unit Tests**: Comprehensive test coverage with Matchstick  
✅ **Local Development**: Docker setup for local Graph node  
✅ **Production Ready**: Optimized for The Graph Studio deployment  

## Troubleshooting

### Common Issues

1. **Code generation fails**: Make sure ABI is valid JSON
2. **Build errors**: Ensure all dependencies are installed
3. **Deployment fails**: Check network configuration and authentication
4. **Missing tokenURI**: Contract might not implement ERC721Metadata

### Getting Help

- [The Graph Documentation](https://thegraph.com/docs/)
- [AssemblyScript Reference](https://thegraph.com/docs/en/developer/assemblyscript-api/)
- [Discord Community](https://discord.gg/graphprotocol)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm run test`
6. Submit a pull request

## License

MIT License

## Deployment Instructions

### The Graph Studio

1. Go to [The Graph Studio](https://thegraph.com/studio/)
2. Create a new subgraph named `sepolia-childimg`
3. Get your deploy key
4. Run deployment commands:

```bash
graph auth --studio YOUR_DEPLOY_KEY
npm run deploy
```

### Hosted Service (Deprecated)

The Graph's hosted service is being deprecated. Please use The Graph Studio instead.

## Monitoring

After deployment, you can:
- View indexing status in The Graph Studio
- Query your subgraph via GraphQL playground
- Monitor sync status and performance metrics
- Set up alerts for indexing issues

## Updates

To update the subgraph:
1. Make changes to code/schema
2. Increment version in `package.json`
3. Run `npm run build`
4. Deploy with `npm run deploy`