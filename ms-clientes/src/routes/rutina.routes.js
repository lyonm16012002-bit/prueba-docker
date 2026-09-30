const express = require('express');
const crudRoutes = require('./crud.routes');
const controller = require('../controllers/rutina.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);
router.use(crudRoutes(controller));

module.exports = router;
