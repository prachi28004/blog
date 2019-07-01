var express=require("express"),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    methodoverride=require("method-override"),
    expresssenitizer=require("express-sanitizer")
    app=express();

mongoose.connect("mongodb://localhost/rest_blog")
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expresssenitizer());
app.use(methodoverride("_method"))

var blogschema=new mongoose.Schema({
    title:String,
    image:String,
    body:String
})

var blog=mongoose.model("blog",blogschema);


//----Restful Routing-------

/*blog.create({
    title:"Rainbow Rose",
    image:"http://img.archilovers.com/story/3a043ecb-f037-41be-8022-a712bea43e3f.jpg",
    ody:"Everyone knows about rose flower but what are rainbow roses.  A rainbow rose is indeed a rose but that which has artificially colored petals. This method simply exploits natural process of ordinary rose by which water flows up the stem.  The stem is split and each part is dipped in different colored liquid. These colors are then drawn into petals resulting to multicolored rose. These changes make rose to have multi-colors thus the name rainbow rose"
});*/

app.get("/",function(req,res){
    res.redirect("/blogs");
});
//=========index page Route
app.get("/blogs",function(req,res){
    blog.find({},function(err,blog2){
            if(err){
                console.log("ERROR OCCURED")
                console.log(err);
            }
            else{
                res.render("index",{b1:blog2});
            }
    })
    
});



app.post("/blogs",function(req,res){
      //Create Blog
      blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
      })
      
})


//=========new route=============
app.get("/blogs/new",function(req,res){
    res.render ("new");
})

//========SHOW ROUTE==========
 app.get("/blogs/:id",function(req,res){
     blog.findById(req.params.id,function(err,foundblog){
         if(err){
             res.redirect("/blogs");
         }else{
             res.render("show",{fblog:foundblog});
         }
     })
 })

//=====update route=========
 app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
         if(err){
             res.redirect("/blogs");
         }else{
            res.render("edit",{blog:foundblog})
         }
     })
    
 })
 app.put("/blogs/:id",function(req,res){
     blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
         if(err){
             res.redirect("/blogs");
         }else{
             res.redirect("/blogs/"+req.params.id);
         }
     })
 })

 app.delete("/blogs/:id",function(req,res){
     //--Destroy blog
     blog.findByIdAndRemove(req.params.id,function(err){
         if(err){
             res.redirect("/blogs");
         }
         else{
             res.redirect("/blogs");
         }
     })
    
 });

app.listen(200,function(){
    console.log("Server Has Started");
});