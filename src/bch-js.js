/*
  This is the primary library file for bch-js. This file combines all the other
  libraries in order to create the BCHJS class.
*/

// bch-api mainnet.
const DEFAULT_REST_API = "https://api.bchjs.cash/v3/"

// local deps
const BitcoinCash = require("./bitcoincash")
const Crypto = require("./crypto")
const Util = require("./util")
const Blockchain = require("./blockchain")
const Control = require("./control")
const Generating = require("./generating")
const Mining = require("./mining")
const Transaction = require("./transaction")
const RawTransactions = require("./raw-transactions")
const Mnemonic = require("./mnemonic")
const Address = require("./address")
const HDNode = require("./hdnode")
const TransactionBuilder = require("./transaction-builder")
const ECPair = require("./ecpair")
const Script = require("./script")
const Price = require("./price")
const Socket = require("./socket")
const Wallet = require("./wallet")
const Schnorr = require("./schnorr")
const SLP = require("./slp/slp")

const Blockbook = require("./blockbook")
const OpenBazaar = require("./openbazaar")
const Ninsight = require("./ninsight")

class BCHJS {
  constructor(config) {
    // Try to retrieve the REST API URL from different sources.
    if (config && config.restURL && config.restURL !== "")
      this.restURL = config.restURL
    else if (process.env.RESTURL && process.env.RESTURL !== "")
      this.restURL = process.env.RESTURL
    else this.restURL = DEFAULT_REST_API

    // Retrieve the apiToken
    this.apiToken = "" // default value.
    if (config && config.apiToken && config.apiToken !== "")
      this.apiToken = config.apiToken
    else if (process.env.BCHJSTOKEN && process.env.BCHJSTOKEN !== "")
      this.apiToken = process.env.BCHJSTOKEN

    const libConfig = {
      restURL: this.restURL,
      apiToken: this.apiToken
    }

    // console.log(`apiToken: ${this.apiToken}`)



    // Populate Full Node
    this.Control = new Control(libConfig)
    this.Mining = new Mining(libConfig)
    this.RawTransactions = new RawTransactions(libConfig)

    // Populate utility functions
    this.Address = new Address(libConfig)
    this.BitcoinCash = new BitcoinCash(this.Address)
    this.Blockchain = new Blockchain(libConfig)
    this.Crypto = Crypto
    this.ECPair = ECPair
    this.ECPair.setAddress(this.Address)
    this.Generating = new Generating(libConfig)
    this.HDNode = new HDNode(this.Address)
    this.Mnemonic = new Mnemonic(this.Address)
    this.Price = new Price()
    this.Script = new Script()
    this.Transaction = new Transaction()
    this.TransactionBuilder = TransactionBuilder
    this.TransactionBuilder.setAddress(this.Address)
    this.Util = new Util(libConfig)
    this.Socket = Socket
    this.Wallet = Wallet
    this.Schnorr = new Schnorr(libConfig)

    this.SLP = new SLP(libConfig)
    this.SLP.HDNode = this.HDNode
  }

  static BitboxShim() {
    return BitboxShim
  }
}

// Creat a shim so that all the endpoints match BITBOX SDK and this library
// can be used as a drop-in replacement for BITBOX.
class BitboxShim {
  constructor(config) {
    // Try to retrieve the REST API URL from different sources.
    if (config && config.restURL && config.restURL !== "")
      this.restURL = config.restURL
    else if (process.env.RESTURL && process.env.RESTURL !== "")
      this.restURL = process.env.RESTURL
    else this.restURL = DEFAULT_REST_API

    // Retrieve the apiToken
    this.apiToken = "" // default value.
    if (config && config.apiToken && config.apiToken !== "")
      this.apiToken = config.apiToken
    else if (process.env.BCHJSTOKEN && process.env.BCHJSTOKEN !== "")
      this.apiToken = process.env.BCHJSTOKEN

    const libConfig = {
      restURL: this.restURL,
      apiToken: this.apiToken
    }

    // Populate utility functions
    this.Address = new Address(libConfig)
    this.BitcoinCash = new BitcoinCash(this.Address)
    this.Blockchain = new Blockchain(libConfig)
    this.Crypto = Crypto
    this.ECPair = ECPair
    this.ECPair.setAddress(this.Address)
    this.Generating = new Generating(libConfig)
    this.HDNode = new HDNode(this.Address)
    this.Mnemonic = new Mnemonic(this.Address)
    this.Price = new Price()
    this.Script = new Script()
    this.TransactionBuilder = TransactionBuilder
    this.TransactionBuilder.setAddress(this.Address)
    this.Util = new Util(libConfig)
    this.Socket = Socket
    this.Wallet = Wallet
    this.Schnorr = new Schnorr(libConfig)

    // Populate the SLP endpoints.
    this.SLP = new SLP(libConfig)
    this.Address = this.SLP.Address

    this.ECPair.toSLPAddress = this.SLP.ECPair.toSLPAddress

    this.Util.list = this.SLP.Utils.list
    this.Util.balancesForAddress = this.SLP.Utils.balancesForAddress
    this.Util.balancesForToken = this.SLP.Utils.balancesForToken
    this.Util.balance = this.SLP.Utils.balance
    this.Util.validateTxid = this.SLP.Utils.validateTxid
    this.Util.tokenStats = this.SLP.Utils.tokenStats
    this.Util.transactions = this.SLP.Utils.transactions
    this.Util.burnTotal = this.SLP.Utils.burnTotal
    this.Util.decodeOpReturn = this.SLP.Utils.decodeOpReturn
    this.Util.isTokenUtxo = this.SLP.Utils.isTokenUtxo
    this.Util.tokenUtxoDetails = this.SLP.Utils.tokenUtxoDetails
    this.Util.txDetails = this.SLP.Utils.txDetails

    // Populate Full Node
    this.Control = new Control(libConfig)
    this.Mining = new Mining(libConfig)
    this.RawTransactions = new RawTransactions(libConfig)

    // Populate Blockbook endpoints.
    this.Blockbook = new Blockbook(libConfig)

    // Populate OpenBazaar endpoints
    this.OpenBazaar = new OpenBazaar(libConfig)

    // Bitcoin.com Ninsight indexer
    this.Ninsight = new Ninsight()
  }
}

module.exports = BCHJS
