var express = require('express');
var router = express.Router();
var models = require('../../models');
var Day = models.Day;
var Restaurants = models.Restaurant;
var mongoose = require('mongoose');


router.get("/", function(req, res, next) {
	Day.find().then(function(days){
		res.send(days);
	}).then(null, next);

})

router.get('/:id', function(req, res, next) {
	Day.findOne({number: req.params.id}).then(function(day){
		res.send(day);
	}).then(null, next);

})
router.get('/:id/restaurants', function(req, res, next) {
	res.send('all restaurants');
	
})
router.get('/:id/hotel', function(req, res, next) {
	res.send('all hotels');
	
})
router.get('/:id/activities', function(req, res, next) {
	res.send('all activities');
	
})
router.post('/:id', function(req, res, next) {
	Day.create({number: req.params.id}).then(function(doc){
		res.send(doc);
	}).then(null, next);

})

router.post('/:id/restaurants', function(req, res, next) {
	res.send('post a restaurant');
	
})
router.post('/:id/hotel', function(req, res, next) {
	res.send('post a hotel');
	
})
router.post('/:id/activities', function(req, res, next) {
	res.send('post an activity');
})

router.delete('/:id/', function(req, res, next) {
	Day.remove({number: req.params.id}).then(function(day){
		console.log("success");
	}).then(null, next);
})

module.exports = router;