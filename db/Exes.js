const mongoose = require("mongoose");

const ExeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  description: { type: String },
  duration: { type: Number },
  date: { type: Date }
});

const Exes = mongoose.model("exes", ExeSchema)

module.exports = Exes;