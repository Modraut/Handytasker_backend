const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50
    },
    detail: {
      type: String,
      required: true,
      minlength: 25,
      maxlength: 1000
    },
    // if online
    inPerson: {
      type: Boolean,
      require: true
    },
    location: {
      type: String,
    },
    when:{
      type: Date
    },
    total: {
      type: Boolean,
      require: true
    },
    budget: {
      type: Number
    },
    hours: {
      type: Number,
      require: true
    },
    hourlyRate: {
      type: Number,
      require: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true
    }
    //***************** later


  }
);

module.exports = mongoose.model('task', taskSchema, 'tasks');