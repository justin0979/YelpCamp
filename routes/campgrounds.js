const Campground = require('../models/campground.js'),
      express = require('express'),
      router = express.Router();

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Index - show all campgrounds
router.get('/', (req, res) => {
 Campground.find({})
           .exec((err, allCampgrounds) => {
            if(err) console.log(err);
            else {
              res.render('campgrounds/index', { campgrounds: allCampgrounds });
            }
           }); 
});

// Create - add new campground to DB
router.post('/', isLoggedIn, (req, res) => {
  const name          = req.body.name,
        image         = req.body.image,
        description   = req.body.description,
        author        = { id: req.user._id, username: req.user.username }
        newCampground = { name: name, image: image, description: description, author: author };
  
  Campground.create( newCampground )
  .then(newlyCreated => res.redirect('/campgrounds'))
  .catch(err => console.log(err));
});

// New Route
router.get('/new', isLoggedIn,(req, res) => res.render('campgrounds/new'));

// Show Route
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if(err) console.log(err)
      else res.render('campgrounds/show', { campground: foundCampground });
    });
});

module.exports = router;
