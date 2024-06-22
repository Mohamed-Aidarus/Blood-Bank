const { BloodRequest } = require('../Models/models');
const logger = require('../utils/logger');

exports.createBloodRequest = async (req, res) => {
  try {
    const { fullname, age, gender, bloodGroup, medicalCondition, unit } = req.body;

    const bloodRequest = new BloodRequest({
      fullname,
      age,
      gender,
      bloodGroup,
      medicalCondition,
      unit,
    });

    await bloodRequest.save();
    res.status(201).json({
      message: "Blood request created successfully",
      data: bloodRequest,
    });
  } catch (error) {
    logger.error(`Error creating blood request: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllBloodRequests = async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find();
    res.status(200).json({
      message: "Blood requests retrieved successfully",
      data: bloodRequests,
    });
  } catch (error) {
    logger.error(`Error retrieving blood requests: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood Request not found' });
    }

    res.status(204).json({ message: 'Blood Request is deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  // // Get a single blood request by ID
  // const getBloodRequestById = async (req, res) => {
  //   try {
  //     const bloodRequest = await BloodRequest.findById(req.params.id);
  //     if (!bloodRequest) {
  //       return res.status(404).json({ message: 'Blood request not found' });
  //     }
  //     res.status(200).json(bloodRequest);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };
  
  // // Update a blood request by ID
  // const updateBloodRequest = async (req, res) => {
  //   try {
  //     const bloodRequest = await BloodRequest.findById(req.params.id);
  //     if (!bloodRequest) {
  //       return res.status(404).json({ message: 'Blood request not found' });
  //     }
  
  //     bloodRequest.name = req.body.name || bloodRequest.name;
  //     bloodRequest.age = req.body.age || bloodRequest.age;
  //     bloodRequest.gender = req.body.gender || bloodRequest.gender;
  //     bloodRequest.bloodGroup = req.body.bloodGroup || bloodRequest.bloodGroup;
  //     bloodRequest.medicalCondition = req.body.medicalCondition || bloodRequest.medicalCondition;
  //     bloodRequest.unit = req.body.unit || bloodRequest.unit;

  
  //     await bloodRequest.save();
  //     res.status(200).json(bloodRequest);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // };
  
  // // Delete a blood request by ID
  // const deleteBloodRequest = async (req, res) => {
  //   try {
  //     const bloodRequest = await BloodRequest.findByIdAndDelete(req.params.id);
  //     if (!bloodRequest) {
  //       return res.status(404).json({ message: 'Blood request not found' });
  //     }
  //     res.status(200).json({ message: 'Blood request deleted' });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };
 