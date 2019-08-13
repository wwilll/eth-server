const gConfig = require('../config/global');
const check = (res, msg) => {
    if(res == null && gConfig.debugMode) throw `${msg}失败`;
}

this.check = check;