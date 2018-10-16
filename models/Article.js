const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  title: {
    type: String,
    require: "You got to have a title!",
    unique: true
  },
  link: {
    type: String,
    required: "You should have a link with this article!",
    unique: true
  },
  author: {
    type: String,
    require: "You got to have something for the author!",
  },
  blurb: {
    type: String,
    require: "You got to have a non-empty string for the blurb!",
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

module.exports = mongoose.model("Article",ArticleSchema);
