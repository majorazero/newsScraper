const cheerio = require("cheerio");
const axios = require("axios");


module.exports = function(app){
  app.post("/api/scrape",function(req,res){
    console.log(req.body.url);
    res.json("BYE!");
  })
};
