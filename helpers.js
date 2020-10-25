const status = require('http-status');

const errorHandler = (e, res) => {
    console.log(e);
    if (e.name === 'ValidationError') {
        res.status(status.UNPROCESSABLE_ENTITY).send(e.errors);
        return;
    }
    if (e.name === 'MongoError' && e.code === 11000) {
        //duplicate email signup
        res.status(status.CONFLICT).send(e.errors);
        return;
    }
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
};

module.exports = {
    errorHandler
};