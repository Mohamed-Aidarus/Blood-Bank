const express = require('express');
const bloodRequestRouter = express.Router();
const bloodRequestController = require('../Controllers/BloodRequestController');

// Create a new blood request
bloodRequestRouter.post('/', bloodRequestController.createBloodRequest);

// Get all blood requests
bloodRequestRouter.get('/', bloodRequestController.getAllBloodRequests);

// Get a single blood request by ID
bloodRequestRouter.get('/:id', bloodRequestController.getBloodRequestById);

// Update a blood request by ID
bloodRequestRouter.patch('/:id', bloodRequestController.updateBloodRequest);

// Delete a blood request by ID
bloodRequestRouter.delete('/:id', bloodRequestController.deleteBloodRequest);

module.exports = bloodRequestRouter;