
const mongoose = require('mongoose');
const config = require('../config');
const init = async () => {
    return await mongoose.connect(config.mongo.url, config.mongo.options);
}

module.exports = {
    init,
    o: {
        goods: require('./models/goods'),
        info: require('./models/info'),
        tradeIn: require('./models/trade-in'),
        tradeOut: require('./models/trade-out'),
        ignoreblock: require('./models/ignoreblock')
    }
}
