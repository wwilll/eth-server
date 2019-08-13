const web3 = require('../frame/web3').web3;
const c = require('./checkError');
const prefix = 'web3:';

//获取链上区块高度
const getChainBlockHeight = async () => {
    let res = await web3.eth.getBlockNumber();
    c.check(res, `${prefix}获取链上区块高度`);
    return res;
}

//获取指定区块的信息
const getChainBlockInfo = async blockNum => {
    let res = await web3.eth.getBlock(blockNum);
    c.check(res, `${prefix}获取指定区块(${blockNum})信息`);
    return res;
}

//根据交易hash获取交易信息
const getChainTransactions = async hash => {
    let res = await web3.eth.getTransaction(hash);
    c.check(res, `${prefix}获取交易(hash:${hash}信息`);
    return res;
}

//生成账户
const createAccounts = async () => {
    let res = web3.eth.accounts.create([entropy]);
    c.check(res, `${prefix}生成账户`);
    return res;
}

module.exports = {
    getChainBlockHeight,
    getChainBlockInfo,
    getChainTransactions,
    createAccounts
}