const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const multer = require('multer');
const { authJwt } = require("../middleware");

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'resources'); // Aktualisieren Sie den Pfad entsprechend Ihrer Ordnerstruktur
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });


const upload = multer({ storage: storage });

// POST Route zum Erstellen eines neuen Rezepts mit Zutaten
router.post('/createRecipes', upload.single('image'), [authJwt.verifyToken], recipeController.createRecipe);

router.post('/updateRecipes', upload.single('image'), [authJwt.verifyToken],recipeController.updateRecipe)
router.post('/delRecipes', [authJwt.verifyToken],recipeController.deleteRecipeWithIngredients);
router.post('/loadRecipes',recipeController.getRecipesByUserId);
router.post('/searchPublicRecipes', recipeController.getPublicRecipesBySearchString);
router.post('/copyRecipe',[authJwt.verifyToken], recipeController.copyRecipe)


module.exports = function(app) {
  app.use('/api/recipes', router);
  app.use('/resources', express.static('resources'));
};