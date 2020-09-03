var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
const middlewareObj = require("../middleware");





// INDEX - Show all campgrounds
router.get("/", function(req,res){
	
    /////// obtendo todos os campgrounds do banco de dados ////////
    
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            }
            else{
                res.render("campgrounds/index", {campgrounds:allCampgrounds});
    
            }
        })	
    })


    // REGISTER ROUTE
router.post("/", middlewareObj.isLoggedIn, function(req,res){
	
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, imagem:image, description:description, author:author};
        
    Campground.create(newCampground, function(err, novoCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(novoCampground);
            res.redirect("/campgrounds"); 
        }
    })
    
    });
    
    // NEW - show form to create new campground

    router.get("/new",middlewareObj.isLoggedIn, function(req,res){
        
        res.render("campgrounds/new.ejs")
        
    });
    
    // SHOW - Show more info about campground
    
    router.get("/:id", function(req,res){
        /////mostrar o campground com o determinado id
        /////mostrar as informações desse campground
        //// mostrar a pagina desse campground
    
        //// encontra o dado com o id especifico ///// 
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    
            if(err){
                console.log(err);
            }	
            else{
                    //// mostrar a pagina desse campground
                    res.render("campgrounds/show", {campground: foundCampground});
    
    
            }
    
        })
    })

    //EDIT CAMPGROUD ROUTE
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    })
})


    // UPDATE CAMPGROUND ROUTE
    router.put("/:id",middlewareObj.checkCampgroundOwnership, function(req,res){
        
        //find and update the correct campground
        var data = req.body.campground;
        Campground.findByIdAndUpdate(req.params.id, data, function(err, updatedCampground){
        
            if(err){
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        })

        //redirect to the show page
    })

    // DELETE ROUTE
    router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req,res){
    
        Campground.findByIdAndRemove(req.params.id, function(err){
            if(err){
                res.redirect("/campgrounds")
            } else {
                res.redirect("/campgrounds");
            }
        })
    })

    module.exports = router;