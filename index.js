require("dotenv").config();
require("./connection");
const express = require("express");
const logger = require("./middlewares/loggerMiddleware");
const cors = require("cors");
const notFound = require("./middlewares/notFound");
const errorHAndler = require("./middlewares/errorHandler");
const notesRouter = require("./Controllers/notes");
const usersRouter = require("./Controllers/users");

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);
app.use("/notes", notesRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("<h1>Notes api</h1>");
});

app.use(errorHAndler);
app.use(notFound);

const server = app.listen(PORT, () =>
  console.log(`Application running on port ${PORT}`)
);

module.exports = { app, server };
