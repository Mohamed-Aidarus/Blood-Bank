// donateController.js
const { Donate } = require('../Models/models'); // 
// donateController.js
const {BloodUnit} = require('../Models/models');

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const { bloodGroup, unit, disease, age, donor } = req.body;

    // Create a new BloodUnit
    const bloodUnit = await BloodUnit.create({
      bloodGroup,
      unit,
      donor
    });

    // Create a new Donate
    const donation = await Donate.create({
      bloodGroup,
      unit,
      disease,
      age,
      donor,
      bloodUnit: bloodUnit._id
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donate.find()
      .populate('donor')
      .populate('bloodUnit');
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single donation
exports.getDonation = async (req, res) => {
  try {
    const donation = await Donate.findById(req.params.id)
      .populate('donor')
      .populate('bloodUnit');
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a donation
exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donate.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Update the associated BloodUnit
    await BloodUnit.findByIdAndUpdate(donation.bloodUnit, {
      bloodGroup: req.body.bloodGroup,
      unit: req.body.unit,
      donor: req.body.donor
    });

    // Update the Donate document
    donation.bloodGroup = req.body.bloodGroup;
    donation.unit = req.body.unit;
    donation.disease = req.body.disease;
    donation.age = req.body.age;
    donation.donor = req.body.donor;
    await donation.save();

    res.status(200).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a donation
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donate.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Delete the associated BloodUnit
    await BloodUnit.findByIdAndDelete(donation.bloodUnit);

    // Delete the Donate document
    await donation.delete();

    res.status(204).json({ message: 'Donation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};