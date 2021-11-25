const mongoose = require('mongoose');
const logger = require("../logger/Logger");

const user = 'rootdbuser';
const password = 'WFafLuEl9j0Nk4CZ';
const documentURL = 'cluster0.j8be3.mongodb.net';

const databaseName = 'qntower';
const connectionURL = `mongodb+srv://${user}:${password}@${documentURL}/${databaseName}?readPreference=primary&ssl=true`;

// Connect to the DB
mongoose.connect(connectionURL, (error, client) => {
    if (error) {
        return logger.error('Unable to connect to database');
    }
    logger.info('Connected to mongo database');
});

