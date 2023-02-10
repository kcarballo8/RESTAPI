
const mongoose = require('mongoose');
const config = require('./config');

// const credentials = {
//     user: username,
//     pass: password
// };

mongoose.connect(
    `mongodb://${config.db.host}/${config.db.database}`,
    // credentials
);
