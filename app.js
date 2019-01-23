const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const Campground    = require('./models/campground');
const seedDB        = require('./seeds');
const Comment       = require('./models/comment');

seedDB();
mongoose.connect('mongodb://mongo:27017/yelp_camp', { useNewUrlParser: true });

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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

app.get('/campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) console.log(err);
        else {
            res.render('comments/new', { campground: campground });
        }
    });
});

app.post('/campgrounds/:id/comments', (req, res) => {
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

app.listen(PORT, () => { 
	console.log(`
    
    YelpCamp Server listening on port ${PORT}, mapped locally to port ${PORT}.
    
    `)
});
