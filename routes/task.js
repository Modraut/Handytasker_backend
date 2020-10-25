const app = require('express');
const jwt = require('express-jwt');
const taskRouter = app.Router();

const taskController = require('../controllers/task');




taskRouter.post('/', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), taskController.create);


module.exports = taskRouter;