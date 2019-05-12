const express = require("express");
const multer = require("multer");
const Post = require('../models/post');

const routes = express();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination:(req, file, cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

routes.post("", multer({storage: storage}).single('image'),(req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    imagePath: url + '/images/' + req.file.filename
  });

  post.save().then(responseData => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...responseData,
        id: responseData._id
      }
    });
  });
});

routes.put("/:id", multer({storage: storage}).single('image'), (req, res, next) => {

  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    imagePath: imagePath
  });

  Post.updateOne({_id: req.params.id}, post)
  .then(result => {
    res.status(201).json({
      message: 'Post updated successfully',
      imagePath: result.imagePath
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
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage -1))
    .limit(pageSize);
  }


  postQuery.then((documents) => {
    fetchedPosts = documents;
    return Post.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count
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
