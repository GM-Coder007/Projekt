var express = require('express');
var router = express.Router();
var hitrostController = require('../controllers/hitrostController.js');

// GET
router.get('/', hitrostController.list); // vse hitrosti vseh voženj

router.get('/:id', hitrostController.show); // ena hitrost

router.get('/vseHitrosti/:id', hitrostController.showHitrosti); // vse hitrosti ene vožnje


module.exports = router;