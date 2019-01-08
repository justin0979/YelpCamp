const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 3000;
const campgrounds = [
	{ name: "Salmon Creek", image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJiZz-OBNf8A08S6XT0fhJCQQM3Kq3JndXQ8IWdsEJ6js5U-1e' },
	{ name: "Mountain Goat Pass", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKYqAIzLiYARfSLmaow8o-PEFRMDzCMe89M3cf0wBN2IT1Uw-G" },
	{ name: "Cedar Woods", image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMtnELpeKyI2Bx8PiZJJiQOpDmBMTNyDziXw9RbktXGH_VKWoo7g' }
];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
	res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', (req, res) => {
	// get data from form and add to campgrounds array
	const name = req.body.name;
	const image = req.body.image;
	// redirect back to campgrounds page
	campgrounds.push( {name: name, image: image} );

	res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
	res.render('new');
});

app.listen(PORT, () => { 
	console.log(`YelpCamp Server listening on port ${PORT}, mapped locally to port ${PORT}.`)
});
