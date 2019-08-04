const schedule = require('node-schedule');
const syncTradeIn = require('./syncTradeIn');
const syncIgnore = require('./syncIgnore');
const config = require('../config')['eth_node'];
//define task
let job;

const cron = '*/' + config.sync_time + ' * * * *';

//start task
this.start = () => {
    syncIgnore();
    // syncTradeIn();
    // job = schedule.scheduleJob(cron, syncTradeIn);
}

this.stop = () => {
    job.cancel();
}
