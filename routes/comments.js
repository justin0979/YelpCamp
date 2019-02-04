const Campground = require('../models/campground'),
      Comment = require('../models/comment'),
      express = require('express'),
      router = express.Router({ mergeParams: true });

// middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
};

// Comments New
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .exec((err, campground) => {
      if(err) console.log(err)
      else res.render('comments/new', { campground: campground });
    });
});

/*router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .exec((err, campground) => {
      if(err) {
        console.log(err);
        res.redirect('/campgrounds');
      } else {
        Comment.create(req.body.comment)
          .exec((err, comment) => {
            if(err) console.log(err);
            else {
              campground.comments.push(comment);
              campground.save();
              res.redirect(`/campgrounds/${campground._id}`);
            }
          });
      }
    });
});
*/
/*
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
      res.redirect('/campground');
    } else {
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
*/

// Comments Create
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
  .then(campground => {
    Comment.create(req.body.comment)
    .then(comment => {
      // add username and id to comment
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      //save comment
      comment.save();
      campground.comments.push(comment);
      campground.save();
      res.redirect(`/campgrounds/${campground._id}`);
    })
    .catch(err => console.log(err));
  })
  .catch(err => {
    console.log(err);
    res.redirect('/campground');
  });
});

module.exports = router;
