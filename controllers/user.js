const { errorHandler } = require('../helpers');
const status = require('http-status');
const bcrypt = require('bcryptjs');

const User = require('../models/userCredential');
const userController = {

	create: async (req, res) => {
		try {
			const newUser = new User(req.body);
			await newUser.save();
			res.status(status.CREATED).send({ token: newUser.generateJwt() });
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

module.exports = userController;