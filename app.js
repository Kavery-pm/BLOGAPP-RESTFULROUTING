var express = require("express");
var app = express();
app.set("view engine", "ejs");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/blogo_app', {useNewUrlParser: true});

var blogSchema = new mongoose.Schema({
title: String,
image: String,
body: String,
created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);
app.get("/",function(req, res){
res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, Blog){
        if(err){
            console.log(err);
        }else{
            res.render("index",{Blog: Blog});
        }
    });

});

// Blog.create({
// title: "Pucon",
// image: "https://pyme.emol.com/wp-content/uploads/2020/01/Fedetur-puc%C3%B3n.jpg",
// body: "visited this place first in Chile.its a beautiful place with lakes,volcanoes.was here for 3 days.had been to hot springs as well as fish culture and waterfall carbagua",
// });
app.get("/blogs/new", function(req, res){
res.render("new");
});


app.post("/blogs", function(req, res){
    // create blog
    console.log(req.body);
    console.log("===========")
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
if(err){
    console.log(err);
    res.redirect("/blogs")
}else{
    res.render("show", {blog: foundBlog});
}
    });

});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
if(err){
    console.log(err);
    res.redirect("/blogs");
}else{
    res.render("edit", {blog: foundBlog});
}
    });

});

app.put("/blogs/:id", function(req, res){
   
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndDelete(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }  else {
            res.redirect("/blogs/");
        }
     });
});
app.listen("3000", function(req, res){
console.log("blog server started");

});