const db = require('../database/mongoose');
const chain = require('./chain');
const c = require('./checkError');
const prefix = 'mongo:';

//获取本地区块高度
const getBlockHeight = async () => {
    let height = await db.o.info.findOne({key: 'blockHeight'});
    c.check(height, `${prefix}获取本地区块高度`);
    return height.value;
}

//创建本地区块高度
const createBlockHeight = async () => {
    let height = await chain.getChainBlockHeight();
    let exist = await db.info.findOne({key: 'blockHeight'});
    let res;
    if (exist) {
        res = await db.info.findOneAndUpdate({key: 'blockHeight'}, {$set: {'value': height}});
    } else {
        res = await db.o.info.create({key: 'blockHeight',value: height});
    }
    c.check(res, `${prefix}创建本地区块高度`);
    return height;
}

//更新本地区块高度
const updataBlockHeight = async (height) => {
    if (typeof height !== 'number') throw `${prefix}设置的区块高度值非法`;
    let res = await db.o.info.findOneAndUpdate({key: 'blockHeight'}, {$set: {'value': height}});
    c.check(res, `${prefix}更新本地区块高度`);
    return height;
}

//写入忽略区块项目
const insertIgnoreBlock = async (start, end) => {
    let res = await db.o.ignoreblock.create({start, end});
    c.check(res, `${prefix}写入忽略区块项目`);
    return res;
}

//获取已忽略区块列表
const getIgnoreBlockList = async () => {
    let list = await db.o.ignoreblock.find();
    c.check(list, `${prefix}获取已忽略区块列表`);
    return list;
}

//删除忽略区块项目
const removeIgnoreBlock = async (start, end) => {
    let param = {};
    if (start) param.start = start;
    if (end) param.end = end;
    let res = await db.o.ignoreblock.deleteOne(param);
    c.check(res, `${prefix}删除忽略区块项目`);
    return res;
}

//写入交易入项
const insertTradeIn = async (item) => {
    let res = await db.o.tradeIn.create(item);
    c.check(res, `${prefix}写入交易入项`);
    return res;
}

//获取入项交易信息列表
const getTradeInList = async (param = {}) => {
    let list = await db.o.tradeIn.find(param);
    c.check(list, `${prefix}查询入项交易信息列表`);
    return list;
}

//获取出项交易信息列表
const getTradeOutList = async (param = {}) => {
    let list = await db.o.tradeIn.find(param);
    c.check(list, `${prefix}查询出项交易信息列表`);
    return list;
}

/**
 * 查询本地交易是否存在
 * @param {string} txhash tx hash值 
 */
const isExistLocalTx = async (txhash) => {
    let ti = db.c.tradeIn.findOne(
      { 'hash': { '$regex': txhash, '$options': 'i' } }
    );
    let to = db.c.tradeOut.findOne(
      { 'hash': { '$regex': txhash, '$options': 'i' } }
    );
    Promise.all([ti, to]).then(res => {
        return ti != null || to != null;
    }).catch(err => {
        throw err;
    })
}

module.exports = {
    getBlockHeight,
    createBlockHeight,
    updataBlockHeight,
    insertIgnoreBlock,
    getIgnoreBlockList,
    removeIgnoreBlock,
    insertTradeIn,
    getTradeInList,
    getTradeOutList,
    isExistLocalTx
}