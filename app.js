const express = require('express'),
  flash = require('connect-flash'),
  methodOverride = require('method-override'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  User = require('./models/user'),
  expressSession = require('express-session');

// requiring routes
const commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

mongoose.connect('mongodb://mongo:27017/yelp_camp', {useNewUrlParser: true});

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());

// Passport Configuration
app.use(expressSession({
    secret: 'All the camps',
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//seedDB();

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

let server = app.listen(PORT, () => {
  console.log(`
    
    YelpCamp Server listening on port ${PORT}, mapped locally to port ${PORT}.
    
    `);
});

module.exports = server;
