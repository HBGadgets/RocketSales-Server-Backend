const { v4: uuidv4 } = require('uuid'); // For generating unique taskGroupId
const Task = require('../models/Task');
const Company = require('../models/Company');

// Add tasks to all or selected salesmen
exports.addTasks = async (req, res) => {

  const { companyId, branchId, supervisorId } = req.params;
  const { taskDescription, deadline, assignedTo, latitude ,longitude } = req.body; 

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const branch = company.branches.id(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const supervisor = branch.supervisors.id(supervisorId);
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    let salesmenToAssign = [];

    if (Array.isArray(assignedTo) && assignedTo.length > 0) {
      salesmenToAssign = supervisor.salesmen.filter(salesman =>
        assignedTo.includes(salesman.salesmanUsername)
      );
    } else {
      salesmenToAssign = supervisor.salesmen;
    }

    if (salesmenToAssign.length === 0) {
      return res.status(400).json({ message: 'No valid salesmen found for assignment' });
    }
    const taskGroupId = uuidv4(); // Generate a unique group ID
    const tasks = salesmenToAssign.map(salesman => ({
      taskGroupId,
      taskDescription,
      status: 'Pending',
      deadline,
      latitude,
      longitude,
      assignedTo: salesman.salesmanUsername,
      assignedBy: supervisor.supervisorUsername,
    }));

    const createdTasks = await Task.insertMany(tasks);

    res.status(201).json({ message: 'Tasks created successfully',taskGroupId, tasks: createdTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Get Tasks by Salesman
exports.getTasksBySalesman = async (req, res) => {
    const { salesmanUsername } = req.params;
  
    try {
      const tasks = await Task.find({ assignedTo: salesmanUsername });
      if (!tasks.length) {
        return res.status(404).json({ message: 'No tasks found for this salesman' });
      }
  
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
//getTasksBySupervisor
// exports.getTasksBySupervisor = async (req, res) => {
//   const { supervisorUsername } = req.params;

//   try {
//     const tasks = await Task.aggregate([
//       { $match: { assignedBy: supervisorUsername } },
//       {
//         $group: {
//           _id: '$taskGroupId',
//           taskGroupId: { $first: '$taskGroupId' },
//           taskDescription: { $first: '$taskDescription' },
//           deadline: { $first: '$deadline' },
//           assignedTo: {  
//             $push: { 
//               salesman: '$assignedTo', 
//               status: '$status' 
//             }
//           },
//         },
//       },
//     ]);

//     if (!tasks.length) {
//       return res.status(404).json({ message: 'No tasks found for this supervisor' });
//     }

//     res.status(200).json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getTasksBySupervisor = async (req, res) => {
  const { supervisorUsername } = req.params;

  try {
    // Aggregation pipeline
    const tasks = await Task.aggregate([
      { 
        $match: { assignedBy: supervisorUsername } // Match tasks assigned by the supervisor
      },
      
      // Sort tasks by 'createdAt' field before grouping
      { 
        $sort: { createdAt: 1 } // Sort by createdAt (ascending order)
      },

      // Group by taskGroupId
      {
        $group: {
          _id: '$taskGroupId', // Group tasks by taskGroupId
          taskGroupId: { $first: '$taskGroupId' },
          taskDescription: { $first: '$taskDescription' },
          deadline: { $first: '$deadline' },
          assignedTo: {
            $push: {
              salesman: '$assignedTo',
              status: '$status',
              createdAt: '$createdAt', // Include createdAt in the group to maintain order in assignedTo
            },
          },
        },
      },

      // Optionally, ensure the tasks inside each group are also sorted by createdAt
      {
        $project: {
          taskGroupId: 1,
          taskDescription: 1,
          deadline: 1,
          assignedTo: {
            $sortArray: {
              input: '$assignedTo',
              sortBy: { createdAt: 1 }, // Sort assigned users by createdAt
            },
          },
        },
      },

      // Sort the grouped tasks by createdAt at the task level (optional)
      { 
        $sort: { 'taskDescription': 1 } // You can replace this with sorting based on another field if required
      }
    ]);

    // Check if tasks exist
    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found for this supervisor' });
    }

    // Send the grouped and sorted tasks as response
    res.status(200).json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Update Task Status

exports.updateTask = async (req, res) => {
  
  const { taskGroupId } = req.params; 
  const { taskDescription, deadline, assignedTo,  latitude ,longitude , complitionDate } = req.body;

  try {
    const tasks = await Task.find({ taskGroupId });

    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found with the given group ID' });
    }

    // Extract existing salesmen from the current tasks
    const currentSalesmen = tasks.map((task) => task.assignedTo);

    // Identify salesmen to be removed, added, and retained
    const salesmenToRemove = currentSalesmen.filter((salesman) => !assignedTo.includes(salesman));
    const salesmenToAdd = assignedTo.filter((salesman) => !currentSalesmen.includes(salesman));
    const salesmenToRetain = assignedTo.filter((salesman) => currentSalesmen.includes(salesman));

    // Delete tasks for removed salesmen
    if (salesmenToRemove.length > 0) {
      await Task.deleteMany({ taskGroupId, assignedTo: { $in: salesmenToRemove } });
    }

    // Add tasks for newly added salesmen
    const newTasks = salesmenToAdd.map((salesman) => ({
      taskGroupId,
      taskDescription,
      deadline,
      status: 'Pending',
      assignedTo: salesman,
      assignedBy: tasks[0].assignedBy, // All tasks in the group have the same assignedBy
    }));

    if (newTasks.length > 0) {
      await Task.insertMany(newTasks);
    }

    // Update tasks for retained salesmen
    await Task.updateMany(
      { taskGroupId, assignedTo: { $in: salesmenToRetain } },
      {
        $set: {
          taskDescription: taskDescription || tasks[0].taskDescription,
          deadline: deadline || tasks[0].deadline,
        },
      }
    );

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//deleteTask
exports.deleteTask = async (req, res) => {
  const { taskGroupId } = req.params;

  try {
    const tasks = await Task.find({ taskGroupId });
    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found with the given group ID' });
    }

    await Task.deleteMany({ taskGroupId });

    res.status(200).json({ message: 'Tasks deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//update task status by salesman
exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body; // Example: "Completed"

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task status
    task.status = status || task.status;
    await task.save();

    res.status(200).json({ message: 'Task status updated successfully', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//update task status by supervisior
exports.updateTaskStatusByGroup = async (req, res) => {
  const { taskGroupId, salesmanUsername } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    // Find the task by group and salesman
    const task = await Task.findOne({ taskGroupId, assignedTo: salesmanUsername });
    if (!task) {
      return res.status(404).json({ message: "Task not found for this salesman in the group" });
    }

    // Update the status
    task.status = status;
    await task.save();

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//update all task status by supervisior
exports.updateAllTaskStatusByGroup = async (req, res) => {
  const { taskGroupId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    // Update all tasks with the same group ID
    const result = await Task.updateMany(
      { taskGroupId },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No tasks found for this group" });
    }

    res.status(200).json({ message: "All task statuses updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




    
  
  