var express = require('express');
var router = express.Router();
var voznjaController = require('../controllers/voznjaController.js');

// GET
router.get('/', voznjaController.list);
router.get('/voznja', voznjaController.show);
router.get('/vseVoznje', voznjaController.showVoznje);
//router.get('/mojeVoznje', voznjaController.showMojeVoznje);
router.get('/ustvariVoznjo', voznjaController.ustvariVoznjo);

// POST
router.post('/', voznjaController.create);


// DELETE
router.post('/izbrisi', voznjaController.izbrisi);

module.exports = router;