const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./Counter');

const userSchema = new Schema({
  userid: {
    type: Number,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  roles: {
    User: {
      type: Number,
      default: 2001345
    },
    Editor: Number,
    Admin: Number
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;