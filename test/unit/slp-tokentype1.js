/*
  Unit tests for the TokenType1 library.
*/

const assert = require("chai").assert
const nock = require("nock") // http call mocking
const sinon = require("sinon")
// const axios = require("axios")

// Default to unit tests unless some other value for TEST is passed.
if (!process.env.TEST) process.env.TEST = "unit"
// const SERVER = bchjs.restURL

const BCHJS = require("../../src/bch-js")
const bchjs = new BCHJS()

// Mock data used for unit tests
// const mockData = require("./fixtures/slp/mock-utils")

// Default to unit tests unless some other value for TEST is passed.
if (!process.env.TEST) process.env.TEST = "unit"

describe("#SLP TokenType1", () => {
  let sandbox

  beforeEach(() => {
    // Activate nock if it's inactive.
    if (!nock.isActive()) nock.activate()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    // Clean up HTTP mocks.
    nock.cleanAll() // clear interceptor list.
    nock.restore()

    sandbox.restore()
  })

  describe("#generateSendOpReturn", () => {
    it("should generate send OP_RETURN code", async () => {
      // Mock UTXO.
      const tokenUtxos = [
        {
          txid:
            "a8eb788b8ddda6faea00e6e2756624b8feb97655363d0400dd66839ea619d36e",
          vout: 2,
          value: "546",
          confirmations: 0,
          satoshis: 546,
          utxoType: "token",
          transactionType: "send",
          tokenId:
            "497291b8a1dfe69c8daea50677a3d31a5ef0e9484d8bebb610dac64bbc202fb7",
          tokenTicker: "TOK-CH",
          tokenName: "TokyoCash",
          tokenDocumentUrl: "",
          tokenDocumentHash: "",
          decimals: 8,
          tokenQty: 7
        }
      ]

      const result = await bchjs.SLP.TokenType1.generateSendOpReturn(
        tokenUtxos,
        1
      )

      assert.hasAllKeys(result, ["script", "outputs"])
      assert.isNumber(result.outputs)
    })

    //   it("should handle problematic configuration", async () => {
    //     // Mock UTXO.
    //     const tokenUtxos = [
    //       {
    //         txid:
    //           "0bd6b874246202b4cbc2f501419a5ce6f9b01e8ba9521298afd15c7e8eac5951",
    //         vout: 2,
    //         value: "546",
    //         confirmations: 0,
    //         satoshis: 546,
    //         utxoType: "token",
    //         transactionType: "send",
    //         tokenId:
    //           "155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce",
    //         tokenTicker: "PSF",
    //         tokenName: "PSF Testnet Token",
    //         tokenDocumentUrl: "",
    //         tokenDocumentHash: "",
    //         decimals: 8,
    //         tokenQty: 18004.71169917
    //       }
    //     ]
    //
    //     const result = await bchjs.SLP.TokenType1.generateSendOpReturn(
    //       tokenUtxos,
    //       5000
    //     )
    //     console.log(`result: ${JSON.stringify(result, null, 2)}`)
    //
    //     // console.log(`decoded: ${result.script[6].toString("ascii")}`)
    //     // const msg = Buffer.from(result.script[6], "hex").toString("ascii")
    //     const msg = result.script[6].toString("ascii")
    //     console.log(`msg: ${msg}`)
    //   })
  })

  describe("#generateBurnOpReturn", () => {
    it("should generate burn OP_RETURN code", async () => {
      // Mock UTXO.
      const tokenUtxos = [
        {
          txid:
            "a8eb788b8ddda6faea00e6e2756624b8feb97655363d0400dd66839ea619d36e",
          vout: 2,
          value: "546",
          confirmations: 0,
          satoshis: 546,
          utxoType: "token",
          transactionType: "send",
          tokenId:
            "497291b8a1dfe69c8daea50677a3d31a5ef0e9484d8bebb610dac64bbc202fb7",
          tokenTicker: "TOK-CH",
          tokenName: "TokyoCash",
          tokenDocumentUrl: "",
          tokenDocumentHash: "",
          decimals: 8,
          tokenQty: 7
        }
      ]

      const result = await bchjs.SLP.TokenType1.generateBurnOpReturn(
        tokenUtxos,
        1
      )
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
    })
  })

  describe("#generateGenesisOpReturn", () => {
    it("should generate genesis OP_RETURN code", async () => {
      const configObj = {
        name: "SLP Test Token",
        ticker: "SLPTEST",
        documentUrl: "https://bchjs.cash",
        decimals: 8,
        initialQty: 10
      }

      const result = await bchjs.SLP.TokenType1.generateGenesisOpReturn(
        configObj
      )

      assert.isArray(result)
      assert.equal(Buffer.isBuffer(result[1]), true)
    })
  })
})
