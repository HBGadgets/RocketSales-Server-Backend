require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const companyRoutes = require('./routes/companyRoutes');
const branchRoutes = require('./routes/branchRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const salesmanRoutes = require('./routes/salesmanRoutes');
const taskRoutes = require('./routes/taskRoutes');
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS options
const corsOptions = {
  origin: process.env.FRONTEND_URL, // This will change based on your .env
  methods: ["GET", "POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));  // Apply CORS middleware
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use('/api', companyRoutes); 
app.use('/api', branchRoutes);
app.use('/api', supervisorRoutes);  // For Supervisor CRUD
app.use('/api', salesmanRoutes);
app.use('/api', taskRoutes);

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

// Connect DB
connectDB();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
