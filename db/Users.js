const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model("users", UserSchema);

module.exports = Users;