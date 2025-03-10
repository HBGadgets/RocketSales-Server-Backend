// const Salesman = require("../models/Salesman");
// const LiveData = require("../models/LiveData");

// const getLiveSalesmanData = async () => {
//      try {
//        const [salesmen, liveData] = await Promise.all([
//          Salesman.find()
//          .select("-profileImage") 
//          .populate("companyId", "companyName")
//          .populate("branchId", "branchName")
//          .populate("supervisorId", "supervisorName").lean(),
//          LiveData.find().sort({ timestamp: -1 }).lean()
//        ]);
   
//        const latestLiveData = {};
//        for (const data of liveData) {
//          if (!latestLiveData[data.username]) {
//            latestLiveData[data.username] = data;
//          }
//        }
   
//        const mergedData = salesmen.map(salesman => {
//          if (latestLiveData[salesman.username]) {
//            return { ...salesman, ...latestLiveData[salesman.username] };
//          }
//          return salesman;
//        });
   
//        return mergedData;
//      } catch (error) {
//        console.error("❌ Error fetching live salesman data:", error);
//        return [];
//      }
//    };
   

// module.exports =  {getLiveSalesmanData};


const Salesman = require("../models/Salesman");
const LiveData = require("../models/LiveData");

let cachedLiveData = [];
let lastFetchedTime = 0;

const fetchLiveSalesmanData = async () => {
    try {
        const currentTime = Date.now();
        if (currentTime - lastFetchedTime < 10000) return; 
        const [salesmen, liveData] = await Promise.all([
            Salesman.find()
                .select("-profileImage")
                .populate("companyId", "companyName")
                .populate("branchId", "branchName")
                .populate("supervisorId", "supervisorName")
                .lean(),
            LiveData.find().sort({ timestamp: -1 }).lean(),
        ]);

        const latestLiveData = {};
        for (const data of liveData) {
            if (!latestLiveData[data.username]) {
                latestLiveData[data.username] = data;
            }
        }

        cachedLiveData = salesmen.map(salesman => ({
            ...salesman,
            ...latestLiveData[salesman.username] || {},
        }));

        lastFetchedTime = currentTime;
        // console.log("✅ Live data updated at:", new Date().toLocaleTimeString());

    } catch (error) {
        console.error("❌ Error fetching live salesman data:", error);
    }
};

setInterval(fetchLiveSalesmanData, 10000);


module.exports = {
    getCachedLiveData: () => cachedLiveData,
    fetchLiveSalesmanData,
};
