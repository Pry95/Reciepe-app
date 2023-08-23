const db = require("../models");
const Copied = db.copied;


//Gibt alle kopierten ids des Users zurück
exports.getCopiedIds = async (req, res) => {
    const { userId } = req.body; // Die userId direkt über Destructuring aus dem Anforderungskörper extrahieren.
    
    if (!userId) {
        return res.status(400).send({ message: "UserId wurde nicht bereitgestellt." });
    }

    try {
        // Findet alle Einträge in der 'Copied' Tabelle, die der gegebenen 'userId' entsprechen.
        const copiedEntries = await Copied.findAll({
            where: {
                userId
            },
            attributes: ['recipeId'] // Hier wird nur die 'recipeId'-Spalte abrufen.
        });

        // Extrahiert 'recipeId' aus jedem Eintrag.
        const copiedRecipeIds = copiedEntries.map(entry => entry.recipeId);

        res.status(200).send(copiedRecipeIds);
    } catch (err) {
        console.error('Fehler beim Abrufen der kopierten Rezepte:', err);
        res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten beim Abrufen der kopierten Rezepte.' });
    }
};

