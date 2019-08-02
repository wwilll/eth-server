
const details = require('../config')['eth_node']

const uri = details['uri']
const Web3 = require('web3')
let web3 = new Web3(Web3.givenProvider || uri);

module.exports = {
  web3,
  details
}
