var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var hitrostSchema = new Schema({
	'hitrost' : Number,
	'cas' : String,	
	'id_voznje' : Object
});



hitrostSchema.pre('save', function(next){
	var hitrost = this;
	next();
});

var Hitrost = mongoose.model('hitrost', hitrostSchema);
module.exports = Hitrost;
