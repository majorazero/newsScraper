const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

const db = require("./models");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));

if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI);
}
else{
  mongoose.connect("mongodb://localhost/scraperScraper", {useNewUrlParser: true});
}

require("./controllers/index.js")(app);

app.listen(PORT,function(){
  console.log("Listening in on..."+PORT);
});
