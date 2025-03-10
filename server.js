require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const companyRoutes = require('./routes/companyRoutes');
const branchRoutes = require('./routes/branchRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const salesmanRoutes = require('./routes/salesmanRoutes');
const taskRoutesNew = require('./routes/taskRoutesNew');
const attendenceRoutes = require('./routes/attendenceRoute');
const leaveRequestRoutes = require('./routes/leaveRequestRoute');
const expenceRoute = require('./routes/expenceRoute');
const ManageOrderRoute = require('./routes/manageOrderRoute');
const ReportRoutes = require('./routes/reportRoute');
const SetOverSpeedRoutes = require('./routes/overspeedRoute');

const {initializeSocket} = require("./utils/socket.io");
const setupChatbox = require("./controllers/chatBox");
const setupLocationTracking = require("./liveTracking/salesmanLiveData");
const ChatBoxUserRoutes = require('./routes/ChatBoxUserRoute');
const dbConnections = require('./config/db');
const { sendDataToAdmins } = require('./liveTracking/dataSendToDashBoard');
const trackSalesmanLive = require("./liveTracking/singleSalesManTraking");
const trackSalesmanHistory = require("./liveTracking/simulaterfile");




const http = require("http");

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

  // CORS options
const corsOptions = {

  origin: "*", 
  // methods: ["GET", "POST","PUT","DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"],
};

  // Connect to mangodb
  // connectDB();

  const server = http.createServer(app);


  //  Initialize socket.io
  initializeSocket(server);

//  chat box & get live Data of salesman function
setupChatbox();
setupLocationTracking();
sendDataToAdmins();
trackSalesmanLive();
trackSalesmanHistory();


  // Middleware
app.use(cors(corsOptions));  
app.use(bodyParser.json());

// Routes
app.use("/api", userRoutes);
app.use('/api', companyRoutes); 
app.use('/api', branchRoutes);
app.use('/api', supervisorRoutes);  
app.use('/api', salesmanRoutes);
app.use('/api', taskRoutesNew);
app.use('/api', attendenceRoutes);
app.use('/api', leaveRequestRoutes);
app.use('/api', expenceRoute);
app.use('/api', ManageOrderRoute);
app.use('/api', ChatBoxUserRoutes);
app.use('/api', ReportRoutes);
app.use('/api', SetOverSpeedRoutes);

// app.use('/api/attendance', attendanceRoutes);


// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT} with Pavan`));
