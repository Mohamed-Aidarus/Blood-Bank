const express = require('express');
const bloodUnitrouter = express.Router();
const bloodUnitController = require('../Controllers/BloodUnitController');

bloodUnitrouter.post('/', bloodUnitController.createBloodUnit);
bloodUnitrouter.get('/', bloodUnitController.getAllBloodUnits);
bloodUnitrouter.get('/:id', bloodUnitController.getBloodUnit);
bloodUnitrouter.put('/:id', bloodUnitController.updateBloodUnit);
bloodUnitrouter.delete('/:id', bloodUnitController.deleteBloodUnit);
// bloodUnitrouter.get('/counts', bloodUnitController.getBloodUnitCounts);
bloodUnitrouter.post('/counts', bloodUnitController.getBloodUnitCountsByGroup);
bloodUnitrouter.get('/:bloodGroup', bloodUnitController.getBloodUnitsByGroup);

module.exports = bloodUnitrouter;