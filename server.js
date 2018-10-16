const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));

require("./controllers/index.js")(app);

app.listen(PORT,function(){
  console.log("Listening in on..."+PORT);
});
