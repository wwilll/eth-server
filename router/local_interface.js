const service = require('../service/index');
let interface = {
    '/getBlockHeight': async (ctx) => {
        let res = await service.getBlockHeight();
        ctx.body = res || '无此信息';
    },
    '/updataBlockHeight': async (ctx) => {
        let res = await service.updataBlockHeight();
        ctx.body = res || '无此信息';
    },
    '/getIgnoreBlockList': async (ctx) => {
        let res = await service.getIgnoreBlockList();
        ctx.body = res || '无此信息';
    },
    '/getTradeInList': async (ctx) => {
        let res = await service.getTradeInList();
        ctx.body = res || '无此信息';
    },
    '/getTradeOutList': async (ctx) => {
        let res = await service.getTradeOutList();
        ctx.body = res || '无此信息';
    },
    '/test': async (ctx) => {
        let res = await service.insertIgnoreBlock();
        ctx.body = res || '无此信息';
    }
}

module.exports = interface;