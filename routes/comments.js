var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
const middlewareObj = require("../middleware");



// New comment //
router.get("/new", middlewareObj.isLoggedIn, function(req,res){

    Campground.findById(req.params.id, function(err, foundCampground){
    
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:foundCampground})	
        }
    
    })
    
    });

    // Comments Create
    
    router.post("/", middlewareObj.isLoggedIn, function(req,res){
    
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
            } else {
    
                Comment.create(req.body.comment, function(err, comment){
                    if(err){
                        console.log(err);
                        req.flash("error", "Something went wrong")

                    } else {
                        // add username and add it to comment
                           comment.author.id = req.user._id;
                           comment.author.username = req.user.username;
                           //save comment
                           comment.save();
                           
                           //add comment to the campground;
                        foundCampground.comments.push(comment);
                           // save comment to the campground
                        foundCampground.save();
                        req.flash("success", "Successfuly added comment")

                        res.redirect("/campgrounds/"+ foundCampground._id);
                    }
                });
            }
        })
    
    
    });

    // Rota de edição de comentário

router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership,function(req,res){
Comment.findById(req.params.comment_id, function(err,foundComment){
console.log(foundComment);
    if(err){
        res.redirect("back");
    } else { 
        res.render("comments/edit", {campground_id:req.params.id, comment:foundComment})
    }
})

})

// construindo rota de UPDATE

router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req,res){

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,UpdatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted")

            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})
// construindo rota de remoção

router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

    

    module.exports = router;