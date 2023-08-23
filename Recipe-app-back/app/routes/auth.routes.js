const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const multer = require("multer");
const { authJwt } = require("../middleware");


//Wird für den bildUpload benötigt
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'resources'); // Aktualisieren Sie den Pfad entsprechend Ihrer Ordnerstruktur
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);//Gibt den Namen des Files an
  }
});

//definiert eine Instanz von multer
const upload = multer({ storage: storage });

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Registrierung mit Bild-Upload
  app.post(
    "/api/auth/signup",
    upload.single("image"), // "image" ist der Name des Datei-Feldes im Formular
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};
