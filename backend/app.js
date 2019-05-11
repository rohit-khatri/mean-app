const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://mean-app:hpK3EY9HTo7m2umP@cluster0-edp97.mongodb.net/mean-app?retryWrites=true",
{ useNewUrlParser: true })
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(()=>{
  console.log('Connection failed.');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/v1/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description
  });

  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get("/api/v1/posts", (req, res, next) => {
  Post.find()
  .then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

module.exports = app;
