/**
 * info测试
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tradeIn = new Schema({
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



const Model = mongoose.model('trade-in', tradeIn, 'trade-in')

module.exports = Model