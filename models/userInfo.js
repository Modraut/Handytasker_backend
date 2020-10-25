const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;

const userInfoSchema = new Schema(
  {
    avatar: {  // front-end to provide the default portrait
      type: String,
      default: ''
    },
    profileImage:{
      type: String
    },
    firstName: {
      type: String,
      // required: [true, 'First name required'],
      minlength: [2, 'First name should be at least 2 letters'],
      maxlength: [32, 'First name Should be less than 32 letters']
    },
    lastName: {
      type: String,
      // required: [true, 'Last name required'],
      minlength: [2, 'Last name should be at least 2 letters'],
      maxlength: [32, 'Last name Should be less than 32 letters']
    },
    tagline: {
      type: String,
      maxlength: [100, 'Last name Should be less than 100 letters']
    },
    location: String,
    emailAddress: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    abn: {
      type: Number,
      length: [11]
    },
    description: {
      type: String,
      maxlength: [200, 'Description name Should be less than 200 letters']
    },
    postTasks: {
      type: Boolean
    },
    earnMoney: {
      type: Boolean
    },
    mobile: {
      type: Number,
    },
// **************** Skills
    goodAt: String,
    howToTravel: [{
      type: String,
      enum: ['Bicycle', 'Car', 'Online', 'Scooter', 'Truck', 'Walk']
    }],
    languages: {
      type: String,
    },
    qualifications: {
      type: String,
    },
    workExperience: {
      type: String,
    },

    //***************** later
    // reviews: [{
    //   type: String,
    // }],
    
    // comments: {
    //   type: String,
    // },
    // categories: [{
    //   type: String,
    //   enum:['Cleaning', 'Business & Admin', 'Delivery & Removals', 'Furniture & Assembly', 'Handyman', 'Marketing & Design', 'Home & Gardening', 'Something else', 'Anything']
    // }],

  }
);

module.exports = mongoose.model('UserInfo', userInfoSchema, 'userInfo');