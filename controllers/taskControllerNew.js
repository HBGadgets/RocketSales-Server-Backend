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

                    //  Get task by supervisor
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

                    // Update task
exports.updateTask = async (req, res) => {
  
  const { id } = req.params; 
  const updates = req.body;

  console.log(id,updates)

  try {
    const updatedtask = await Task.findOneAndUpdate({_id:id}, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({updatedtask, message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

                    //  Delete task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Tasks not found' });
    }

    res.status(200).json({ message: 'Tasks deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

                    //  Update task status 
exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status || task.status;
    await task.save();

    res.status(200).json({ message: 'Task status updated successfully', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


