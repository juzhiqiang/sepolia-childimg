import {
  BatchDataStored as BatchDataStoredEvent,
  DataStored as DataStoredEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/DataLogContract/DataLogContract"
import {
  BatchDataStored,
  DataStored,
  OwnershipTransferred
} from "../generated/schema"

export function handleBatchDataStored(event: BatchDataStoredEvent): void {
  let entity = new BatchDataStored(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.logIds = event.params.logIds
  entity.creator = event.params.creator
  entity.dataType = event.params.dataType.toString()
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDataStored(event: DataStoredEvent): void {
  let entity = new DataStored(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.logId = event.params.logId
  entity.creator = event.params.creator
  entity.dataType = event.params.dataType.toString()
  entity.content = event.params.content
  entity.timestamp = event.params.timestamp
  entity.dataHash = event.params.dataHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
