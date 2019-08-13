/**
 * 已忽略区块
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ignoreblock = new Schema({
  start: Number,
  end: Number
})

const Model = mongoose.model('ignoreblock', ignoreblock, 'ignoreblock')

module.exports = Model