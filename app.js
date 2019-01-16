const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');

mongoose.connect('mongodb://mongo:27017/yelp_camp', { useNewUrlParser: true });

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Schema setup

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

let Campground = mongoose.model("Campground", campgroundSchema);
/*
Campground.create({
    name: "Mountain Goat Pass",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJiZz-OBNf8A08S6XT0fhJCQQM3Kq3JndXQ8IWdsEJ6js5U-1e' 
}, (err, campground) => {
    if(err) {
        console.log(`ERROR OCCURED: ${err}`);
    } else {
        console.log( "newly Created Campground");
        console.log(campground);
    }
});
*/
app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    // Get all campgrounds from DB
        Campground.find({}, (err, allCampgrounds) => {
            if(err) {
                console.log(err);
            } else {
                res.render('campgrounds', { campgrounds: allCampgrounds });
            }
        });
});

app.post('/campgrounds', (req, res) => {
	// get data from form and add to campgrounds array
	const name = req.body.name;
	const image = req.body.image;

    // Create a new campground and save to DB
    Campground.create({
        name: name,
        image: image
    }, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
	        // redirect back to campgrounds page
            res.redirect('/campgrounds');
        }
    });

});

app.get('/campgrounds/new', (req, res) => {
	res.render('new');
});

app.listen(PORT, () => { 
	console.log(`YelpCamp Server listening on port ${PORT}, mapped locally to port ${PORT}.`)
});
