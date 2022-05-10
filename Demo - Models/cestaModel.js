var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var cestaSchema = new Schema({
	'id_voznje' : Object,
	'id_lokacije' : Object,
	'stanje': String	
	
});



cestaSchema.pre('save', function(next){
	var cesta = this;
	next();
});

var Cesta = mongoose.model('cesta', cestaSchema);
module.exports = Cesta;
