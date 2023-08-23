const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friends.controller');
const { authJwt } = require("../middleware");


router.post('/searchNewFriends', [authJwt.verifyToken], friendsController.searchNewFriends);
router.post('/sendFriendRequest', [authJwt.verifyToken], friendsController.newFriendRequest);
router.post('/getFriendRequest', [authJwt.verifyToken], friendsController.getFriendRequests);
router.post('/answerFriendRequest', [authJwt.verifyToken], friendsController.answerFriendRequest);
router.post('/getFriends', [authJwt.verifyToken],friendsController.getFriends);
router.post('/delFriends', [authJwt.verifyToken],friendsController.delFriends)

module.exports = function(app) {
  app.use('/api/friends', router);
};