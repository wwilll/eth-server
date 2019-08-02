let moment = require('moment');
const db = require('../database/mongoose');
const log = require('../log').fileLogger

global.getTime = () => {
    return moment().format();
}

const init = async () => {
    const mc = await db.init(); //获取mongoose链接
    switch (mc.connection.readyState) {
        case 0:
            log.warn('mongo disconnected...')
            break
        case 1:
            log.info('mongo connected...')
            break
        case 2:
            log.warn('mongo connecting...')
            break
        case 3:
            log.warn('mongo disconnecting...')
            break
    }
}
module.exports = {
    init
}
