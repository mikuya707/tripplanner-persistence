var express = require('express');
var router = express.Router();
var models = require('../../models');
var Day = models.Day;
var Restaurant = models.Restaurant;
var Hotel = models.Hotel;
var Activity = models.Activity;
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

router.get("/", function(req, res, next) {
	Day.find()
	.populate('hotels')
	.populate('restaurants')
	.populate('activities')
	.then(function(day){
		console.log(day);
		res.send(day);
	}).then(null, next);

});
router.get('/attractions', function(req, res, next) {
	Promise.all([
	  Hotel.find(),
	  Restaurant.find(),
	  Activity.find()
	  ]).spread(function(hotels, restaurants, activities) {
	    res.send({
	      hotels: hotels,
	      restaurants: restaurants,
	      activities: activities
	    });
	  });
});
// router.get('/:id', function(req, res, next) {
// 	Day.findOne({number: req.params.id})
// 	.populate('hotels')
// 	.populate('restaurants')
// 	.populate('activities')
// 	.then(function(day){
// 		console.log(day);
// 		res.send(day);
// 	}).then(null, next);

// });
router.get('/:id/restaurants', function(req, res, next) {
	res.send('all restaurants');
	
});
router.get('/:id/hotel', function(req, res, next) {
	res.send('all hotels');
	
});
router.get('/:id/activities', function(req, res, next) {
	res.send('all activities');
	
});
router.post('/:id', function(req, res, next) {
	Day.create({number: req.params.id}).then(function(doc){
		res.send(doc);
	}).then(null, next);

});

router.post('/:id/restaurants', function(req, res, next) {
	Day.findOne({_id: req.params.id})
	.then(function(day){
		day['restaurants'].push(req.body.type);
		day.save().then(function(day){
			Day.populate(day, [{path: 'restaurants'}, {path: 'hotels'}, {path: 'activities'}])
			.then(function(day){
				console.log(day);
				res.send(day);
			});
		});
	});
});
router.post('/:id/hotel', function(req, res, next) {
	Day.findOne({_id: req.params.id})
	.then(function(day){
		day['hotels'] = req.body.hotelId;
		day.save().then(function(day){
			Day.populate(day, [{path: 'restaurants'}, {path: 'hotels'}, {path: 'activities'}])
			.then(function(day){
				console.log(day);
				res.send(day);
			});
		});
	});	
});
router.post('/:id/activities', function(req, res, next) {
	Day.findOne({_id: req.params.id})
	.then(function(day){
		day['activities'].push(req.body.type);
		day.save().then(function(day){
			Day.populate(day, [{path: 'restaurants'}, {path: 'hotels'}, {path: 'activities'}])
			.then(function(day){
				res.send(day);
			});
		});
	});
});

router.delete('/:id/', function(req, res, next) {
	Day.remove({number: req.params.id}).then(function(day){
		console.log("success");
	}).then(null, next);
});

router.delete('/:id/hotel', function(req, res, next) {
	Day.findOne({_id: req.params.id})
	.then(function(day){
		day['hotels'] = undefined;
		day.save().then(function(day){
			res.end();
		});
	});
});

router.delete('/:id/restaurants', function(req, res, next) {
	Day.findOne({_id: req.params.id})
	.then(function(day){
		day.restaurants = day.restaurants.splice(day.restaurants.indexOf(req.body.idNum), 1);
		day.save().then(function(day){
			res.end();
		});
	});
});

router.delete('/:id/activities', function(req, res, next) {
	Day.findOne({_id: req.params.id})
	.then(function(day){
		day.activities = day.activities.splice(day.activities.indexOf(req.body.idNum), 1);
		day.save().then(function(day){
			res.end();
		});
	});
});

module.exports = router;