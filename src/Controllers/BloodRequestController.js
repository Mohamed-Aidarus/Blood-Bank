const { BloodRequest } = require('../Models/models'); 
const createBloodRequest = async (req, res) => {
    try {
      const bloodRequest = new BloodRequest({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        bloodGroup: req.body.bloodGroup,
        medicalCondition: req.body.medicalCondition,
        unit: req.body.unit,
        status: req.body.status,
        action: req.body.action,
        requester: req.user._id
      });
  
      await bloodRequest.save();
      res.status(201).json(bloodRequest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Get all blood requests
  const getAllBloodRequests = async (req, res) => {
    try {
      const bloodRequests = await BloodRequest.find();
      res.status(200).json(bloodRequests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get a single blood request by ID
  const getBloodRequestById = async (req, res) => {
    try {
      const bloodRequest = await BloodRequest.findById(req.params.id);
      if (!bloodRequest) {
        return res.status(404).json({ message: 'Blood request not found' });
      }
      res.status(200).json(bloodRequest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update a blood request by ID
  const updateBloodRequest = async (req, res) => {
    try {
      const bloodRequest = await BloodRequest.findById(req.params.id);
      if (!bloodRequest) {
        return res.status(404).json({ message: 'Blood request not found' });
      }
  
      bloodRequest.name = req.body.name || bloodRequest.name;
      bloodRequest.age = req.body.age || bloodRequest.age;
      bloodRequest.gender = req.body.gender || bloodRequest.gender;
      bloodRequest.bloodGroup = req.body.bloodGroup || bloodRequest.bloodGroup;
      bloodRequest.medicalCondition = req.body.medicalCondition || bloodRequest.medicalCondition;
      bloodRequest.unit = req.body.unit || bloodRequest.unit;
      bloodRequest.status = req.body.status || bloodRequest.status;
      bloodRequest.action = req.body.action || bloodRequest.action;
  
      await bloodRequest.save();
      res.status(200).json(bloodRequest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete a blood request by ID
  const deleteBloodRequest = async (req, res) => {
    try {
      const bloodRequest = await BloodRequest.findByIdAndDelete(req.params.id);
      if (!bloodRequest) {
        return res.status(404).json({ message: 'Blood request not found' });
      }
      res.status(200).json({ message: 'Blood request deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  module.exports = { createBloodRequest, getAllBloodRequests, getBloodRequestById, updateBloodRequest, deleteBloodRequest };