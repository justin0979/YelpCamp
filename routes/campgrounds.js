const Campground = require('../models/campground.js'),
      express = require('express'),
      router = express.Router();

// Index - show all campgrounds
router.get('/campgrounds', (req, res) => {
 Campground.find({})
           .exec((err, allCampgrounds) => {
            if(err) console.log(err);
            else {
              res.render('campgrounds/index', { campgrounds: allCampgrounds });
            }
           }); 
});

// Create - add new campground to DB
router.post('/campgrounds', (req, res) => {
  const name        = req.body.name,
        image       = req.body.image,
        description = req.body.description;
  
  Campground.create({
    name: name,
    image: image,
    description: description
  })
  .exec((err, newlyCreated) => {
    if(err) console.log(err);
    else res.redirect('/campgrounds');
  });
});

// New Route
router.get('/campgrounds/new', (req, res) => res.render('campgrounds/new'));

// Show Route
router.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if(err) console.log(err)
      else res.render('campgrounds/show', { campground: foundCampground });
    });
});

module.exports = router;