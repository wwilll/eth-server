const log4js = require('koa-log4')

log4js.configure({
    disableClustering: true,
    appenders: {
        console: {
            type: 'console'
        },
        file: {
            type: 'file',
            filename: './test.log'
        }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' },
        chain: { appenders: ['console'], level: 'debug' },
        app: { appenders: ['console'], level: 'debug' },
        file: { appenders: ['file'], level: 'debug' }
    }
})

exports.chainLogger = log4js.getLogger('chain')
exports.appLogger = log4js.getLogger('app')
exports.fileLogger = log4js.getLogger('file')
