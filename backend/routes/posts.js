const express = require('express');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const PostController = require('../controllers/post.controller');
const routes = express();

routes.post("", checkAuth, extractFile, PostController.createPost);

routes.put("/:id", checkAuth, extractFile, PostController.updatePost);

routes.get("/:id", PostController.getPost);

routes.get("", PostController.getAllPost);

routes.delete("/:id", checkAuth, PostController.deletePost);

module.exports = routes;
