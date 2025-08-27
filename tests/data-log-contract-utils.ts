import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  BatchDataStored,
  DataStored,
  OwnershipTransferred
} from "../generated/DataLogContract/DataLogContract"

export function createBatchDataStoredEvent(
  logIds: Array<BigInt>,
  creator: Address,
  dataType: string,
  timestamp: BigInt
): BatchDataStored {
  let batchDataStoredEvent = changetype<BatchDataStored>(newMockEvent())

  batchDataStoredEvent.parameters = new Array()

  batchDataStoredEvent.parameters.push(
    new ethereum.EventParam(
      "logIds",
      ethereum.Value.fromUnsignedBigIntArray(logIds)
    )
  )
  batchDataStoredEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  batchDataStoredEvent.parameters.push(
    new ethereum.EventParam("dataType", ethereum.Value.fromString(dataType))
  )
  batchDataStoredEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return batchDataStoredEvent
}

export function createDataStoredEvent(
  logId: BigInt,
  creator: Address,
  dataType: string,
  content: string,
  timestamp: BigInt,
  dataHash: Bytes
): DataStored {
  let dataStoredEvent = changetype<DataStored>(newMockEvent())

  dataStoredEvent.parameters = new Array()

  dataStoredEvent.parameters.push(
    new ethereum.EventParam("logId", ethereum.Value.fromUnsignedBigInt(logId))
  )
  dataStoredEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  dataStoredEvent.parameters.push(
    new ethereum.EventParam("dataType", ethereum.Value.fromString(dataType))
  )
  dataStoredEvent.parameters.push(
    new ethereum.EventParam("content", ethereum.Value.fromString(content))
  )
  dataStoredEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  dataStoredEvent.parameters.push(
    new ethereum.EventParam("dataHash", ethereum.Value.fromFixedBytes(dataHash))
  )

  return dataStoredEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
