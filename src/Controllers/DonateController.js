const { Donate } = require('../Models/models');
const logger = require('../utils/logger');

exports.createDonation = async (req, res) => {
  try {
    const { fullname, bloodGroup, unit, disease, age } = req.body;

    const donation = await Donate.create({
      fullname,
      bloodGroup,
      unit,
      disease,
      age,
    });

    res.status(201).json({
      message: "Donation created successfully",
      data: donation,
    });
  } catch (error) {
    logger.error(`Error creating donation: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donate.find();
    res.status(200).json({
      message: "Donations retrieved successfully",
      data: donations,
    });
  } catch (error) {
    logger.error(`Error retrieving donations: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// // Get a single donation
// exports.getDonation = async (req, res) => {
//   try {
//     const donation = await Donate.findById(req.params.id)
//       .populate('donor')
//       .populate('bloodUnit');
//     if (!donation) {
//       return res.status(404).json({ message: 'Donation not found' });
//     }
//     res.status(200).json(donation);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a donation
// exports.updateDonation = async (req, res) => {
//   try {
//     const donation = await Donate.findById(req.params.id);
//     if (!donation) {
//       return res.status(404).json({ message: 'Donation not found' });
//     }

//     // Update the associated BloodUnit
//     await BloodUnit.findByIdAndUpdate(donation.bloodUnit, {
//       bloodGroup: req.body.bloodGroup,
//       unit: req.body.unit,
//       donor: req.body.donor
//     });

//     // Update the Donate document
//     donation.bloodGroup = req.body.bloodGroup;
//     donation.unit = req.body.unit;
//     donation.disease = req.body.disease;
//     donation.age = req.body.age;
//     donation.donor = req.body.donor;
//     await donation.save();

//     res.status(200).json(donation);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a donation
// Controller function to delete a donation
// Controller function to delete a donation
// Controller function to delete a donation
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donate.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.status(204).json({ message: 'Donation History is deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


