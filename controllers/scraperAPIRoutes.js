const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models");


module.exports = function(app){
  /**
  * Returns all the articles we've scraped from the database.
  */
  app.get("/articles",function(req,res){
    db.Article.find({}).then(function(data){
      res.json(data);
    }).catch(function(err){
      res.json(err);
    });
  });

  app.get("/favorites",function(req,res){
    db.Article.find({saved: true}).then(function(data){
      res.json(data);
    }).catch(function(err){
      res.json(err);
    });
  });

  app.get("/articles/:id",function(req,res){
    db.Article.findOne({_id: req.params.id}).populate("notes").then(function(data){
      res.json(data);
    }).catch(function(err){
      res.json(err);
    });
  });

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

      db.Article.create(results).then(function(data){
      }).catch(function(err){
        return res.json(err);
      });
      res.json("Scraped");
    });
  });

  app.post("/api/notes",function(req,res){
    console.log(req.body);
    db.Note.create({
      title: req.body.title,
      text: req.body.text
    }).then(function(note){
      console.log(1);
      console.log(note);
      console.log(req.body.id);
      return db.Article.findOneAndUpdate({_id:req.body.id}, {$push: {notes: note._id}});
    }).then(function(articleData){
      console.log(articleData);
      res.json(articleData);
    }).catch(function(err){
      res.json(err);
    });
  });

  app.put("/favorite",function(req,res){
    let newSaved;
    console.log(typeof req.body.saved);
    if(req.body.saved === true || req.body.saved === "true"){
      newSaved = false;
    }
    else{
      newSaved = true;
    }
    console.log(newSaved);
    db.Article.update({
      _id: req.body.id
    },{ $set:{
      saved: newSaved}
    }).then(function(data){
      res.json("Updated!");
    })
  });
};
