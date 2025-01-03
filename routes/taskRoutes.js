const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');  // Make sure this path is correct!

// Route to add tasks
router.post('/:companyId/:branchId/:supervisorId/task', taskController.addTasks);

// Route to get tasks by salesman
router.get('/tasks/salesman/:salesmanUsername', taskController.getTasksBySalesman);

// Route to get tasks by supervisor
router.get('/tasks/supervisor/:supervisorUsername', taskController.getTasksBySupervisor);

// Route to update tasks by taskGroupId
router.put('/task/group/:taskGroupId', taskController.updateTask);

// Route to update task status by salesman
router.put('/task/:taskId/status', taskController.updateTaskStatus);  

// Route to update task status by supervisior
router.put('/tasks/group/:taskGroupId/salesman/:salesmanUsername/status',taskController.updateTaskStatusByGroup)

// Route to update task status by supervisior
router.put('/tasks/group/:taskGroupId/status',taskController.updateAllTaskStatusByGroup)

// Route to delete tasks by taskGroupId
router.delete('/task/group/:taskGroupId', taskController.deleteTask);

module.exports = router;
