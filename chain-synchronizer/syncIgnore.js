const log = require('../log').fileLogger;
const config = require('../config')['eth_node'];
const service = require('../service/index').innerService;
let mainWallet = config.main_wallet;

let getIgnoreRange = async () => {
    let list = await service.getIgnoreBlockList();
    if (list && list.length > 0) {
        for (let item of list) {
            await throughBlock(item.start, item.end);
            await service.removeIgnoreBlock(item.start, item.end);
        }
    } 
}

//遍历区块
let throughBlock = async (startHeight, stopHeight) => {
    for (let i = startHeight; i <= stopHeight; i++) {
        await getBlockInfo(i);
    }
}

//获取指定区块的信息
let getBlockInfo = async (blockNum) => {
    let res = await service.getChainBlockInfo(blockNum);
    let transaction = res.transactions || [];
    let promiseList = [];
    for (let i = 0; i < transaction.length; i++) {
        promiseList.push(getTransactions(transaction[i]));
    }
    await Promise.all(promiseList).catch(err => console.log(err));
    await service.updataBlockHeight(blockNum);
}

//获取交易信息
let getTransactions = async (txh) => {
    let res = await service.getChainTransactions(txh);
    // console.log('获取交易信息成功' + txh, Date.now());
    if (res.to === mainWallet) {
        console.log('写入交易信息', Date.now());
        return await service.insertTradeIn(res);
    }
}

let syncIgnore = (function() {
    let lock = false;
    return async () => {
        if (lock) return;
        lock = true;
        console.log('开始忽略区块同步', global.getTime());
        getIgnoreRange().then(() => {
            lock = false;
            console.log('同步忽略区块成功...', global.getTime());
        }).catch(err => {
            log.warn(err);
            console.log('同步忽略区块失败...', global.getTime());
            lock = false;
        });
    }
})();

module.exports = syncIgnore;