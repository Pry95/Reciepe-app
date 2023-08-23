const db = require('../models');

const Recipe = db.recipe;
const Ingredient = db.ingredient;

exports.create = (req, res) => {
  const { name, amount, unit,recipeId } = req.body;
  Ingredient.create({
    
    name,
    amount,
    recipeId,
    unit
  })
    .then((ingredient) => {
      res.send(ingredient);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || 'Some error occurred while creating the Ingredient.' });
    });
};
// Controller-Methode zum Erstellen eines Rezepts mit Zutaten
exports.createRecipe = (req, res) => {
  const { name, description, imagePath, ingredients, userId } = req.body;

  // Erstelle das Rezept in der Tabelle "recipes"
  Recipe.create({
    name,
    description,
    imagePath,
    userId
  })
    .then((recipe) => {
      // Erhalte die neu generierte recipeId
      const recipeId = recipe.recipeId;

      // Erstelle die Zutaten für das Rezept
      createIngredients(recipeId, ingredients);

      res.send(recipe);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || 'Some error occurred while creating the Recipe.' });
    });
};

// Hilfsfunktion zum Erstellen der Zutaten für das Rezept
const createIngredients = (recipeId, ingredients) => {
  // Iteriere über die Zutaten
  ingredients.forEach((ingredient) => {
    // Erstelle jede Zutat in der Tabelle "ingredients" mit der recipeId
    Ingredient.create({
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      recipeId: recipeId
    })
      .catch((err) => {
        console.log('Error creating ingredient:', err);
      });
  });
};

exports.deleteIngredientsByIds = (req, res) => {
  const { ids } = req.body;
  //Hier werden alle Zutatn gelösch die die Ids aus der Liste haben
  Ingredient.destroy({
    where: { id: ids }
  })
    .then((numDeleted) => {
      res.send({ message: `${numDeleted} Zutaten erfolgreich gelöscht` });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || 'Fehler beim löschen der Zutaten' });
    });
};