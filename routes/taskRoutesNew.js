const express = require('express');
const router = express.Router();

const  {addTasks, updateTask, deleteTask, updateTaskStatus, getTasks, getTasksBySalesmanId}  = require('../controllers/taskControllerNew');
const authenticate = require('../middlewares/authMiddleware');




router.post('/task',authenticate, addTasks);

router.get('/task',authenticate, getTasks);

router.get('/task/:id', getTasksBySalesmanId);


router.put('/task/:id',authenticate,updateTask);

router.delete('/task/:id',authenticate, deleteTask);



               // task status api
router.put('/task/status/:id', updateTaskStatus);  




// router.get('/tasks/supervisor/:supervisorUsername', getTasksBySupervisor);







module.exports = router;
