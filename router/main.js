const interface = require('./interface');

module.exports = async (ctx) => {
    let path = ctx.request.path;
    if (interface[path]) {
        await interface[path](ctx);
    } else {
        ctx.response.body = "无此接口";
    }
}