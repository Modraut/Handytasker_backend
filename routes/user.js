const app = require('express');
const jwt = require('express-jwt');
const userRouter = app.Router();

const userController = require('../controllers/user');

userRouter.post('/sign-up', userController.create);
userRouter.put('/', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), userController.updatePassword);
userRouter.post('/login', userController.login);
module.exports = userRouter;