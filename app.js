var express    = require("express"),
app            = express(),
request        = require("request"),
passport       = require("passport"),
LocalStrategy  = require("passport-local"),
methodOverride = require("method-override"),
bodyParser     = require("body-parser"),
User           = require("./models/user"),
mongoose       = require('mongoose'),
flash          = require("connect-flash");

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/campgrounds",{ 
    useNewUrlParser: true
  }
);

app.use(methodOverride("_method"));
//var seedDB = require("./seeds");
//seedDB;

// Requiring Routes

var commentRoutes     = require("./routes/comments"),
	campgroundsRoutes = require("./routes/campgrounds"),
	indexRoutes        = require("./routes/index");


app.set("view engine", "ejs");


app.use(express.static(__dirname + "/public"))
////////////////////////
 
//connect flash
app.use(flash());

/// SCHEMA///

var Campground = require ("./models/campground");
var Comment = require ("./models/comment");	
/////////////////

//===========================
// PASSPORT CONFIG
//===========================
app.use(require("express-session")({
	secret:"My dog is the best",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


//===========================
//
//===========================
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT || 8081,function(){
    console.log("o servidor está rodando na url http://localhost:8081")
});
