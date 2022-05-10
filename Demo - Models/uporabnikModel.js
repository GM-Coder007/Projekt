var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var uporabnikSchema = new Schema({
	'uporabnisko_ime' : String,
	'email' : String,
	'geslo' : String,	
	'datum_registracije' : Date,
	'slika' : String
});



uporabnikSchema.pre('save', function(next){
	var uporabnik = this;
	next();
});

var Uporabnik = mongoose.model('uporabnik', uporabnikSchema);
module.exports = Uporabnik;
