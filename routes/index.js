const express = require('express'),
  passport = require('passport'),
  User = require('../models/user'),
  router = express.Router();

// root route
router.get('/', (req, res) => res.render('landing'));

// show register form
router.get('/register', (req, res) => res.render('register'));

/*
router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if(err) res.redirect('/login')
    else {
      passport.authenticate("local")(req, res, () => res.redirect('/campgrounds'));
    }
  });
});
*/

// handle sign up logic
router.post('/register', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password)
    .then(user => {
      req.flash('success', `Welcome to YelpCamp ${user.username}.`);
      passport.authenticate('local')(req, res, () => res.redirect('/campgrounds'));
    })
    .catch(err => {
      req.flash('error', err.message);
      res.redirect('/login');
    });
});

// login form
router.get('/login', (req, res) => {
  res.render('login');
});

// handles login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

// logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/login');
});

module.exports = router;
