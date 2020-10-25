require('dotenv').config();
const status = require('http-status');
const fs = require('fs');
const mongoose = require('mongoose');

const { errorHandler } = require('../helpers');
const UserInfo = require('../models/userInfo');

// ********************************* aws s3
const aws = require('aws-sdk')
const s3 = new aws.S3({
    region: 'ap-southeast-2',
    accessKeyId: 'AKIA4P4W56MT4KF5ILE7',
    secretAccessKey: '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',
})

// *********************************

const userInfoController = {
  // complete: create userInfo if the _id is unique
  // send userInfo back for now
  // send back _id. need to improve?
  create: async (req, res) => {  
    try {
      const body = req.body;  //req.body does not include _id
      body._id = mongoose.Types.ObjectId(req.user._id); // create with the same _id as user
      const userInfo = new UserInfo(body);
      await userInfo.save();
      res.status(status.CREATED).send(userInfo);
    } catch (e) {
      errorHandler(e, res);
    }
  },
  // complete: update userInfo
  // send userInfo back for now

	update: async (req, res) => {
    try {
      const userInfo = await UserInfo.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true, runValidators: true });
      res.status(status.ACCEPTED).send(userInfo)
    } catch (e) {
      errorHandler(e, res);
    }
  },
  // complete: upload avatar, update userInfo document and then remove the old avatar
  // use second query to get newUserInfo with _id. Is it needed?
  uploadAvatar: async (req, res) => {    
    try {
      const userInfo = await UserInfo.findById(req.user._id).exec();
      const oldAvatar = userInfo.avatar;
      userInfo.avatar = req.file.key;
      await userInfo.save();
      const newUserInfo = await UserInfo.findById(req.user._id, { _id: 0 }).exec();
      if(oldAvatar!==''){
        const param = {
          Bucket: 'handytasker',
          Key: oldAvatar
        }
        console.log(oldAvatar);
        s3.deleteObject(
          param,
          function(error, data){
              if(error){
                  res.status(status.INTERNAL_SERVER_ERROR).send('Failed to delete the old avatar')
              }
          }
        )
      }
      res.status(status.ACCEPTED).send(newUserInfo)
    } catch (e) {
      errorHandler(e,res)
    }
  },
  // Done: obtain userInfo for private/public use
  getUserById: async (req, res) => {
    try {
      const userInfo = await UserInfo.findOneAndUpdate({ _id: req.user._id }, { _id: req.user._id }, { upsert: true, setDefaultOnInsert: true, new: true }).exec();
      if(userInfo.avatar !== ''){
        const avatar_fullpath = s3.getSignedUrl('getObject', {
          Bucket: 'handytasker',
          Key: userInfo.avatar,
          Expires: 36000000
          })
        userInfo.avatar = avatar_fullpath;
      }
      res.status(status.OK).send(userInfo); // need to update regarding avatar using async
    } catch (e) {
      errorHandler(e, res);
    }
  },
  // maybe not needed
  findByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const item = await UserInfo.findByCategory(category);
      if (!item) {
        res.sendStatus(status.NO_CONTENT);
      }
      else {
        res.status(status.OK).send(item);
      }
    } catch (e) {
      errorHandler(e, res)
    }
  }
};

module.exports = userInfoController;