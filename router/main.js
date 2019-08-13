const cInterface = require('./chain_interface');
const lInterface = require('./local_interface');
const interface = Object.assign({}, cInterface, lInterface);
module.exports = async (ctx) => {
    let path = ctx.request.path;
    // console.log(ctx.query);
    // console.log(ctx.request.body);
    if (interface[path]) {
        await interface[path](ctx);
    } else {
        ctx.status = 404;
        ctx.body = {
            status: 404,
            description: '无此接口',
            result: 'error'
        };
    }
}