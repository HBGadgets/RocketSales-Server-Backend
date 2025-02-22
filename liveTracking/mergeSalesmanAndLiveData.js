const Salesman = require("../models/Salesman");
const LiveData = require("../models/LiveData");

const getLiveSalesmanData = async () => {
     try {
       const [salesmen, liveData] = await Promise.all([
         Salesman.find()
         .populate("companyId", "companyName")
         .populate("branchId", "branchName")
         .populate("supervisorId", "supervisorName").lean(),
         LiveData.find().sort({ timestamp: -1 }).lean()
       ]);
   
       const latestLiveData = {};
       for (const data of liveData) {
         if (!latestLiveData[data.username]) {
           latestLiveData[data.username] = data;
         }
       }
   
       const mergedData = salesmen.map(salesman => {
         if (latestLiveData[salesman.username]) {
           return { ...salesman, ...latestLiveData[salesman.username] };
         }
         return salesman;
       });
   
       return mergedData;
     } catch (error) {
       console.error("❌ Error fetching live salesman data:", error);
       return [];
     }
   };
   

module.exports =  {getLiveSalesmanData};
