import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  Transfer as TransferEvent,
  ChildImg
} from "../generated/ChildImg/ChildImg"
import {
  Approval,
  ApprovalForAll,
  Transfer,
  Token,
  User
} from "../generated/schema"
import { Address, BigInt, log } from "@graphprotocol/graph-ts"

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

  // Ensure User entities exist
  let ownerUser = User.load(event.params.owner)
  if (!ownerUser) {
    ownerUser = new User(event.params.owner)
    ownerUser.save()
  }

  let approvedUser = User.load(event.params.approved)
  if (!approvedUser && event.params.approved.toHexString() != "0x0000000000000000000000000000000000000000") {
    approvedUser = new User(event.params.approved)
    approvedUser.save()
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

  // Ensure User entities exist
  let ownerUser = User.load(event.params.owner)
  if (!ownerUser) {
    ownerUser = new User(event.params.owner)
    ownerUser.save()
  }

  let operatorUser = User.load(event.params.operator)
  if (!operatorUser) {
    operatorUser = new User(event.params.operator)
    operatorUser.save()
  }
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
    
    // Try to get tokenURI from contract
    let contract = ChildImg.bind(event.address)
    let tokenURICall = contract.try_tokenURI(event.params.tokenId)
    if (!tokenURICall.reverted) {
      token.tokenURI = tokenURICall.value
    } else {
      log.warning("tokenURI call reverted for token {}", [tokenId])
    }
  }

  if (token) {
    // Update token owner
    token.owner = event.params.to
    
    // Clear approval when token is transferred (unless it's a mint)
    if (event.params.from != zeroAddress) {
      token.approved = null
    }
    
    // If tokenURI wasn't set during mint, try to get it now
    if (!token.tokenURI) {
      let contract = ChildImg.bind(event.address)
      let tokenURICall = contract.try_tokenURI(event.params.tokenId)
      if (!tokenURICall.reverted) {
        token.tokenURI = tokenURICall.value
      }
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