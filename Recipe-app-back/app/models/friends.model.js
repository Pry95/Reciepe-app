module.exports = (sequelize, Sequelize) => {
  const Friends = sequelize.define("friends", {
    userId1: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    userId2: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });

  Friends.associate = (models) => {
    Friends.belongsTo(models.user, { foreignKey: 'userId1', as: 'user1' });
    Friends.belongsTo(models.user, { foreignKey: 'userId2', as: 'user2' });
  };

  return Friends;
};
