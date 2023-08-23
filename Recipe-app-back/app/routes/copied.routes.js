const express = require('express');
const router = express.Router();
const copiedController = require('../controllers/copied.controller');
const { authJwt } = require("../middleware");

router.post('/getCopiedIds', [authJwt.verifyToken],copiedController.getCopiedIds);

// Weitere Routen für die Ingredient-Operationen (Lesen, Aktualisieren, Löschen) können hier hinzugefügt werden...

module.exports = function(app) {
  app.use('/api/copied', router);
};