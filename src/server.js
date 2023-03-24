require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;
const connect = require("./config/db");
const userRoute = require("./routes/auth");
const postRoute = require("./routes/post.route");
const cookieParser = require("cookie-parser");

// let corsConfig = {
//   origin: "http://localhost:3000",
//   allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
//   credentials: true,
//   exposedHeaders: ["*", "Authorization"],
// };

let corsConfig = {
//   origin: "https://papaya-boba-2dfefb.netlify.app",
origin:"http://localhost:3000",
  credentials: true,
};

const app = express();
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })

app.use("/user", userRoute);
app.use("/post", postRoute);

app.get("/", (req, res) => {
  res.send("Its a backebnd");
});

app.listen(PORT, async () => {
  await connect();
  console.log(`running at ${PORT}`);
});
