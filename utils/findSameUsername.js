const Company = require("../models/Company");
const Branch = require("../models/Branch");
const Supervisor = require("../models/Supervisor");
const Salesman = require("../models/Salesman");

const findSameUsername = async (username) => {
  try {
    if (!username) throw new Error("Username is required");

    const queries = [
      Company.findOne({ username }).lean(),
      Branch.findOne({ username }).lean(),
      Supervisor.findOne({ username }).lean(),
      Salesman.findOne({ username }).lean(),
    ];

    const results = await Promise.all(queries);

    if (results.some((result) => result)) {
      return { message: "Username already exists", exists: true };
    }

    return { message: "Username is available", exists: false };
  } catch (error) {
    console.error("Error finding username:", error.message);
    throw new Error("An error occurred while checking username availability.");
  }
};

module.exports = findSameUsername;
