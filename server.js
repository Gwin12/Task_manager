require("dotenv").config();
const express = require("express");
const app = express();
const { connectDB, sequelize } = require('./config/db')
const PORT = process.env.PORT || 5000;

const { usersRoutes, taskRoutes } = require("./routes/apiRouter");
const { errorHandler } = require("./utils/responses");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("An error has occurred!");
});

const startServer = async () => {
  await connectDB();
  await sequelize.sync(); 
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();


app.use("/api/user", usersRoutes);
app.use("/api/task", taskRoutes);


app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on ${PORT}`))