module.exports = (sequelize, Sequelize) => {
    const Ingredient = sequelize.define("ingredients", {
      name: {
        type: Sequelize.STRING,
        
      },
      amount: {
        type: Sequelize.INTEGER
      },
      recipeId: {
        type: Sequelize.INTEGER
      },
      unit: {
        type: Sequelize.STRING
      }
    });
    Ingredient.associate = (models) => {
      Ingredient.belongsTo(models.recipe, {
        foreignKey: 'recipeId'
      });
    };
  
    return Ingredient;
  };