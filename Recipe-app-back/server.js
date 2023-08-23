const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

//steuert an wie der Webbrowser auf verschiedene Domains ,Ressourcen anfragen darf
app.use(cors(corsOptions));

//hiermit kann exress.js json daten verarbeiten
app.use(express.json());

//hiermit können unteranderem Arrays und codierte Daten analysiert wenden
app.use(express.urlencoded({ extended: true }));


// database
const db = require("./app/models");
const Role = db.role;

// synchronisiert die Datenbanktabellen gemäß den definierten Sequelize-Modellen und erstellt sie, 
//falls sie noch nicht vorhanden sind.
db.sequelize.sync();

//Wird für den Upload von Bildern benötigt
app.use(express.static('resources'));
// Hier werden die routes Angelegt
require('./app/routes/auth.routes')(app);

require('./app/routes/ingredient.routes')(app);
require('./app/routes/recipe.routes')(app);
require('./app/routes/friends.routes')(app);
require('./app/routes/copied.routes')(app);
require('./app/routes/rating.routes')(app);
require('./app/routes/todo.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


//erstellt user, moderator und admin in der datenbank
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}
