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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seedDB();

app.get('/', (req, res) => {
	res.render('landing');
});

// Index Route
app.get('/campgrounds', (req, res) => {
    // Get all campgrounds from DB
        Campground.find({}, (err, allCampgrounds) => {
            if(err) {
                console.log(err);
            } else {
                res.render('campgrounds/index', { campgrounds: allCampgrounds });
            }
        });
});

// Create Route
app.post('/campgrounds', (req, res) => {
    // get data from form and add to campgrounds array
	const name = req.body.name;
	const image = req.body.image;
    const description = req.body.description;

    // Create a new campground and save to DB
    Campground.create({
        name: name,
        image: image,
        description: description
    }, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
	        // redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    });

});

// New Route
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

// Show Route
app.get('/campgrounds/:id', (req ,res) => {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err) console.log(err);
        else {
            //render show template with that campground
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
});

//========================
// Comments Routes
//========================

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) console.log(err);
        else {
            res.render('comments/new', { campground: campground });
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// AUTH ROUTES

app.get('/register', (req, res) => res.render('register'));

app.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if(err) return res.redirect('/login');
      passport.authenticate("local")(req, res, () => {
        res.redirect('/campgrounds');
    });
  });
});

app.get('/login', (req, res) => res.render('login'));

app.post('/login', passport.authenticate("local", {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}),(req, res) => {});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}

app.listen(PORT, () => { 
	console.log(`
    
    YelpCamp Server listening on port ${PORT}, mapped locally to port ${PORT}.
    
    `)
});
