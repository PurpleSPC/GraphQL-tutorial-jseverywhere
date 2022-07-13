const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {
        //use mongo URL string parser
        mongoose.set('useNewUrlParser', true);
        //use findOneAndUpdate instead of findAndModify
        mongoose.set('useFindAndModify', false);
        //use createIndex instead of ensureIndex
        mongoose.set('useCreateIndex', true);
        //use new server discovery engine
        mongoose.set('useUnifiedTopology', true);
        //connect to the DB
        mongoose.connect(DB_HOST);
        //log an error if we fail to connect
        mongoose.connection.on('error', err => {
            console.error(err);
            console.log(
                'MongoDB connection error. Please make sure MongoDB is running'
            );
            process.exit();
        });
    },
    close: () => {
        mongoose.Connection.close();
    }
};