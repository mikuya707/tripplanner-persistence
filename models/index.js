var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tripPlanner');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
var Promise = require('bluebird');
mongoose.Promise = Promise;

module.exports = {
  Hotel: require('./hotel'),
  Activity: require('./activity'),
  Restaurant: require('./restaurant'),
  Place: require('./place'),
  Day: require('./day')
};