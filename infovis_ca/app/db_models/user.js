let bcrypt = require('bcrypt');
let mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/infovis_ca');

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
  is_admin: {
    type: Boolean,
    required: true,
  },
  signin_log: {
    type: [Date],
    required: false
  }
});

UserSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.signin_password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.signin_password = hash;
    next();
  })
});

UserSchema.statics.authenticate = function (signin_id, signin_password, callback) {
  User.findOne({ signin_id: signin_id })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        let err = new Error('user_not_found');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(signin_password, user.signin_password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          let err = new Error('password_incorrect');
          err.status = 401;
          return callback(err);
        }
      })
    });
}

let User = mongoose.model('User', UserSchema);
module.exports = User;