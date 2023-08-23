const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredient.controller');
const { authJwt } = require("../middleware");

// POST Route zum Erstellen einer neuen Zutat
router.post('/', [authJwt.verifyToken], ingredientController.create);
router.post('/delIngredients',[authJwt.verifyToken], ingredientController.deleteIngredientsByIds);
// Weitere Routen für die Ingredient-Operationen (Lesen, Aktualisieren, Löschen) können hier hinzugefügt werden...

module.exports = function(app) {
  app.use('/api/ingredients', router);
};