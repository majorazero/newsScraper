const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let NoteSchema = new Schema({
  title: {
    type: String,
    require: "You got to have a title!",
    unique: true
  },
  text: {
    type: String,
    require: "You got to have a non-empty string for the text!",
  }
});

module.exports = mongoose.model("Note", NoteSchema);
