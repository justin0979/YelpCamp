const express               = require('express'),
      app                   = express(),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      Campground            = require('./models/campground'),
      seedDB                = require('./seeds'),
      Comment               = require('./models/comment'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      User                  = require('./models/user'),
      expressSession        = require('express-session');

const commentRoutes    = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes       = require('./routes/index');

mongoose.connect('mongodb://mongo:27017/yelp_camp', { useNewUrlParser: true });

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// Passport Configuration
app.use(expressSession({
  secret: "All the camps",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seedDB();

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


app.listen(PORT, () => { 
	console.log(`
    
    YelpCamp Server listening on port ${PORT}, mapped locally to port ${PORT}.
    
    `)
});
