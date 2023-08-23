const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

//Wird benötigt um die verbindung zur datenbank herzustellen
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
//Hier werden die werden die Models Hinzugefügt
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.friendRequest = require("../models/friendRequest.model.js")(sequelize, Sequelize);

db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.ingredient = require("../models/ingredient.model.js")(sequelize, Sequelize);
db.recipe = require("../models/recipe.model.js")(sequelize, Sequelize);
db.friends = require("../models/friends.model.js")(sequelize, Sequelize);
db.copied = require("../models/copied.model.js")(sequelize, Sequelize);
db.rating = require("../models/rating.model.js")(sequelize, Sequelize);
db.todo = require("../models/todo.model.js")(sequelize, Sequelize);

//Wird für die verknüpfung von db.models benötigt
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});






db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
