module.exports = (sequelize, Sequelize) => {
  const FriendRequest = sequelize.define("friendRequest", {
    senderId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    recipientId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });

  FriendRequest.associate = (models) => {
    // Verbindung von senderId zu User
    FriendRequest.belongsTo(models.user, { foreignKey: 'senderId', as: 'sender' });
  
    // Verbindung von recipientId zu User
    FriendRequest.belongsTo(models.user, { foreignKey: 'recipientId', as: 'recipient' });
  };

  return FriendRequest;
};

