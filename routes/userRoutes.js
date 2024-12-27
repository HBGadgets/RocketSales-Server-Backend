const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();
//register route
router.post('/register', userController.registerUser);
// Login route
router.post('/login', userController.loginUser);
// Profile route - Apply authentication middleware
router.get('/profile', authenticate, userController.getUserProfile);

module.exports = router;
