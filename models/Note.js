const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  content: {
    type: String,
    required: true,
    unique: true,
  },
  important: Boolean,
  date: { type: Date, default: Date.now },
});
const noteModel = model("Note", noteSchema);
module.exports = noteModel;
