const express = require('express');
const {addSupervisor, getSupervisors, updateSupervisor, deleteSupervisor} = require('../controllers/supervisorController');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');


// Supervisor CRUD
router.post('/supervisor',authenticate, addSupervisor);

router.get('/supervisor',authenticate, getSupervisors);
router.put('/supervisor/:id',authenticate, updateSupervisor);
router.delete('/supervisor/:id',authenticate, deleteSupervisor);

module.exports = router;
