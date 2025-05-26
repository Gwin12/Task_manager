const express = require("express");
const taskRoute = express.Router();
const cors = require("cors");

taskRoute.use(cors({ origin: "*" }))


// Controllers
const TaskController = require('../controllers/TaskController')
const AuthController = require('../controllers/AuthController')
const { mustBeLoggedIn, mustBeAdmin } = AuthController
const { createTask, getTasks, updateTask, deleteTask, reportTime, taskReport } = TaskController;

taskRoute.use(mustBeLoggedIn)

taskRoute.route("/")
    .get(getTasks)
    .post(createTask)

taskRoute.route("/report-time")
    .get(reportTime)

taskRoute.route("/report/:id")
    .get(mustBeAdmin, taskReport)

taskRoute.route("/:id")
    .put(updateTask)
    .delete(deleteTask)


module.exports = taskRoute;