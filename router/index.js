const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const main = require('./main');



let init = async () => {
    const app = new Koa();
    
    app.use(bodyParser());
    
    app.use(main);

    app.listen(3001, () => {
        console.log("server is running on port:3001");
    });
}

this.init = init;
