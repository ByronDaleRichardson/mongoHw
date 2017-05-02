// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Required models
var Article = require("./models/Article.js");
var Note = require("./models/Note.js");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Setting mongoose to use ES6 promises
mongoose.Promise = Promise;

// Initializing express
var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// BodyParser makes it possible for our server to interpret data sent to it.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var PORT = process.env.PORT || 3000;

// Make public a static dir
app.use(express.static("app"));

// DB config with mongoose
mongoose.connect("mongodb://heroku_3m75d38c:g3lv9f4ce20krid9a8qmt749ns@ds111771.mlab.com:11771/heroku_3m75d38c");
//mongoose.connect("mongodb://localhost:scrape");
var db = mongoose.connection;

db.on("error", function(err){
  console.log("Mongoose error: ", err);
});

db.once("open", function(){
  console.log("Mongoose connection successful");
});

app.get("/", function(req, res){
  Article.find({"saved": false}, function(err, doc){
    var hbsobj = {
      articles: doc
    }
    console.log(hbsobj);
    res.render("index", hbsobj);
  });
});

app.get("/saved", function(req, res){
  Article.find({"saved": true}, function(err, doc){
    var hbsobj = {
      articles: doc
    }
    console.log(hbsobj);
    res.render("saved", hbsobj);
  });
});

app.post("/saved/:id", function(req, res){
  var articleID = req.params.id;
  console.log(articleID);

  Article.findOneAndUpdate({"_id":articleID}, {"saved": true})
  .exec(function(err, doc){
    if(err){
      console.log(err);
    }else {
      res.send(200);
    }
  })

});

app.post("/unsaved/:id", function(req, res){
  var articleID = req.params.id;
  console.log(articleID);

  Article.findOneAndUpdate({"_id":articleID}, {"saved": false})
  .exec(function(err, doc){
    if(err){
      console.log(err);
    }else {
      res.send(200);
    }
  })

});

app.post("/notes/:id", function(req, res){
  var articleID = req.params.id;
  var newNote = new Note({body: req.body.text});

  newNote.save(function(err, doc){
    if (err) {
      console.log(err);
    } else {
      Article.findOneAndUpdate({"_id":articleID}, {$push: {"notes": doc._id}})
      .exec(function(err, doc){
        if (err){
          console.log(err);
        }else {
          res.send(200);
        }
      });
    }
  });

});

app.get("/notes/:id", function(req, res){
  var articleID = req.params.id;
  console.log(articleID);
  Article.findOne({"_id":articleID})
  .populate("notes")
  .exec(function(err, doc){
    if(err){
      console.log(err);
    }else {
      res.json(doc);
    }
  })

});

app.post("/delete/:id", function(req, res){
  var _id = req.params.id;

  Note.remove({"_id":_id}, function(err){
    if(err){
      console.log(err);
    }else{
      res.send(200);
    }
  });

});

app.get("/scrape", function(req, res){
  request("https://theverge.com", function(err, response, html){
    var $ = cheerio.load(html);
    $("h2[class=c-entry-box--compact__title]").each(function(i, element){

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      var newArticle = new Article(result);

      newArticle.save(function(err, doc){
          if(err){
            console.log(err);
          }else {
            console.log(doc);
          }
      });

    });
  });
  res.send(200);
});

//Listen on PORT
app.listen(PORT, function(){
  console.log("App running on port " + PORT );
})
