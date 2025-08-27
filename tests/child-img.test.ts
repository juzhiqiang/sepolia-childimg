import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/schema"
import { handleTransfer } from "../src/child-img"
import { createTransferEvent } from "./child-img-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("ChildImg Contract Event Handling", () => {
  beforeAll(() => {
    // Test mint scenario (from zero address)
    let from = Address.fromString("0x0000000000000000000000000000000000000000")
    let to = Address.fromString("0x0000000000000000000000000000000000000001")
    let tokenId = BigInt.fromI32(234)
    let newTransferEvent = createTransferEvent(from, to, tokenId)
    handleTransfer(newTransferEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Transfer created and stored", () => {
    assert.entityCount("Transfer", 1)

    // Check if the transfer entity has correct values
    // Note: Entity ID format is transaction_hash + log_index
    assert.fieldEquals(
      "Transfer", 
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "from",
      "0x0000000000000000000000000000000000000000"
    )
    assert.fieldEquals(
      "Transfer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1", 
      "to",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Transfer",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
  })

  test("Token entity created on mint", () => {
    // Check if Token entity was created
    assert.entityCount("Token", 1)
    
    assert.fieldEquals(
      "Token",
      "234", // tokenId as string
      "tokenId", 
      "234"
    )
    assert.fieldEquals(
      "Token",
      "234",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
  })

  test("User entity created", () => {
    // Should create user entity for the 'to' address
    assert.entityCount("User", 1)
    
    assert.fieldEquals(
      "User",
      "0x0000000000000000000000000000000000000001",
      "id",
      "0x0000000000000000000000000000000000000001"
    )
  })
})