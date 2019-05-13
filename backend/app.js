const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoute = require('./routes/posts');
const userRoute = require('./routes/users');

const app = express();

mongoose.connect("mongodb+srv://mean-app:hpK3EY9HTo7m2umP@cluster0-edp97.mongodb.net/mean-app?retryWrites=true",
{ useNewUrlParser: true })
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(()=>{
  console.log('Connection failed.');
});


// mongoose.connect("mongodb://localhost:27017/mean-app",
// { useNewUrlParser: true })
// .then(() => {
//   console.log('Connected to MongoDB');
// })
// .catch(()=>{
//   console.log('Connection failed.');
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/v1/posts', postRoute);
app.use('/api/v1/users', userRoute);

module.exports = app;
