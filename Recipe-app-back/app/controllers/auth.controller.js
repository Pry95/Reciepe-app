const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Copied = db.copied;
const Rating = db.rating;
const ToDo = db.todo;
const baseUrl = 'http://localhost:8080';

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  
  //Hier wird der String für den imagePaht generiert
  const imagePath = req.file ? `${baseUrl}/resources/${req.file.filename}` : `${baseUrl}/resources/logo.png`;
  //Hier wird ein Neuer User erstellt
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    image: imagePath // Speichere den Bildpfad in der Datenbank
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            sendResponseWithToken(user, roles, res);
          });
        });
      } else {
        //Hier wird die Rolle user zugewiesen
        user.setRoles([1]).then(() => {
          sendResponseWithToken(user, [{ name: 'user' }], res);
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//Hier wird der Usertoken generiert
function sendResponseWithToken(user, roles, res) {
  // Issue a JWT token
  const token = jwt.sign(
    { id: user.id },
    config.secret,
    {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400
    }
  );

  // Gibt die rolle mit
  const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

  // Gibt alle wichtigen Innormationen zurück
  res.status(200).send({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: authorities,
    accessToken: token,
    image: user.image,
    message: "Registrierung erfolgreich!"
  });
}

//Einlogen
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    },
    include: [
      {
        model: Copied,
        as: 'copiedRecipes',
        attributes: ['recipeId']
      },
      {
        model: Rating,
        as: 'rater',
        attributes: ['recipeId']
      },
      {
        model: db.todo,   // Hinzufügen der ToDo-Beziehung
        as: 'userToDo',   // Der Alias muss hier mit dem Alias in deinem Modell übereinstimmen
        attributes: ['recipeId']
      }
    ]
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User nicht gefunden." });
      }
      //Hier wird das mitgesendet Passwort mit dem aus der Datenbak verglichen
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Falsches Passwort!"
        });
      }
      //Hier wird der Token generiert
      const token = jwt.sign(
        { id: user.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: 86400
        }
      );
      //Hier werden die Rollen Vergeben
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        // Extrahiere die recipeIds in ein einfaches Array
        const copiedRecipeIds = user.copiedRecipes.map(cp => cp.recipeId);

        // Zugriff auf die bewerteten Rezepte hier innerhalb der gleichen Funktion
        const ratedRecipeIds = user.rater.map(rated => rated.recipeId);
        //Die ToDoIds werden auch mitgegeben
        const toDoRecipeIds = user.userToDo.map(toDo => toDo.recipeId);

        //Der user mit allen Daten wird ans Frontend gesendet
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          image: user.image,
          copiedRecipes: copiedRecipeIds,
          ratedRecipes: ratedRecipeIds,
          toDoRecipeIds: toDoRecipeIds,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


