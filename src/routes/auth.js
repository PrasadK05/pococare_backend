const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const token_secret = process.env.TOKEN_KEY;
const refreshToken_secret = process.env.REFRESHTOKEN_KEY;

let cookieOption = {
  httpOnly: false,
  expires: new Date(Date.now() + 30000000),
  secure:true,
  sameSite:"none"
};

const app = express.Router();

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await User.findOne({ email, password });

  if (user) {
    let token = jwt.sign({ email: user.email, name: user.name }, token_secret, {
      expiresIn: "1 min",
    });

    let refreshToken = jwt.sign(
      { email: user.email, name: user.name },
      refreshToken_secret,
      { expiresIn: "2 min" }
    );
    res
      .status(200)
      .cookie("token", token, cookieOption)
      .cookie("refreshtoken", refreshToken, cookieOption)
      .send({ status: true, token, refreshToken });
  } else {
    return res.send({ status: false, messege: "something went wrong" });
  }
});

app.get("/refresh_token", async (req, res) => {
  const reToken = req.headers.refreshtoken;
 

  if (!reToken) {
    return res.status(403).send("Unauthorized");
  }

  try {
    const verification = await jwt.verify(reToken, refreshToken_secret);
    if (verification) {
      let user = await User.findOne({ email: verification.email });
      if (user) {
        let tk = jwt.sign(
          { email: user.email, name: user.name },
          token_secret,
          {
            expiresIn: "1 min",
          }
        );

        res.status(200).cookie("token", tk, cookieOption).send({ status: true, token: tk, refreshToken:reToken });
      } else {
        return res.status(401).send("Operation not allowed.");
      }
    } else {
      return res.status(401).send("Operation not allowed.");
    }
  } catch (e) {
    return res.status(401).send(e.message);
  }
});

module.exports = app;
