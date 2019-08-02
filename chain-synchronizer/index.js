const schedule = require('node-schedule');
const syncTradeIn = require('./syncTradeIn');
const log = require('../log').fileLogger;
const config = require('../config')['eth_node'];
//define task
let job;
let lock = false;

const cron = '*/' + config.sync_time + ' * * * *';

let sync = async () => {
    if (lock) return;
    lock = true;
    console.log('开始同步', global.getTime());
    Promise.all([
        syncTradeIn.start()
    ]).then(() => {
        lock = false;
        console.log('同步成功...', global.getTime());
    }).catch(err => {
        log.warn(err);
        console.log('同步失败...');
        lock = false;
    });
}

//start task
this.start = () => {
    sync();
    job = schedule.scheduleJob(cron, sync);
}

this.stop = () => {
    job.cancel();
}

