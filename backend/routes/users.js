const express = require("express");
const UserController = require('../controllers/user.controller');
const routes = express();

routes.post("/signup", UserController.userSingup);

routes.post("/login", UserController.userLogin);

module.exports = routes;
