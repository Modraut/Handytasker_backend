require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('express-jwt');


const userRouter = require('./routes/user');
const userInfoRouter = require('./routes/userinfo');
const taskRouter = require('./routes/task');
// const offerRouter = require('./routes/offer');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

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
        cb(null, 'avatar' + Date.now().toString() + Math.floor(Math.random()*10000) + ext)
    }
    })
})
// *********************************
// ********************************* This part is for testing only
app.post('/upload', upload.single('file'), (req, res) => {
    res.send(req.file)
})
app.get('/download/avatar/:key',(req,res)=>{
    const {key} = req.params; 
    const url = s3.getSignedUrl('getObject', {
    Bucket: 'handytasker',
    Key: key,
    Expires: 300
    })
    console.log(url);
    res.redirect(301,url);
})
app.delete('/delete/:key',(req,res)=>{
    const {key} = req.params;
    const param = {
        Bucket: 'handytasker',
        Key: 'avatar/' + key
    }
    s3.deleteObject(
        param,
        function(error, data){
            if(error){
                res.status(500).send(error)
            }
            res.status(200).send('The file has been deleted')
        }
    )
    
})
// *********************************

app.use('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    next();
});


mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DB connected")
});

app.use('/user', userRouter);
app.use('/userinfo', userInfoRouter);
app.use('/task', taskRouter);
// app.use('/offers', offerRouter);


app.listen(process.env.PORT);