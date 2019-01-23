const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const Campground    = require('./models/campground');
const seedDB        = require('./seeds');

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
                res.render('index', { campgrounds: allCampgrounds });
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
	res.render('new');
});

// Show Route
app.get('/campgrounds/:id', (req ,res) => {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if(err) console.log(err);
        else {
            //render show template with that campground
            res.render('show', { campground: foundCampground });
        }
    });
});

app.listen(PORT, () => { 
	console.log(`
    
    YelpCamp Server listening on port ${PORT}, mapped locally to port ${PORT}.
    
    `)
});
