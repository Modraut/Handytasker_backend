const app = require('express');
const jwt = require('express-jwt');
const path = require('path');

// ********************************* aws s3
const multer = require('multer');
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const s3 = new aws.S3({
    region: 'ap-southeast-2',
    accessKeyId: 'AKIA4P4W56MT4KF5ILE7',
    secretAccessKey: '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',
})
const upload = multer({
    storage: multerS3({
    s3: s3,
    bucket: 'handytasker',
    key: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, 'avatar/' + Date.now().toString() + Math.floor(Math.random()*10000) + ext)
    }
    })
})
// ********************************* aws s3


const userInfoRouter = app.Router();

const userInfoController = require('../controllers/userinfo');

userInfoRouter.post('/', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), userInfoController.create);
userInfoRouter.get('/', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), userInfoController.getUserById);
userInfoRouter.put('/', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), userInfoController.update);
userInfoRouter.post('/avatar', jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), upload.single('file'), userInfoController.uploadAvatar);

userInfoRouter.get('/category/:category', userInfoController.findByCategory);

module.exports = userInfoRouter;