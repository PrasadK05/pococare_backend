const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const Post = require("../models/post.model");

const app = express.Router();
app.use(verifyToken);

app.get("/", async (req, res) => {
  try {
    let pst = await Post.find();    
    return res.status(200).send({ data: pst });
  } catch (error) {
    return res.status(400).send({ massae: error.massae });
  }
});

module.exports = app;
