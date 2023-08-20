const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadMiddleware = multer({ dest: "uploads/" });

const app = express();

const salt = bcrypt.genSaltSync(10);

dotenv.config();
const PORT = process.env.PORT || 4000;
const secret = process.env.secret;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Coudn't connect to DB because of ", err);
  });

app.get("/test", (req, res, next) => {
  res.json("Test ok");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    const result = bcrypt.compareSync(password, userDoc.password);

    if (result) {
      // logged in
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username: userDoc.username,
        });
      });
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/profile", (req, res, next) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, (err, userInfo) => {
    if (err) throw err;
    res.json(userInfo);
  });
});

app.post("/logout", (req, res, next) => {
  res.cookie("token", "").json({ message: "Logout successful" });
});

app.post("/post", uploadMiddleware.single("file"), async (req, res, next) => {
  const { title, summary, content } = req.body;

  const { originalname, path } = req.file;
  console.log(path);
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = (path + "." + ext).replace(/\\/g, '/');

  fs.renameSync(path, newPath);

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, userInfo) => {
    if (err) throw err;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: userInfo.id,
    });

    res.status(200).json(postDoc);
  });
});

app.get("/post", async (req, res, next) => {
  const posts = await Post.find().populate("author", ["username"]).sort({createdAt : -1}).limit(20);
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
