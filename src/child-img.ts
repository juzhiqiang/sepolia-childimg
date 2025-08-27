import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  Transfer as TransferEvent
} from "../generated/ChildImg/ChildImg"
import {
  Approval,
  ApprovalForAll,
  Transfer,
  Token,
  User
} from "../generated/schema"
import { Address, BigInt } from "@graphprotocol/graph-ts"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Update Token entity
  let tokenId = event.params.tokenId.toString()
  let token = Token.load(tokenId)
  if (token) {
    token.approved = event.params.approved
    token.save()
  }
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Handle Token entity
  let tokenId = event.params.tokenId.toString()
  let token = Token.load(tokenId)
  let zeroAddress = Address.fromString("0x0000000000000000000000000000000000000000")

  // If token doesn't exist and this is a mint (from zero address)
  if (!token && event.params.from == zeroAddress) {
    token = new Token(tokenId)
    token.tokenId = event.params.tokenId
    token.createdAtTimestamp = event.block.timestamp
    token.createdAtBlockNumber = event.block.number
  }

  if (token) {
    token.owner = event.params.to
    
    // Clear approval when token is transferred
    if (event.params.from != zeroAddress) {
      token.approved = null
    }
    
    token.save()
  }

  // Handle User entities
  let fromUser = User.load(event.params.from)
  if (!fromUser && event.params.from != zeroAddress) {
    fromUser = new User(event.params.from)
    fromUser.save()
  }

  let toUser = User.load(event.params.to)
  if (!toUser) {
    toUser = new User(event.params.to)
    toUser.save()
  }
}
