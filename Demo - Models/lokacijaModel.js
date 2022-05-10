var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var lokacijaSchema = new Schema({
	'zemljepisna_sirina' : Number,
	'zemljepisna_dolzina' : Number,
	'cas' : String,	
	'id_voznje' : Object
});



lokacijaSchema.pre('save', function(next){
	var lokacija = this;
	next();
});

var Lokacija = mongoose.model('lokacija', lokacijaSchema);
module.exports = Lokacija;
