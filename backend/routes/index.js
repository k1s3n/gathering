const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

// Define auth routes
router.post('/login', authController.authenticateUser);

// Define user routes
router.post('/register', userController.createUser);

router.post('/createEvent', authenticateToken,userController.createEvent);

router.get('/events', userController.getEvents);

router.get('/userinfo', authenticateToken, userController.getUserInfo);

router.put('/userinfo', authenticateToken, userController.updateUserInfo);


// Define protected routes
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
