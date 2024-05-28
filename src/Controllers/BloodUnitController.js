const { BloodUnit } = require('../Models/models');

// Create a new blood unit
exports.createBloodUnit = async (req, res) => {
  try {
    const { bloodGroup, unit, donor } = req.body;
    const bloodUnit = await BloodUnit.create({ bloodGroup, unit, donor });
    res.status(201).json(bloodUnit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all blood units
exports.getAllBloodUnits = async (req, res) => {
  try {
    const bloodUnits = await BloodUnit.find().populate('donor');
    res.status(200).json(bloodUnits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single blood unit
exports.getBloodUnit = async (req, res) => {
  try {
    const bloodUnit = await BloodUnit.findById(req.params.id).populate('donor');
    if (!bloodUnit) {
      return res.status(404).json({ message: 'Blood unit not found' });
    }
    res.status(200).json(bloodUnit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a blood unit
exports.updateBloodUnit = async (req, res) => {
  try {
    const { bloodGroup, unit, donor } = req.body;
    const bloodUnit = await BloodUnit.findByIdAndUpdate(
      req.params.id,
      { bloodGroup, unit, donor },
      { new: true }
    );
    if (!bloodUnit) {
      return res.status(404).json({ message: 'Blood unit not found' });
    }
    res.status(200).json(bloodUnit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a blood unit
exports.deleteBloodUnit = async (req, res) => {
  try {
    const bloodUnit = await BloodUnit.findByIdAndDelete(req.params.id);
    if (!bloodUnit) {
      return res.status(404).json({ message: 'Blood unit not found' });
    }
    res.status(204).json({ message: 'Blood unit deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the count of blood units for each blood group
exports.getBloodUnitCounts = async (req, res) => {
  try {
    const bloodUnitCounts = await BloodUnit.aggregate([
        {
          $group: {
            _id: '$bloodGroup',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

    const counts = bloodUnitCounts.reduce((acc, unit) => {
      acc[unit._id] = unit.count;
      return acc;
    }, {});

    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllBloodUnits = async (req, res) => {
    try {
      const bloodUnits = await BloodUnit.find({}, { bloodGroup: 1, unitCount: 1, _id: 0 });
      res.status(200).json(bloodUnits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getBloodUnitsByGroup = async (req, res) => {
    try {
      const { bloodGroup } = req.params;
      const bloodUnits = await BloodUnit.find({ bloodGroup });
      res.status(200).json(bloodUnits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getBloodUnitCountsByGroup = async (req, res) => {
    try {
      const { bloodGroup } = req.body;
      const bloodUnitCount = await BloodUnit.countDocuments({ bloodGroup });
      res.status(200).json({ bloodGroup, count: bloodUnitCount });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };