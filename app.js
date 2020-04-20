var bodyParser   = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var mongoose     = require('mongoose');
var express      = require('express');
var app          = express();


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/blog_app");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


///////////    RESTful ROUTES  //////////////

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){

    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index.ejs", {blogs:blogs});
        }
    });
});




app.post("/blogs", function(req, res){

    req.body.blog.body = req.sanitize(req.body.blog.body);
   
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});



app.get("/blogs/new", function(req, res){

    res.render("new.ejs");

});




app.get("/blogs/:id", function(req, res){

   
   Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("show.ejs", {blog: foundBlog});
        }
   });
});


///// EDIT ////
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
           console.log(err);
        } else {
            res.render("edit.ejs", {blog: foundBlog});
        }
    });
});


///////UPDATE/////
app.put("/blogs/:id", function(req, res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body); 

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
   });
});


/////////// DELETE ///////////
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("The BlogApp server has started!"); 
 });

