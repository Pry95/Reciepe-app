const db = require('../models');
const ToDo = db.todo;
const baseUrl = 'http://localhost:8080';


//Hier werden die RezeptIds aus der ToDo Tabelle zurückgegeben
exports.getToDoListByUserId = async (req, res) => {
    const userId = req.body.userId; 
    
    try {
        const userToDos = await ToDo.findAll({
            where: { userId },
            attributes: ['recipeId'], //Hier wird nur die rezeptId zurückgegeben
        });

        const recipeIds = userToDos.map(todo => todo.recipeId);
        res.status(200).json(recipeIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Zur toDo liste hinzufügen
exports.addToDo = async (req, res) => {
    const { userId, recipeId } = req.body;

    try {
        const newToDo = await ToDo.create({ userId, recipeId });
        res.status(201).json(newToDo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
//Aus der toDo Liste löschen
exports.delToDoId = async (req, res) => {
    const { userId, recipeId } = req.body;
    try {
        const deletedToDo = await ToDo.destroy({
            where: {
                userId: userId,
                recipeId: recipeId
            }
        });

        if (deletedToDo === 0) {
            return res.status(404).json({ message: 'To-Do nicht gefunden' });
        }

        res.status(200).json({ message: 'To-Do erfolgreich gelöscht' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverfehler' });
    }
};
