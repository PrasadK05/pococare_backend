const mongoose = require("mongoose");

let pst = new mongoose.Schema({
  post: { type: String, required: true },
  author: { type: String, required: true },
});

let Posts = mongoose.model("Post", pst);

module.exports = Posts;
