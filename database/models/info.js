/**
 * info测试
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const info = new Schema({
  key: String,
  value: Object
})

const Model = mongoose.model('info', info, 'info')

module.exports = Model