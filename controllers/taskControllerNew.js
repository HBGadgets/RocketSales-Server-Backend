const { v4: uuidv4 } = require('uuid');
const Task = require('../models/Task');
const Company = require('../models/Company');


// Assign Task to salesman

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
   

        const task = new Task({
          taskDescription,
          status: 'Pending',
          deadline,
          latitude,
          longitude,
          assignedTo,
          assignedBy: supervisor.supervisorUsername,
        });
   
       const createdTasks = await task.save();
   
       res.status(201).json({ message: 'Tasks created successfully', tasks: createdTasks });
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

exports.getTasksBySupervisor = async (req, res) => {
  const { supervisorUsername } = req.params;

  try {
    
      const tasks = await Task.find({assignedBy:supervisorUsername})


    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found for this supervisor' });
    }

    res.status(200).json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  
  const { id } = req.params; 
  const { taskDescription, deadline, assignedTo,  latitude ,longitude , complitionDate } = req.body;

  try {
    const tasks = await Task.findById(id);

    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found with the given group ID' });
    }

  
    const currentSalesmen = tasks.map((task) => task.assignedTo);

   
    const salesmenToRemove = currentSalesmen.filter((salesman) => !assignedTo.includes(salesman));
    const salesmenToAdd = assignedTo.filter((salesman) => !currentSalesmen.includes(salesman));
    const salesmenToRetain = assignedTo.filter((salesman) => currentSalesmen.includes(salesman));

    if (salesmenToRemove.length > 0) {
      await Task.deleteMany({ taskGroupId, assignedTo: { $in: salesmenToRemove } });
    }

    const newTasks = salesmenToAdd.map((salesman) => ({
      taskGroupId,
      taskDescription,
      deadline,
      status: 'Pending',
      assignedTo: salesman,
      assignedBy: tasks[0].assignedBy, 
    }));

    if (newTasks.length > 0) {
      await Task.insertMany(newTasks);
    }

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
