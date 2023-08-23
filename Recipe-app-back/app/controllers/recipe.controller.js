const db = require('../models');
const baseUrl = 'http://localhost:8080';
const Recipe = db.recipe;
const Ingredient = db.ingredient;
const Copied = db.copied;
const ToDo = db.todo;
const { Op } = require('sequelize');


//Rezept erstellen
exports.createRecipe = async (req, res) => {
  const { name, description, ingredients, userId, visibility, hours, minutes,numberOfPeople } = req.body;
  const parsedIngredients = JSON.parse(ingredients); // JSON-String in Array von JavaScript-Objekten umwandeln
  const imagePath = req.file ? `${baseUrl}/resources/${req.file.filename}` : `${baseUrl}/resources/logo.png`;

  try {
    // Rezept erstellen
    const recipe = await Recipe.create({
      name,
      description,
      imagePath,
      userId,
      visibility,
      hours,
      minutes,
      numberOfPeople,
      
    });

    const recipeId = recipe.id;

    // Zutaten erstellen
    for (const ingredient of parsedIngredients) {
      await Ingredient.create({
        name: ingredient.name,
        amount: ingredient.amount,
        recipeId: recipeId,
        unit: ingredient.unit
        
      });
    }
    // Abfrage des erstellten Rezepts mit den zugehörigen Zutaten (unter Verwendung des Alias)
    const createdRecipe = await Recipe.findOne({
      where: { id: recipeId },
      include: { model: Ingredient, as: 'ingredients' }, // Hier verwenden wir das Alias 'ingredients'
    });
    

    // Senden des erstellten Rezepts mit den Zutaten als Antwort
    res.send(createdRecipe);
  } catch (err) {
    console.log('Fehler beim Erstellen des Rezepts:', err);
    res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten beim Erstellen des Rezepts.' });
  }
};


//Rezept kpieren
exports.copyRecipe = async (req, res) => {
  const { name, description, ingredients, userId, imagePath, visibility, copied,hours, minutes, numberOfPeople } = req.body;

  try {
    // Erstellt den Eintrag in der 'Copied' Tabelle und wartet auf die Fertigstellung.
    const copiedEntry = await Copied.create({
      userId: userId,
      recipeId: copied
    });

    // Erstellt den Rezepteintrag mit der ID des soeben erstellten `copiedEntry`.
    const recipe = await Recipe.create({
      name,
      description,
      imagePath,
      userId,
      visibility,
      copied: copiedEntry.id,
      hours,
      minutes,
      numberOfPeople,
    });

    const recipeId = recipe.id;

    // Zutaten erstellen
    for (const ingredient of ingredients) {
      await Ingredient.create({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        recipeId: recipeId
      });
    }

    // Abfrage des erstellten Rezepts mit den zugehörigen Zutaten.
    const createdRecipe = await Recipe.findOne({
      where: { id: recipeId },
      include: { model: Ingredient, as: 'ingredients' },
    });

    // Sendet den erstellten Rezepteintrag mit den zugehörigen Zutaten als Antwort.
    res.send(createdRecipe);
  } catch (err) {
    console.log('Fehler beim Erstellen des Rezepts:', err);
    res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten beim Erstellen des Rezepts.' });
  }
}



//Rezepte erhalten
exports.getRecipesByUserId = (req, res) => {
  const { userId, logtInUserId } = req.body;

  let whereClause = {
    userId,
  };
  //Wenn die ids nicht übereinstimmen bedeutet das die rezepte eine freundes abgerufen werden
  if (userId !== logtInUserId) {
    whereClause.visibility = { [Op.or]: ['public', 'friends'] };
  }

  Recipe.findAll({
    where: whereClause,
    include: 'ingredients',
  })
    .then((recipes) => {
      console.log(recipes)
      res.send(recipes);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || 'Fehler beim Suchen der Rezepte.' });
    });
};

