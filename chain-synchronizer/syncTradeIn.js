const web3 = require('./web3').web3;
const log = require('../log').fileLogger;
const config = require('../config')['eth_node'];
const db = require('../database/mongoose');
let mainWallet = config.main_wallet;
mainWallet = '0x7fD667a87E2ef724f19315124755558cAA18836E';

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let iii = 0;

let maxBlockDiff = config.max_block_diff;

//获取链上区块高度
let getChainBlockHeight = async () => {
    let h = await web3.eth.getBlockNumber();
    if(!h) throw '无法获取链上区块高度';
    return h
}

//获取本地区块高度
let getBlockNumber = async () => {
    let height = await db.o.info.findOne({key: 'blockHeight'});
    if(!height) throw '数据库查不到本地区块高度';
    return height.value;
}

//遍历区块
let throughBlock = async () => {
    let startHeight;
    let chainHeight = await getChainBlockHeight();
    let localHeight = await getBlockNumber();
    if (chainHeight - localHeight + 1 > maxBlockDiff) {
        startHeight = chainHeight - maxBlockDiff + 1;
        let res = await db.o.ignoreblock.create({start: localHeight + 1, stop: chainHeight - maxBlockDiff});
        if (!res) throw '区块更新异常，写入忽略区块失败';
    } else {
        startHeight = localHeight + 1;
    }
    let promiseList = [];
    for (let i = startHeight; i <= chainHeight; i++) {
        // console.log('开始遍历区块' + i, Date.now());
        promiseList.push(getBlockInfo(i));
        // await getBlockInfo(i);
        // console.log('成功遍历区块' + i, Date.now());
    }
    await Promise.all(promiseList);
}

//获取指定区块的信息
let getBlockInfo = async (blockNum) => {
    let res = await web3.eth.getBlock(blockNum);
    if (!res) throw '获取链上指定区块信息失败';
    // console.log('获取链上指定区块信息', Date.now());
    let transaction = res.transactions;
    let promiseList = [];
    for (let i = 0; i < transaction.length; i++) {
        promiseList.push(getTransactions(transaction[i], blockNum));
        // await getTransactions(transaction[i], blockNum);
        // console.log('获取交易信息', Date.now());
    }
    await Promise.all(promiseList);
    await db.o.info.findOneAndUpdate({key: 'blockHeight'}, {$set: {'value': blockNum}});
    // console.log('所有交易拉取成功，更新本地高度', Date.now());
}

//获取交易信息
async function getTransactions (txh) {
    let res = await web3.eth.getTransaction(txh);
    if (!res) throw '获取交易信息失败';
    console.log('获取交易信息成功' + iii++ + txh, Date.now());
    if (res.to === mainWallet) {
        let r = await db.o.tradeIn.create(res);
        if (!r) throw '交易信息写入不成功';
        console.log('写入交易信息', Date.now());
    }
}

let syncTradeIn = (function() {
    let lock = false;
    return async () => {
        if (lock) return;
        lock = true;
        console.log('开始同步', global.getTime());
        Promise.all([
            throughBlock()


        ]).then(() => {
            lock = false;
            console.log('同步成功...', global.getTime());
        }).catch(err => {
            log.warn(err);
            console.log('同步失败...', global.getTime());
            lock = false;
        });
    }
})();

module.exports = syncTradeIn;