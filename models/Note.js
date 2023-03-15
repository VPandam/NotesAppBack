const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  content: {
    type: String,
    required: true,
    unique: true,
  },
  important: Boolean,
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const noteModel = model("Note", noteSchema);

module.exports = noteModel;
