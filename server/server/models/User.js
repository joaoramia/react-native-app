const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {},
  { timestamps: true }
);

userSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      ignoreExpiration: true
    },
    secret
  );
};


userSchema.methods.toAuthJSON = function() {
  return {
    token: this.generateJWT()
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
