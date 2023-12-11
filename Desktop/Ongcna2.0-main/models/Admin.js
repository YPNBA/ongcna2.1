// admin.js

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminSchema.plugin(uniqueValidator);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
