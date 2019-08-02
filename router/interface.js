const db = require('../database/mongoose');
let interface = {
    '/getBlockHeight': async (ctx) => {
        let res = await db.o.info.findOne({key: 'blockHeight'}).exec();
        try {
            res = res.value;
        } catch (error) {
            res = '无此信息';
        }
        ctx.body = res;
    },
    '/home': async (ctx) => {
        console.log('home', ctx.request.query);
        let res = await db.o.info.findOne({_id: "5d3bb076bbd3220efc4d64e9"}).exec();
        ctx.body = res;
    },
    '/getBlock': async (ctx) => {
        console.log('getBlock', ctx.request.query);
        ctx.body = 'this is getBlock';
    }
}

module.exports = interface;