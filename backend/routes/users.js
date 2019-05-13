const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const routes = express();

routes.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then( hash => {
    const user = new User({
      email: req.body.email,
      password: hash,

    });

    user.save().then(responseData => {
      res.status(201).json({
        message: 'User added successfully',
        user: {
          ...responseData,
          id: responseData._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  });
});

routes.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email })
  .then( user => {
    if(!user) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }

    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      'secret key',
      {expiresIn: '1h'}
    );

    res.status(200).json({
      token: token
    });
  }).catch(err => {
    res.status(500).json({
      error: err
    });
  });

  // bcrypt.hash(req.body.password, 10)
  // .then(hash => {
  //   console.log(hash);
  //     User.findOne({email: req.body.email, password: hash}).then(user => {
  //     if(!user){
  //       return res.status(401).json({
  //         message: 'Invalid Credentials'
  //       });
  //     }

  //     const token = jwt.sign(
  //       {email: user.email, userId: user._id},
  //       'secret key',
  //       {expiresIn: '1h'}
  //     );

  //     res.status(200).json({
  //       token: token
  //     });
  //   })
  //   .catch(err => {
  //     res.status(500).json({
  //       error: err
  //     });
  //   });
  // });
});

module.exports = routes;
