const notesRouter = require("express").Router();
const NoteModel = require("../models/Note");

notesRouter.get("/", (req, res, next) => {
  NoteModel.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

notesRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  NoteModel.findById(id)
    .then((result) => {
      if (result === null) {
        res.status(404);
      }
      console.log(result);
      res.json(result).status(200);
    })
    .catch((err) => {
      res.status(404).send("Note not found");
      next(err);
    });
});

notesRouter.post("/", (req, res) => {
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

notesRouter.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  NoteModel.findByIdAndDelete(id)
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).json(result);
        console.log(result);
      } else {
        res.status(404).json(result);
      }
    })
    .catch((err) => {
      res.status(404).send("Note not found");
      next(err);
    });
});
notesRouter.put("/:id", (req, res) => {
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
      res.send(err.message);
      next(err);
    });
});

module.exports = notesRouter;
