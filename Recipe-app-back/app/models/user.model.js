// module.exports = (sequelize, Sequelize) => {
//   const User = sequelize.define("users", {
//     username: {
//       type: Sequelize.STRING
//     },
//     email: {
//       type: Sequelize.STRING
//     },
//     password: {
//       type: Sequelize.STRING
//     },
//     image: { // Das Bildfeld
//       type: Sequelize.STRING // Oder den passenden Datentyp für den Bildpfad verwenden
//     }
//   });

//   return User;
// };

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    }
  });

  User.associate = (models) => {
    // Eine Benutzer kann viele Freundesanfragen als Sender senden
    User.hasMany(models.friendRequest, { foreignKey: 'senderId', as: 'sentRequests' });

    // Ein Benutzer kann viele Freundesanfragen als Empfänger erhalten
    User.hasMany(models.friendRequest, { foreignKey: 'recipientId', as: 'receivedRequests' });

    // Eine Beziehung zu vielen "Friends"-Einträgen über userId1
    User.hasMany(models.friends, { foreignKey: 'userId1', as: 'user1Friends' });

    // Eine Beziehung zu vielen "Friends"-Einträgen über userId2
    User.hasMany(models.friends, { foreignKey: 'userId2', as: 'user2Friends' });

    User.hasMany(models.copied, { foreignKey: 'userId', as: 'copiedRecipes' });

    User.hasMany(models.rating, { foreignKey: 'userId', as: 'rater' });

    User.hasMany(models.todo, { foreignKey: 'userId', as: 'userToDo' });
    
  };

  return User;
};



