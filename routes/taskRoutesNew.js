const express = require('express');
const router = express.Router();

const  {addTasks, getTasksBySalesman, getTasksBySupervisor}  = require('../controllers/taskControllerNew');




router.post('/:companyId/:branchId/:supervisorId/task', addTasks);

router.get('/tasks/salesman/:salesmanUsername', getTasksBySalesman);

router.get('/tasks/supervisor/:supervisorUsername', getTasksBySupervisor);




module.exports = router;
