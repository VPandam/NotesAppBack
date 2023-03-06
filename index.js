require("dotenv").config();
require("./connection");
const express = require("express");
const logger = require("./middlewares/loggerMiddleware");
const cors = require("cors");
const NoteModel = require("./models/Note");
const notFound = require("./middlewares/notFound");

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);

app.get("/", (req, res) => {
  res.send("<h1>Notes api</h1>");
});

app.get("/notes", (req, res) => {
  NoteModel.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  NoteModel.findById(id)
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      res.status(404).send("Note not found");
      console.log(err);
    });
});

app.post("/notes", (req, res) => {
  const { content, important } = req.body;

  const newNote = NoteModel({
    content: content,
    date: new Date(),
    important: important || false,
  });

  newNote
    .save()
    .then((result) => {
      {
        console.log(result);
        res.status(201).json(result);
      }
    })
    .catch((err) => {
      res.status(400).json(err);
      console.log(err.message);
    });
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  NoteModel.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json(result);
        console.log(result);
      } else {
        res.status(404).json(result);
      }
    })
    .catch((err) => res.status(204));
});
app.put("/notes/:id", (req, res) => {
  const { body } = req;
  const { id } = req.params;

  NoteModel.findById(id)
    .then((foundNote) => {
      if (body.content) foundNote.content = body.content;
      if (body.important.typeof !== undefined)
        foundNote.important = body.important;
      foundNote.save().then((result) => {
        console.log(result);
        res.json(result);
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err.message);
    });
});

app.use(notFound);

const server = app.listen(PORT, () =>
  console.log(`Application running on port ${PORT}`)
);

module.exports = { app, server };