//Öffenliche rezepte erhalten
exports.getPublicRecipesBySearchString = (req, res) => {
  const searchString = req.body.searchString;

  Recipe.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${searchString}%` } },
        { description: { [Op.like]: `%${searchString}%` } }
      ],
      visibility: 'public',
    },
    include: 'ingredients' // Hinzufügen der Zutaten zu der Abfrage
  })
  .then((recipes) => {
    res.send(recipes);
  })
  .catch((error) => {
    console.error('Fehler bei der Datenbankabfrage:', error);
    res.status(500).json({ error: 'Fehler beim laden der öffenlichen Rezepte.' });
  });
};


//Löschen eines Rezeptes mit Zutaten
exports.deleteRecipeWithIngredients = (req, res) => {
  const { id, copied } = req.body;

  let cachedRecipeId = null; // Hier speichern wir die recipeId temporär

  const deleteCopied = () => {
    if (copied !== null) {
      return Copied.findOne({ where: { id: copied } })
        .then(copiedEntry => {
          if (copiedEntry) {
            cachedRecipeId = copiedEntry.recipeId;
            return Copied.destroy({ where: { id: copied } });
          }
          return Promise.resolve();  // Wenn kein Eintrag gefunden wird, fahren wir fort
        });
    }
    return Promise.resolve();  // Wenn copied null ist, fahren wir fort
  };

  const deleteIngredients = () => {
    return Ingredient.destroy({
      where: { recipeId: id }
    });
  };

  const deleteToDo = () => {
    return ToDo.destroy({
      where: { recipeId: id }
    });
  };

  const deleteRecipe = () => {
    return Recipe.destroy({
      where: { id }
    });
  };

  // Starten Sie den Prozess
    deleteCopied()
    .then(deleteIngredients)
    .then(deleteToDo)
    .then(deleteRecipe)
    .then((num) => {
      if (num === 1) {
        res.status(200).send({ message: 'Rezept und zugehörige Daten wurden erfolgreich gelöscht.', cachedRecipeId });
      } else {
        res.status(404).send({ message: `Rezept mit ID ${id} nicht gefunden.` });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err.message || 'Fehler beim Löschen.' });
    });
};


//Aktualisieren eines Rezepts
exports.updateRecipe = async (req, res) => {

  const { id, name, description, ingredients: ingredientData, visibility, hours, minutes, numberOfPeople } = req.body;
  // Überprüfe, ob ein Bild im Request enthalten ist
  const imagePath = req.file ? `${baseUrl}/resources/${req.file.filename}` : '';

  try {
    // Aktualisiere das Rezept
    await Recipe.update(
      {
        name,
        description,
        visibility,
        // Übernehme den aktualisierten imagePath oder den vorhandenen imagePath
        imagePath: imagePath || req.body.imagePath,
        hours,
        minutes,
        numberOfPeople,
      },
      {
        where: { id: id }
      }
    );

    // Wandele den JSON-String in ein JavaScript-Array um
    const ingredientsArray = JSON.parse(ingredientData);

    // Iteriere über die Zutaten
    for (const ingredient of ingredientsArray) {
      if (ingredient.id) {
        // Wenn die Zutat eine ID hat, aktualisiere sie
        await Ingredient.update(
          {
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
          },
          {
            where: { id: ingredient.id, recipeId: id }
          }
        );
      } else {
        // Wenn die Zutat keine ID hat, füge sie hinzu und setze die recipeId
        const newIngredient = await Ingredient.create({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          recipeId: id // Setze die recipeId für die neue Zutat
        });
        // Setze die generierte ID zurück in das ingredientsArray
        ingredient.id = newIngredient.id;
      }
    }

    // Manuelle Abfrage des aktualisierten Rezepts mit den zugehörigen Zutaten (unter Verwendung des Alias)
    const updatedRecipe = await Recipe.findOne({
      where: { id: id },
      include: { model: Ingredient, as: 'ingredients' }, // Hier verwenden wir das Alias 'ingredients'
    });

    // Senden der aktualisierten Rezeptinformationen als Antwort
    res.send(updatedRecipe);

  } catch (err) {
    console.log('Fehler beim Aktualisieren des Rezepts:', err);
    res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten beim Aktualisieren des Rezepts.' });
  }
};
















