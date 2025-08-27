import { Bytes, BigInt, log } from "@graphprotocol/graph-ts";
import {
  BatchDataStored as BatchDataStoredEvent,
  DataStored as DataStoredEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
} from "../generated/DataLogContract/DataLogContract";
import {
  BatchDataStored,
  DataStored,
  OwnershipTransferred,
  Transaction,
} from "../generated/schema";

// 计算交易费用的辅助函数
function calculateTransactionFee(gasUsed: BigInt, gasPrice: BigInt): BigInt {
  return gasUsed.times(gasPrice);
}

// 通用的交易信息填充函数
function populateTransactionInfo(entity: any, event: any, messageType: string): void {
  // 1. 消息类型
  entity.messageType = messageType;
  
  // 2. value 交易金额
  entity.value = event.transaction.value;
  
  // 3. 接收地址
  entity.toAddress = event.transaction.to ? event.transaction.to! : event.address;
  
  // 4. 发送地址
  entity.fromAddress = event.transaction.from;
  
  // 5. 交易哈希
  entity.transactionHash = event.transaction.hash;
  
  // 6. 区块号
  entity.blockNumber = event.block.number;
  
  // 7. 合约地址
  entity.contractAddress = event.address;
  
  // 8. inputdata
  entity.inputData = event.transaction.input;
  
  // 11. 交易时间 (使用区块时间戳)
  entity.transactionTime = event.block.timestamp;
  
  // 12. Gas Price
  entity.gasPrice = event.transaction.gasPrice;
  
  // Gas Used (从receipt获取，如果可用)
  entity.gasUsed = event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0);
  
  // Gas Limit
  entity.gasLimit = event.transaction.gasLimit;
  
  // 11. Transaction Fee
  entity.transactionFee = calculateTransactionFee(entity.gasUsed, entity.gasPrice);
}

export function handleBatchDataStored(event: BatchDataStoredEvent): void {
  let entity = new BatchDataStored(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  // 原有字段
  let dataTypeBytes = event.params.dataType as Bytes;
  entity.dataType = dataTypeBytes.toHexString();
  entity.logIds = event.params.logIds;
  entity.creator = event.params.creator;
  entity.timestamp = event.params.timestamp;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  // 填充扩展的交易信息
  populateTransactionInfo(entity, event, "BatchDataStored");
  
  // 9. 链上数据内容字段 (对于批量数据，可能没有具体内容)
  entity.onChainContent = "Batch data with " + entity.logIds.length.toString() + " items";

  entity.save();

  // 同时创建一个独立的Transaction实体
  let transaction = new Transaction(event.transaction.hash);
  populateTransactionInfo(transaction, event, "BatchDataStored");
  transaction.onChainContent = entity.onChainContent;
  transaction.save();
}

export function handleDataStored(event: DataStoredEvent): void {
  let entity = new DataStored(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  // 原有字段
  entity.logId = event.params.logId;
  entity.creator = event.params.creator;
  
  let dataTypeBytes = event.params.dataType as Bytes;
  entity.dataType = dataTypeBytes.toHexString();
  
  entity.content = event.params.content;
  entity.timestamp = event.params.timestamp;
  entity.dataHash = event.params.dataHash;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  // 填充扩展的交易信息
  populateTransactionInfo(entity, event, "DataStored");
  
  // 9. 链上数据内容字段
  entity.onChainContent = event.params.content;

  entity.save();

  // 同时创建一个独立的Transaction实体
  let transaction = new Transaction(event.transaction.hash);
  populateTransactionInfo(transaction, event, "DataStored");
  transaction.onChainContent = entity.onChainContent;
  transaction.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  // 原有字段
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  // 填充扩展的交易信息
  populateTransactionInfo(entity, event, "OwnershipTransferred");
  
  // 9. 链上数据内容字段
  entity.onChainContent = "Ownership transferred from " + 
    entity.previousOwner.toHexString() + " to " + entity.newOwner.toHexString();

  entity.save();

  // 同时创建一个独立的Transaction实体
  let transaction = new Transaction(event.transaction.hash);
  populateTransactionInfo(transaction, event, "OwnershipTransferred");
  transaction.onChainContent = entity.onChainContent;
  transaction.save();
}