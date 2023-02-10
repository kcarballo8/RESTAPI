const path = require('path');
function projectPath(...rel) { return path.join(__dirname, '..', ...rel) };


module.exports ={
    hostPort: 8000,

    //loglevel
    logLevel: 'dev',

    //cloud directory

    sessionOptions : {
        secret: 'bunnyslippers',
        saveUninitialized : false,
        resave: false
    },
    db : {
        host: 'localhost',
        database: 'comp4350',
    },

    projectPath,
};
