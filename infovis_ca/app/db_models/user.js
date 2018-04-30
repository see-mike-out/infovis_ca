let mongoose = require('mongoose');
let UserSchema = new mongoose.Schema({
  signin_id: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  signin_password: {
    type: String,
    required: true,
  },
  signin_password_con: {
    type: String,
    required: true,
  },
  signin_log: {
    type: [Date],
    required: false
  }
});
let User = mongoose.model('User', UserSchema);
module.exports = User;