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

## Graph Init Command

This subgraph was created using the equivalent of:
```bash
graph init --protocol ethereum --network sepolia --contract-name ChildImg --from-contract 0x3ae524c8ec173e7081007e1c87193cdf53b78042 sepolia-childimg
```

## License

MIT License