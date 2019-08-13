const log = require('../log').fileLogger;
const config = require('../config')['eth_node'];
const service = require('../service/index').innerService;

let mainWallet = config.main_wallet;

let iii = 0;

let maxBlockDiff = config.max_block_diff;

//遍历区块
let throughBlock = async () => {
    let startHeight;
    let chainHeight = await service.getChainBlockHeight();
    let localHeight = await service.getBlockHeight();
    if (chainHeight - localHeight + 1 > maxBlockDiff) {
        startHeight = chainHeight - maxBlockDiff + 1;
        await service.insertIgnoreBlock(localHeight + 1, chainHeight - maxBlockDiff);
    } else {
        startHeight = localHeight + 1;
    }
    for (let i = startHeight; i <= chainHeight; i++) {
        await getBlockInfo(i);
    }
}

//获取指定区块的信息
let getBlockInfo = async (blockNum) => {
    let res = await service.getChainBlockInfo(blockNum);
    let transaction = res.transactions || [];
    let promiseList = [];
    for (let i = 0; i < transaction.length; i++) {
        promiseList.push(getTransactions(transaction[i], blockNum));
    }
    await Promise.all(promiseList).catch(err => console.log(err));
    await service.updataBlockHeight(blockNum);
}

//获取交易信息
let getTransactions = async txh => {
    let res = await service.getChainTransactions(txh);
    // console.log('获取交易信息成功' + iii++ + txh, Date.now());
    if (res.to === mainWallet) {
        console.log('写入交易信息', Date.now());
        return await service.insertTradeIn(res);
    }
    return await service.insertTradeIn(res);
}

let syncTradeIn = (function() {
    let lock = false;
    return async () => {
        if (lock) return;
        lock = true;
        console.log('开始同步', global.getTime());
        throughBlock().then(() => {
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