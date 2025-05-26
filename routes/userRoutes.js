const express = require("express");
const userRoute = express.Router();
const cors = require("cors");

userRoute.use(cors({ origin: "*" }))


// Controllers
const UserController = require('../controllers/UserController')
const AuthController = require('../controllers/AuthController')
const { loginUser, register, mustBeLoggedIn } = AuthController
const { getUserData } = UserController;


userRoute.route("/login")
    .post(loginUser)

userRoute.route("/register")
    .post(register)

userRoute.route("/")
    .get(mustBeLoggedIn, getUserData)


module.exports = userRoute;