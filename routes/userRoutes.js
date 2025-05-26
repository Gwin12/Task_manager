const express = require("express");
const userRoute = express.Router();
const cors = require("cors");

userRoute.use(cors({ origin: "*" }))


// Controllers
const AuthController = require('../controllers/AuthController')
const { loginUser, register, mustBeLoggedIn } = AuthController


userRoute.route("/login")
    .post(loginUser)

userRoute.route("/register")
    .post(register)


module.exports = userRoute;