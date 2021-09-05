if(process.env.NODE_ENV == 'production'){
    // CHECK IF WE ARE IN PRODUCTION RETURN 'prod.js 'FILE
    module.exports = require('./prod')
}else{
    //AND IF WE ARE IN DEVELOPMENT RETURN 'dev.js' FILE
    module.exports = require('./dev')
}