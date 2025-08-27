import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { BatchDataStored } from "../generated/schema"
import { BatchDataStored as BatchDataStoredEvent } from "../generated/DataLogContract/DataLogContract"
import { handleBatchDataStored } from "../src/data-log-contract"
import { createBatchDataStoredEvent } from "./data-log-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let logIds = [BigInt.fromI32(234)]
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let dataType = "Example string value"
    let timestamp = BigInt.fromI32(234)
    let newBatchDataStoredEvent = createBatchDataStoredEvent(
      logIds,
      creator,
      dataType,
      timestamp
    )
    handleBatchDataStored(newBatchDataStoredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("BatchDataStored created and stored", () => {
    assert.entityCount("BatchDataStored", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BatchDataStored",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "logIds",
      "[234]"
    )
    assert.fieldEquals(
      "BatchDataStored",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BatchDataStored",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "dataType",
      "Example string value"
    )
    assert.fieldEquals(
      "BatchDataStored",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
