const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const userCredentialSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, 'Email required'],
			unique: [true, 'Email already registered'],
			minlength: 6,
			maxlength: 32,
			validate: email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
		},
		password: {
			type: String,
			required: [true, 'Password can\'t be empty'],
			minlength: [7, 'Too short'],
			maxlength: [32, 'Too long']
		},
		active: { type: Boolean, default: true }, // false if use does not want to receive messages
		createTime: { type: Date, default: Date.now },
		userInfo: { type: Schema.Types.ObjectId, ref: 'UserInfo'}
	}
);
userCredentialSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userCredentialSchema.statics.findByEmailPassword = async function (email, password) {
	const user = await this.findOne({ email }).exec();
	if (!user) {
		return;
	}
	if (await bcrypt.compare(password, user.password)) {
		return user;
	} else {
		return;
	}
};

userCredentialSchema.methods.generateJwt = function () {
	const user = this;
	return jwt.sign({ 
		_id: user.id,
		email: user.email,
	},
		process.env.JWT_SECRET,
		{ expiresIn: parseInt(process.env.JWT_EXPIRATION) }
	);
};

module.exports = mongoose.model('UserCredential', userCredentialSchema,'userCredential');