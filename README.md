# Sepolia Child Image Subgraph - 优化版本

这是一个针对 Sepolia 网络上 DataLogContract 的 The Graph 子图，已优化以返回完整的交易信息。

## 📊 返回字段

子图现在返回以下完整的交易信息：

1. **消息类型** (`messageType`) - 事件类型标识
2. **交易金额** (`value`) - 交易中发送的 ETH 数量
3. **接收地址** (`toAddress`) - 交易接收方地址
4. **发送地址** (`fromAddress`) - 交易发送方地址
5. **交易哈希** (`transactionHash`) - 唯一交易标识符
6. **区块号** (`blockNumber`) - 交易所在区块
7. **合约地址** (`contractAddress`) - 智能合约地址
8. **Input Data** (`inputData`) - 交易输入数据
9. **链上数据内容** (`onChainContent`) - 具体的业务数据内容
10. **交易时间** (`transactionTime`) - 交易时间戳
11. **交易费用** (`transactionFee`) - Gas Used × Gas Price
12. **Gas Price** (`gasPrice`) - 每单位 Gas 的价格

## 🚀 快速开始

### 安装依赖
```bash
yarn install
```

### 生成代码
```bash
yarn codegen
```

### 构建子图
```bash
yarn build
```

### 部署子图
```bash
# 部署到本地节点
yarn create-local
yarn deploy-local

# 或部署到 The Graph Studio
yarn deploy
```

## 📋 实体类型

### Transaction
统一的交易实体，包含所有交易相关信息：
```graphql
type Transaction @entity(immutable: true) {
  id: Bytes!
  messageType: String!
  value: BigInt!
  toAddress: Bytes!
  fromAddress: Bytes!
  transactionHash: Bytes!
  blockNumber: BigInt!
  contractAddress: Bytes!
  inputData: Bytes!
  onChainContent: String
  transactionTime: BigInt!
  transactionFee: BigInt!
  gasPrice: BigInt!
  gasUsed: BigInt!
  gasLimit: BigInt!
}
```

### 事件实体
- `BatchDataStored` - 批量数据存储事件
- `DataStored` - 单个数据存储事件  
- `OwnershipTransferred` - 所有权转移事件

所有事件实体都包含完整的交易信息字段。

## 🔍 查询示例

### 获取所有交易
```graphql
query GetAllTransactions {
  transactions(first: 100, orderBy: blockNumber, orderDirection: desc) {
    id
    messageType
    value
    toAddress
    fromAddress
    transactionHash
    blockNumber
    contractAddress
    inputData
    onChainContent
    transactionTime
    transactionFee
    gasPrice
    gasUsed
    gasLimit
  }
}
```

### 根据发送者查询交易
```graphql
query GetTransactionsByFrom($fromAddress: Bytes!) {
  transactions(where: { fromAddress: $fromAddress }) {
    messageType
    value
    toAddress
    transactionHash
    transactionTime
    transactionFee
  }
}
```

### 获取数据存储事件
```graphql
query GetDataStoredEvents {
  dataStoreds(first: 50, orderBy: blockNumber, orderDirection: desc) {
    content
    dataHash
    messageType
    value
    fromAddress
    toAddress
    transactionFee
    onChainContent
  }
}
```

## ⚡ 优化特性

1. **完整交易信息** - 每个事件都包含完整的交易数据
2. **Gas 费用计算** - 自动计算交易费用
3. **统一查询接口** - Transaction 实体提供统一查询
4. **Receipt 数据** - 启用 receipt 获取准确的 gasUsed 数据
5. **多类型支持** - 支持不同事件类型的消息分类

## 🛠️ 开发命令

```bash
# 安装依赖
yarn install

# 生成 TypeScript 类型
yarn codegen

# 构建子图
yarn build

# 运行测试
yarn test

# 本地部署
yarn create-local
yarn deploy-local

# 清理
yarn clean
```

## 📡 网络配置

- **网络**: Sepolia Testnet
- **合约地址**: `0x3AE524C8EC173E7081007e1C87193cDf53B78042`
- **起始区块**: `9073936`

## 🔧 自定义配置

要使用不同的合约地址或网络，请修改 `subgraph.yaml` 文件：

```yaml
dataSources:
  - kind: ethereum
    name: DataLogContract
    network: sepolia  # 修改网络
    source:
      address: "YOUR_CONTRACT_ADDRESS"  # 修改合约地址
      startBlock: YOUR_START_BLOCK      # 修改起始区块
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个子图！

## 📄 许可证

MIT License
