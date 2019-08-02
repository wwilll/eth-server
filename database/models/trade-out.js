/**
 * info测试
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tradeOut = new Schema({
    blockHash: String,
    blockNumber: Number,
    from: String,
    gas: Number,
    gasPrice: String,
    hash: String,
    input: String,
    nonce: Number,
    r: String,
    s: String,
    to: String,
    transactionIndex: Number,
    v: String,
    value: String
})



const Model = mongoose.model('trade-out', tradeOut, 'trade-out')

module.exports = Model