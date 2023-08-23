//Wird benötigt und die verschiedene Models zu Importieren
const db = require("../models");
const Sequelize = require('sequelize');


const path = require('path');
const baseUrl = 'http://localhost:8080';
const Op = db.Sequelize.Op;

const User = db.user;
const FriendRequest = db.friendRequest
const Friends = db.friends

//Hier wird nach neuen Freunden gesucht
exports.searchNewFriends = async (req, res) => {
  try {
    const searchString = req.body.search;
    const senderId = req.body.userId;

    //Hier werden alle aktuellen freunde gesucht
    const existingFriends = await Friends.findAll({
      where: {
        [Op.or]: [
          { userId1: senderId },
          { userId2: senderId },
        ],
      },
    });

    //Hier werden alle mir dem user verbundene Freunschaftanfragen gesucht
    const pendingRequests = await FriendRequest.findAll({
      where: {
        [Op.or]: [
          { senderId: senderId },
          { recipientId: senderId },
        ],
      },
    });

    // Erstelle  eine Liste von IDs, die von der Suche ausgeschlossen werden sollen
    const excludeIds = [
      ...existingFriends.map(friend => (friend.userId1 === senderId ? friend.userId2 : friend.userId1)), // Freunde ids
      ...pendingRequests.map(request => (request.senderId === senderId ? request.recipientId : request.senderId)), //Freundschaftanfragen ids
    ];
    excludeIds.push(senderId); //Die absenderId wird hier auch hinzugefügt

    // Jetzt werden die User gesucht die den Suchstring enthalten und nicht in der ausschlussliste vorkommen
    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${searchString}%`,
        },
        id: {
          [Op.notIn]: excludeIds, // Exclude the IDs in the excludeIds list
        },
      },
      attributes: ['id', 'username', 'image'],
    });

    // Die Möglichen Freunde werden zurückgegeben
    const userData = users.map(user => user.dataValues);
    res.status(200).json(userData);
  } catch (err) {
    console.log('Fehler beim Suchen nach Benutzern:', err);
    res.status(500).json({ message: 'Ein Fehler ist aufgetreten beim Suchen nach Benutzern.' });
  }
};


//Freundschaftanfragen versenden
exports.newFriendRequest = async (req, res) => {
  const recipientId = req.body.recipientId;
  const senderId = req.body.senderId;

  try {
    // Prüfen ob bereits einen freundschaft vorliegt
    const existingRequest = await FriendRequest.findOne({
      where: {
        senderId: senderId,
        recipientId: recipientId,
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Eine Freundschaftsanfrage mit diesem Benutzer ist noch umbeantworted.' });
    }

    // Hier wird jetzt eine Freundschaftanfrage erstellt
    const newFriendRequest = await FriendRequest.create({
      senderId: senderId,
      recipientId: recipientId,
      
    });

    return res.status(201).json({ message: 'Freundschaftsanfrage wurde erfolgreich versendet.' });
  } catch (error) {
    
    return res.status(500).json({ message: 'Fehler beim erstellen der freundschaftanfrage.' });
  }
};


//Freundschaftsanfragen zurückgeben
exports.getFriendRequests = async (req, res) => {
  const userId = req.body.userId;

  try {
    // Alle Freundschaftanfragen finden wo die Empfänerid die Userid ist
    const friendRequests = await FriendRequest.findAll({
      where: {
        recipientId: userId,
      },
      include: [{ 
        model: User,
        as: 'sender', 
        attributes: ['username', 'image'], 
      }]
    });
    //Hier sind jetzt alle freundschaftanfragen enthalten
    const friendRequestsArray = friendRequests.map(request => ({
      id: request.id,
      senderId: request.senderId,
      senderName: request.sender.username,
      senderImagePath: request.sender.image,
    }));

    return res.status(200).json(friendRequestsArray);
  } catch (error) {
    
    return res.status(500).json({ message: 'Fehler bei dem auslesen der Freundschaftanfragen' });
  }
};

//Freundschaftsanfragen Beantworten
exports.answerFriendRequest = async (req, res) => {
  const { requestId, senderId, recipientId, answer } = req.body;

  try {
    if (answer === true) {
      // Füge die Beziehung in die Friends-Tabelle ein
      await Friends.create({ userId1: senderId, userId2: recipientId });
      // Lösche den FriendRequest-Eintrag aus der Datenbank
      await FriendRequest.destroy({ where: { id: requestId } });
      return res.status(200).json({ message: "Freundschaft erfolgreich erstellt!" });
    } else {
      // Lösche den FriendRequest-Eintrag aus der Datenbank
      await FriendRequest.destroy({ where: { id: requestId } });
      return res.status(200).json({ message: "Freundschaftsanfrage abgelehnt." });
    }
  } catch (error) {
    console.error("Fehler beim Bearbeiten der Freundschaftsanfrage:", error);
    return res.status(500).json({ message: "Fehler beim Bearbeiten der Freundschaftsanfrage." });
  }
};


//Gibt alle freunde zurück
exports.getFriends = async (req, res) => {
  const userId = req.body.userId;
  try {
      // Finden Sie alle Datensätze, bei denen der Benutzer als userId1 erscheint
      const friendsAsUser1 = await db.friends.findAll({
          where: { userId1: userId },
          include: [{
              model: db.user,
              as: 'user2',
              attributes: ['id', 'username', 'email', 'image']  // Sie können andere Attribute hinzufügen oder entfernen
          }]
      });

      // Finden Sie alle Datensätze, bei denen der Benutzer als userId2 erscheint
      const friendsAsUser2 = await db.friends.findAll({
          where: { userId2: userId },
          include: [{
              model: db.user,
              as: 'user1',
              attributes: ['id', 'username', 'email', 'image']
          }]
      });

      // Kombinieren und formatieren der Daten
      const allFriends = [
          ...friendsAsUser1.map(record => record.user2),
          ...friendsAsUser2.map(record => record.user1)
      ];

      res.status(200).send(allFriends);

  } catch (error) {
      console.error("Fehler beim Abrufen der Freunde:", error);
      res.status(500).send({ message: "Fehler beim Abrufen der Freunde." });
  }
};

//Freundschaft löschen
exports.delFriends = async (req, res) => {
  const { userId, friendId } = req.body;
 
  try {
    const result = await Friends.destroy({
      where: {
        [Sequelize.Op.or]: [
          { userId1: userId, userId2: friendId },
          { userId1: friendId, userId2: userId }
        ]
      }
    });

    if (result) {
      res.status(200).send({ message: 'Freundschaft gelöscht.' });
    } else {
      res.status(404).send({ message: 'Freundschaftseintrag nicht gefunden.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Fehler beim löschen der Freundschaft.' });
  }
};
