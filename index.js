require("dotenv").config();
require("./connection");
const NoteModel = require("./models/Note");
const express = require("express");
const logger = require("./loggerMiddleware");
const cors = require("cors");
const noteModel = require("./models/Note");

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/notes", (req, res) => {
  NoteModel.find().then((result) => res.json(result));
});

app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  NoteModel.findById(id)
    .then((result) => res.json(result))
    .catch((err) => {
      res.status(404).send("Note not found");
      console.log(err);
    });
});

app.post("/notes", (req, res) => {
  const { content, important } = req.body;
  // if (!req.body || !content) {
  //   return res.status(400).json({
  //     error: "note content is required",
  //   });
  // }

  const newNote = noteModel({
    content: content,
    date: new Date(),
    important: important || false,
  });

  newNote
    .save()
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).json(err));
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  NoteModel.deleteOne({ _id: id })
    .then((result) => {
      res.status(200).end();
      console.log(result);
    })
    .catch((err) => res.status(204));
});

app.listen(PORT, () => console.log(`Application running on port ${PORT}`));
