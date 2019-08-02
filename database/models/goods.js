/**
 * find测试
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const goods = new Schema({
  name: String,
  price: Number
})

const Model = mongoose.model('goods', goods, 'goods')

module.exports = Model