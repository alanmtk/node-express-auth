const monk = require('monk');

const connectionString =
    process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL;

module.exports = monk(connectionString);
