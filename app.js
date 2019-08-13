const frame = require('./frame');
const router = require('./router');
const chainSynchronizer = require('./chain-synchronizer');

const start = async () => {
    await frame.init();
    router.init();
    // chainSynchronizer.start();
}

start();