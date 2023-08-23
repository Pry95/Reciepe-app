const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rate.controller');
const { authJwt } = require("../middleware");

router.post('/rate', [authJwt.verifyToken], ratingController.newRating);
router.post('/relodeRatings', [authJwt.verifyToken], ratingController.getRatings);

// Weitere Routen für die Ingredient-Operationen (Lesen, Aktualisieren, Löschen) können hier hinzugefügt werden...

module.exports = function(app) {
  app.use('/api/rated', router);
  
};