module.exports = (sequelize, Sequelize) => {
    const Copied = sequelize.define("copied", {
        userId: {
            type: Sequelize.INTEGER,
            },
        recipeId: {
            type: Sequelize.INTEGER,
        }
    });
    Copied.associate = (models) => {
        // Ein kopiertes Rezept gehört zu einem Benutzer.
        Copied.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
      };

    return Copied;
}
