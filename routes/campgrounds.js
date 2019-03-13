const Campground = require('../models/campground.js'),
  express = require('express'),
  router = express.Router(),
  middleware = require('../middleware');

// Index - show all campgrounds
router.get('/', (req, res) => {
  Campground.find({}).exec((err, allCampgrounds) => {
    if (err) console.log(err);
    else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

// Create - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
  const name = req.body.name,
    image = req.body.image,
    description = req.body.description,
    author = {id: req.user._id, username: req.user.username},
    newCampground = {name: name, image: image, description: description, author: author};

  Campground.create(newCampground)
    .then(() => res.redirect('/campgrounds'))
    .catch(err => console.log(err));
});

// New Route
router.get('/new', middleware.isLoggedIn, (req, res) => res.render('campgrounds/new'));

// Show Route
router.get('/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) console.log(err);
      else res.render('campgrounds/show', {campground: foundCampground});
    });
});

// Edit Campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id)
    .then(foundCampground => res.render('campgrounds/edit', {campground: foundCampground}))
    .catch(() => res.render('campgrounds'));
});

// Update route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    .then(() => res.redirect(`/campgrounds/${req.params.id}`))
    .catch(() => res.redirect('/campgrounds'));
});

// Destroy route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id)
    .then(() => res.redirect('/campgrounds'))
    .catch(() => res.redirect('/campgrounds'));
});

module.exports = router;
