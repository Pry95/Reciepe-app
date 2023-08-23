
const db = require("../models");
const Rating = db.rating;
const Recipe = db.recipe;
const User = db.user
const { Op } = require('sequelize');


//Neue Bewertung erstellen
exports.newRating = async (req, res) => {
    const { userId, recipeId, rating } = req.body;

    try {
        // Erstelle ein neues Rating
        const newRate = await Rating.create({
            userId,
            recipeId,
            rating
        });

        //Berechnen Sie die durchschnittliche Bewertung für die angegebene Rezept-ID
        const averageRating = await Rating.findOne({
            attributes: [
                [db.sequelize.fn('avg', db.sequelize.col('rating')), 'averageRating']
            ],
            where: { recipeId }
        });

        // Aktualliesiert die wertung bei dem entspechenden Rezept
        const updatedRecipe = await Recipe.update(
            {
                evaluation: averageRating.dataValues.averageRating
            },
            {
                where: { id: recipeId }
            }
        );

        res.send({
            message: 'Bewertung erfolgreich hinzugefügt',
            averageRating: averageRating.dataValues.averageRating,
            
        });
    } catch (err) {
        
        res.status(500).send({ message: err.message || 'Fehler beim bewerten' });
    }
};

//Gibt eine liste aller bewerteten RezeptIds zurück
exports.getRatings = async (req, res) => {
    const userId = req.body.userId; 
  
    try {
      // Finden Sie den Benutzer und seine bewerteten Rezepte
      const user = await User.findOne({
        where: { id: userId },
        include: {
          model: Rating,
          as: 'rater',
          attributes: ['recipeId']
        }
      });
  
      if (!user) {
        return res.status(404).send({ message: "User nicht gefunden." });
      }
  
      const ratedRecipeIds = user.rater.map(rated => rated.recipeId);
  
      res.status(200).send({ ratedRecipeIds });
    } catch (err) {
     
      res.status(500).send({ message: "Fehler beim suchen der Bewertungen." });
    }
  };
  