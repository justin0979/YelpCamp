const Campground = require('../models/campground');
const Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id)
      .then(campground => {
        if (campground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do NOT have the proper clearance.');
          res.redirect('back');
        }
      })
      .catch(() => {
        req.flash('error', "Campground ain't here.");
        res.redirect('back');
      });
  } else {
    req.flash('error', 'Please Login First, OK?');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id)
      .then(foundComment => {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      })
      .catch(() => {
        req.flash('error', 'You do NOT have the proper clearance for that task.');
        res.redirect('back');
      });
  } else {
    req.flash('error', 'Please login to accomplish that task.');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Login First to Accomplish Your Mission!');
  res.redirect('/login');
};

module.exports = middlewareObj;
