const express = require("express");
const Post = require('../models/post');

const routes = express();

routes.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description
  });

  post.save().then(responseData => {
    res.status(201).json({
      postId: responseData._id,
      message: 'Post added successfully'
    });
  });
});

routes.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description
  });

  Post.updateOne({_id: req.params.id}, post)
  .then(result => {
    res.status(201).json({
      message: 'Post updated successfully'
    });
  });
});

routes.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
  .then((post) => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(4045).json({
        message: "Posts not found",
      });
    }
  });
});

routes.get("", (req, res, next) => {
  Post.find()
  .then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

routes.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
  .then(result => {
    console.log('Deleted');
    res.status(200).json({'message': 'Post deleted.'});
  })
});

module.exports = routes;
