const path = require("path");

module.exports = function(app){

  /**
  * Route for the homepage
  */
  app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"../public/index.html"));
  });


};
