var voznjaModel = require('../models/voznjaModel.js');
var userModel = require('../models/userModel.js');
var hitrostModel = require('../models/hitrostModel.js');

/**
 * hitrostController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    // izpis vseh hitrosti
    list: function (req, res) { 
        hitrostModel.find(function (err, hitrosti) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            return res.json(hitrosti);

        });
    },


    // izpis ene hitrosti
    show: function (req, res) {
        var id = req.params.id;
        hitrostModel.findOne({_id: id}, function (err, hitrost) {
            if (err) {
                return res.status(500).json({
                    message: 'Napaka pri prodobivanju hitrosti.',
                    error: err
                });
            }
            if (!hitrost) {
                return res.status(404).json({
                    message: 'Ni takšne hitrosti'
                });
            }
            return res.json(hitrost);
        });
    },

  

    // prikaz hitrosti
    showHitrosti: function(req, res){
        seja = req.session.userId;
        var id = req.params.id;
        hitrostModel.find({ id_voznje: id }).exec(function (err, hitrosti) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting hitrosti.',
                    error: err
                });
            }

             //res.render('voznja/vseVoznje', { seja: seja, hitrosti: hitrosti  });
             return res.json(hitrosti);
        });
       
    }

};