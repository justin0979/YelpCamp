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

// Edit Campground route
router.get('/:id/edit', (req, res) => {
  Campground.findById(req.params.id)
  .then(campground => res.render('campgrounds/edit', { campground: campground }))
  .catch(err => console.log(err))
});

router.put("/:id", (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground)
  .then(updatedCampground => res.redirect(`/campgrounds/${req.params.id}`))
  .catch(err => res.redirect('/campgrounds'));
})

module.exports = router;
