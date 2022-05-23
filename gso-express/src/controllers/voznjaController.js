var voznjaModel = require('../models/voznjaModel.js');
var userModel = require('../models/userModel.js');


/**
 * voznjaController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    // izpis vseh voženj
    list: function (req, res) { 
        voznjaModel.find(function (err, voznje) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            return res.json(voznje);

        });
    },


    // izpis ene vožnje
    show: function (req, res) {
        var id = req.params.id;
        voznjaModel.findOne({_id: id}, function (err, voznja) {
            if (err) {
                return res.status(500).json({
                    message: 'Napaka pri prodobivanju vožnje.',
                    error: err
                });
            }
            if (!voznja) {
                return res.status(404).json({
                    message: 'Ni takšne vožnje'
                });
            }
            return res.json(voznja);
        });
    },

    // kreiranje nove vožnje
    create: function (req, res) {

        var voznja = new voznjaModel({
            datum_voznje : req.body.datum,
            cas_zacetka : req.body.zacetek,
            cas_konca : req.body.konec
           
        });

        voznja.save(function (err, voznja) {
            if (err) {
                return res.status(500).json({
                    message: 'Napaka pri ustvarjanju nove vožnje',
                    error: err
                });
            }
            //return res.status(201).json(user);
            return res.redirect('/');
        });
    },

    // prikaz voženj
    showVoznje: function(req, res){
        seja = req.session.userId;
        voznjaModel.find().sort({datum: -1}).exec(function (err, voznje) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting voznje.',
                    error: err
                });
            }

            //return res.json(vprasanja);
            //var uporabnik = userModel.findOne({"_id":seja});
            //var username = uporabnik.username;
            //vprasanja.sort({ datum : -1});
             res.render('voznja/vseVoznje', { seja: seja, voznje: voznje  });
        });
       
    },

    // V PRIMERU DA BOMO PRIKAZOVALI VOŽNJE VEČIH UPORABNIKOV PREKO ENEGA PROFILA UPORABNIKA
/*
        // prikaz mojih voženj (voženj enega uporabnika)
       showMojeVoznje: function(req, res){
        seja = req.session.userId
        voznjaModel.find({id_uporabnika: seja}).sort({datum_voznje: -1}).exec(function (err, voznje) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting voznje.',
                    error: err
                });
            }
           
             res.render('voznje/mojaVoznje', { seja: seja, voznje: voznje  });
        });
       
    },
*/
    // nalozi view za ustvarjanje nove voznje
    ustvariVoznjo: function(req, res){

        seja = req.session.userId
        res.render('voznja/ustvariVoznjo', { seja: seja });
    },

    
    // izbris vožnje
    izbrisi: function (req, res) {
        var id = req.body._id;
        voznjaModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Napaka bri brisanju vožnje.',
                    error: err
                });
            }
            //return res.status(204).json();
            return res.redirect('/');
        });
    }

};