const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const {addSupervisor, getSupervisors, updateSupervisor, deleteSupervisor} = require('../controllers/supervisorController');


// ---------------CRUD Api of architecture--------------------
router.post('/supervisor',authenticate, addSupervisor);
router.get('/supervisor',authenticate, getSupervisors);
router.put('/supervisor/:id',authenticate, updateSupervisor);
router.delete('/supervisor/:id',authenticate, deleteSupervisor);

module.exports = router;
