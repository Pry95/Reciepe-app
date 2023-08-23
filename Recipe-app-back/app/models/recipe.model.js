module.exports = (sequelize, Sequelize) => {

    const Recipe = sequelize.define("recipes", {
      name: {
        type: Sequelize.STRING,
        
      },
      description: {
        type: Sequelize.TEXT,
        
      },
      imagePath: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER, 
        
      },
      visibility: {
        type: Sequelize.STRING,  
      },
      copied: {
        type: Sequelize.STRING,  
      },
      evaluation:{
        type: Sequelize.DOUBLE
      },
      hours: {
        type: Sequelize.INTEGER, 
        
      },
      minutes: {
        type: Sequelize.INTEGER, 
        
      },
      numberOfPeople: {
        type: Sequelize.INTEGER, 
        
      },
    });
    Recipe.associate = (models) => {
      Recipe.hasMany(models.ingredient, {
        foreignKey: 'recipeId'
      });
    };
  
    return Recipe;
  };