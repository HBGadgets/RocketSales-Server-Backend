const { v4: uuidv4 } = require('uuid');
const Task = require('../models/Task');
const Company = require('../models/Company');


                // Assign Task to salesman

exports.addTasks = async (req, res) => {

     const { taskDescription, deadline, assignedTo, latitude ,longitude,companyId, branchId, supervisorId } = req.body; 
   
     try {
       const company = await Company.findById(companyId);
       if (!company) {
         return res.status(404).json({ message: 'Company not found' });
       }
   

        const task = new Task({
          taskDescription,
          status: 'Pending',
          deadline, 
          assignedTo, 
          latitude ,
          longitude,
          companyId,
          branchId,
          supervisorId
        });
   
       const createdTasks = await task.save();
   
       res.status(201).json({ message: 'Tasks created successfully', tasks: createdTasks });
     } catch (err) {
       res.status(500).json({ message: err.message });
     }
   };
   

                    //Get Tasks role wise superadmin/company/branch/supervisor/salesman

   exports.getTasks = async (req, res) => {

          const {role} = req.user;
          const {id} = req.user;
          let tasks;
     
       try {
         
             if(role=='superadmin'){
                    tasks = await Task.find()
                    .populate("companyId","companyName")
                    .populate("branchId","branchName")
                    .populate("supervisorId","supervisorName")
                    .populate("assignedTo","salesmanName");

                   }else if(role =='company'){
                    tasks = await Task.find({companyId:id})
                    .populate("branchId","branchName")
                    .populate("supervisorId","supervisorName")
                    .populate("assignedTo","salesmanName");


                   }else if(role =='branch'){
                    tasks = await Task.find({branchId:id})
                    .populate("supervisorId","supervisorName")
                    .populate("assignedTo","salesmanName");
                    ;
            
                   }else if(role =='supervisor'){
                    tasks = await Task.find({supervisorId:id})
                    .populate("companyId","companyName")
                    .populate("branchId","branchName")                    
                    .populate("assignedTo","salesmanName");

            
                   }else if(role =='salesman'){
                    tasks = await Task.find({assignedTo:id})
                    .populate("companyId","companyName")
                    .populate("branchId","branchName")
                    .populate("supervisorId","supervisorName");
            
                   }
     
         res.status(200).json(tasks);
       } catch (err) {
         res.status(500).json({ message: err.message });
       }
   };



                    // Update task role wise superadmin/company/branch/supervisor/salesman
exports.updateTask = async (req, res) => {
  
  const { id } = req.params; 
  const updates = req.body;

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

exports.getTasksBySalesmanId = async (req, res) => {
  const { id } = req.params; // ID passed in the route parameters

  try {
    // Find tasks where the assignedTo field includes the given id
    const tasks = await Task.find({ assignedTo: id })
      .populate("companyId", "companyName")
      .populate("branchId", "branchName")
      .populate("supervisorId", "supervisorName");

    // Check if tasks exist
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for the provided ID." });
    }

    // Return tasks
    res.status(200).json(tasks);
  } catch (err) {
    // Handle any errors
    res.status(500).json({ message: err.message });
  }
};


