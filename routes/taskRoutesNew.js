const express = require('express');
const router = express.Router();

const  {addTasks, getTasksBySalesman, getTasksBySupervisor, updateTask, deleteTask, updateTaskStatus}  = require('../controllers/taskControllerNew');




router.post('/:companyId/:branchId/:supervisorId/task', addTasks);

router.get('/tasks/salesman/:salesmanUsername', getTasksBySalesman);

router.get('/tasks/supervisor/:supervisorUsername', getTasksBySupervisor);



router.put('/task/group/:id',updateTask);

          // task status api
router.put('/task/status/:id', updateTaskStatus);  



router.delete('/task/group/:id', deleteTask);




module.exports = router;
