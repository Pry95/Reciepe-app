module.exports = (sequelize, Sequelize) => {
    const Rating = sequelize.define("rating", {
        userId: {
            type: Sequelize.INTEGER,
            
            },
        
        recipeId: {
            type: Sequelize.INTEGER,
        },
        rating: {
            type: Sequelize.INTEGER
        }
    });

    Rating.associate = (models) => {
        // Ein kopiertes Rezept gehört zu einem Benutzer.
        Rating.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
      };

    return Rating;
}