var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var voznjaSchema = new Schema({
	'datum_voznje' : Date,
	'cas_zacetka' : String,
	'cas_konca' : String	
});



voznjaSchema.pre('save', function(next){
	var voznja = this;
	next();
});

var Voznja = mongoose.model('voznja', voznjaSchema);
module.exports = Voznja;