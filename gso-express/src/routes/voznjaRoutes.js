var express = require('express');
var router = express.Router();
var voznjaController = require('../controllers/voznjaController.js');

// GET
router.get('/', voznjaController.list); // vse vožnje vseh uporabnikov
// router.get('/voznja', voznjaController.show); // ena vožnja
router.get('/:id', voznjaController.show); // ena vožnja
router.get('/vseVoznje', voznjaController.showVoznje); // vse vožnje prijavljenega uporabnika
//router.get('/mojeVoznje', voznjaController.showMojeVoznje);
router.get('/ustvariVoznjo', voznjaController.ustvariVoznjo); // nalaganje pogleda za ustvarjanje vožnje 

// POST
router.post('/', voznjaController.create); // ustvarjanje vožnje


// DELETE
router.post('/izbrisi/:id', voznjaController.izbrisi); // izbris vožnje

module.exports = router;
