const express = require('express');
const router = express.Router();

const ctrlMod = require('../controllers/salesController');
const ctrl = ctrlMod.default || ctrlMod;

router.post('/', ctrl.createSale);
router.get('/summary', ctrl.summary);
router.get('/by-day', ctrl.byDay);
router.get('/top-categories', ctrl.topCategories);

module.exports = router;
