const web3 = require('./web3').web3;
const log = require('../log').fileLogger;
const config = require('../config')['eth_node'];
const db = require('../database/mongoose');
let mainWallet = config.main_wallet;
mainWallet = '0x7fD667a87E2ef724f19315124755558cAA18836E';

let getIgnoreRange = async () => {
    let list = await db.o.ignoreblock.find();
    if (list && list.length > 0) {
        for (let i = 0; i < list.length; i++)
        for (let item of list) {
            await throughBlock(item.start, item.stop);
            await db.o.ignoreblock.deleteOne({start: item.start});
        }
    } 
}

//遍历区块
let throughBlock = async (startHeight, stopHeight) => {
    let promiseList = [];
    for (let i = startHeight; i <= stopHeight; i++) {
        // console.log('开始遍历遗漏区块' + i, Date.now());
        promiseList.push(getBlockInfo(i));
        // console.log('成功遍历遗漏区块' + i, Date.now());
    }
    await Promise.all(promiseList);
}

//获取指定区块的信息
let getBlockInfo = async (blockNum) => {
    let res = await web3.eth.getBlock(blockNum);
    if (!res) throw '获取链上指定区块信息失败';
    let transaction = res.transactions;
    let promiseList = [];
    for (let i = 0; i < transaction.length; i++) {
        promiseList.push(getTransactions(transaction[i]));
    }
    await Promise.all(promiseList);
    // console.log('所有交易拉取成功，更新本地高度', Date.now());
}

//获取交易信息
async function getTransactions (txh) {
    let res = await web3.eth.getTransaction(txh);
    if (!res) throw '获取交易信息失败';
    console.log('获取交易信息成功' + txh, Date.now());
    if (res.to === mainWallet) {
        let r = await db.o.tradeIn.create(res);
        if (!r) throw '交易信息写入不成功';
        console.log('写入交易信息', Date.now());
    }
}

let syncIgnore = (function() {
    let lock = false;
    return async () => {
        if (lock) return;
        lock = true;
        console.log('开始同步', global.getTime());
        getIgnoreRange().then(() => {
            lock = false;
            console.log('同步成功...', global.getTime());
        }).catch(err => {
            log.warn(err);
            console.log('同步失败...', global.getTime());
            lock = false;
        });
    }
})();

module.exports = syncIgnore;