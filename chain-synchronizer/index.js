const schedule = require('node-schedule');
const syncTradeIn = require('./syncTradeIn');
const syncIgnore = require('./syncIgnore');
const config = require('../config')['eth_node'];
//define task
let tradeInJob;
const tradeInInterval = '*/' + config.sync_time + ' * * * *';

let ignoreJob;
const ignoreInterval = '*/30 * * * *';

//start task
this.start = () => {
    syncTradeIn();
    tradeInJob = schedule.scheduleJob(tradeInInterval, syncTradeIn);
    syncIgnore();
    ignoreJob = schedule.scheduleJob(ignoreInterval, syncIgnore);
}

this.stop = () => {
    tradeInJob.cancel();
    ignoreJob.cancel();
}
