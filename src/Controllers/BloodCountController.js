
const { Donate } = require("../Models/models");
const logger = require('../utils/logger');

exports.getBloodUnitCount = async (req, res) => {
  try {
    const result = await Donate.aggregate([
      {
        $group: {
          _id: "$bloodGroup",
          totalUnits: { $sum: "$unit" }
        }
      }
    ]);
    
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

