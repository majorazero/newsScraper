const cheerio = require("cheerio");
const axios = require("axios");


module.exports = function(app){
  app.post("/api/scrape",function(req,res){
    //we'll use axios to grab the site link
    axios.get(req.body.url).then(function(response){
      //we'll use cheerio here to start scraping
      let $ =  cheerio.load(response.data);

      let results = [];

      $("h5").each(function(i,element){
        let title = $(element).find("a").text();
        let link = $(element).find("a").attr("href");
        let blurb = $(element).parent().find("p").text();
        if(blurb === ""){
          blurb = "No Blurb";
        }
        let author = $(element).parent().find("a .uppercase").text().replace(/([A-Z])/g,' $1');
        if(author === ""){
          author = "No Author Data";
        }

        results.push({
          title: title,
          link: link,
          blurb: blurb,
          author: author
        });
      });

      res.json(results);
    });
  });
};
