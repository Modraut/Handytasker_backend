const { errorHandler } = require('../helpers');
const status = require('http-status');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


const Task = require('../models/task');
const taskController = {

	create: async (req, res) => {
		try {
			const task = new Task(req.body);
			task.user = mongoose.Types.ObjectId(req.user._id);
			await task.save();
			res.status(200).send(task._id)
		} catch (e) {
			errorHandler(e, res);
		}
	},

	update: async (req, res) => {
		const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
		res.status(status.OK).send(req.user)
	},

	login: async (req, res) => {
		try{
			const { email,password } = req.body;
			const user = await User.findByEmailPassword(email, password);
			if(!user){
				res.sendStatus(status.UNAUTHORIZED);
			}
			else{
				res.status(status.OK).send({ token: user.generateJwt() });
			}
		} catch(e){
			errorHandler(e,res)
		}
	},
	updatePassword: async (req, res) => {
		try{
			// const user = await User.findById(req.user._id).exec();
			const user = await User.findById(req.user._id).exec();
			if(!user){
				return;
			}
			if(await bcrypt.compare(req.body.oldPassword, user.password)){
				user.password = req.body.newPassword;
				user.save();
				res.status(status.OK).send(user)
			}
		} catch(e){
			errorHandler(e,res)
		}
	}
};

module.exports = taskController;