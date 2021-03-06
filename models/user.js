const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    telephone: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getAllUsers = function(callback) {
    User.find({}, callback);
}

module.exports.getUserByUserName = function(username, callback) {
    const query = {name: username}
    User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback) {
    const query = {email: email}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.editUser = function(newUser, callback) {
  const query = {email: newUser.email};
  const values = {name: newUser.name, telephone: newUser.telephone};
  User.update(query, values, (err, values) => {
    if (err) throw err;
    callback(null, values);
  });
}

module.exports.changePassword = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
          if(err) throw err;
          newUser.password = hash;
          const query = {email: newUser.email};
          const values = {password: newUser.password};
          User.update(query, values, (err, values) => {
            if (err) throw err;
            callback(null, values);
          });
      });
  });
}

module.exports.comparePassword = function(candidatepassword, hash, callback) {
    bcrypt.compare(candidatepassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.removeUser = function(email, callback) {
  const query = {email: email};
  User.remove(query, (err, values) => {
    if (err) throw err;
    callback(null, values);
  });
}
