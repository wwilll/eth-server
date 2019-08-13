const service = require('../service/index');
let interface = {
    '/getChainBlockHeight': async (ctx) => {
        let res = await service.getChainBlockHeight();
        ctx.body = res || '无此信息';
    }
}

module.exports = interface;