module.exports = (sequelize, Sequelize) => {
    const ToDo = sequelize.define("toDo", {
        userId: {
            type: Sequelize.INTEGER,
            
            },
        
        recipeId: {
            type: Sequelize.INTEGER,
        }
    });

    ToDo.associate = (models) => {
        // Ein kopiertes Rezept gehört zu einem Benutzer.
        ToDo.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
      };

    return ToDo;
}