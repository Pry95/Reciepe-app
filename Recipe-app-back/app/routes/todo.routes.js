const express = require('express');
const router = express.Router();
const toDoController = require('../controllers/todo.controller');
const { authJwt } = require("../middleware");


router.post('/addTodo',[authJwt.verifyToken], toDoController.addToDo);
router.post('/getTodoIds',[authJwt.verifyToken], toDoController.getToDoListByUserId);
router.post('/delTodoId',[authJwt.verifyToken], toDoController.delToDoId);

// Weitere Routen für die Ingredient-Operationen (Lesen, Aktualisieren, Löschen) können hier hinzugefügt werden...

module.exports = function(app) {
  app.use('/api/todo', router);
  
};