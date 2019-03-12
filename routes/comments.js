const Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  express = require('express'),
  router = express.Router({mergeParams: true}),
  middleware = require('../middleware');

// Comments New
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id).exec((err, campground) => {
    if (err) console.log(err);
    else res.render('comments/new', {campground: campground});
  });
});

/*router.post('/campgrounds/:id/comments', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
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

// Comment Edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id)
    .then(foundComment => res.render('comments/edit', {campground_id: req.params.id, comment: foundComment}))
    .catch(() => res.redirect('back'));
});

// Comment Update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
    .then(() => res.redirect(`/campgrounds/${req.params.id}`))
    .catch(() => res.redirect('back'));
});

// Comments Destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id)
    .then(() => res.redirect(`/campgrounds/${req.params.id}`))
    .catch(() => res.redirect('back'));
});

module.exports = router;
