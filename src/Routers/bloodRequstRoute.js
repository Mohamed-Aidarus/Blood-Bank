const express = require('express');
const requestRouter = express.Router();


const {
    createBloodRequest,getAllBloodRequests,deleteBloodRequest
} = require('../Controllers/BloodRequestController');
// Create a new blood request

requestRouter.get("/", getAllBloodRequests);
requestRouter.post("/", createBloodRequest);

requestRouter.delete("/:id", deleteBloodRequest);
// Get all blood requests
// // Get a single blood request by ID
// bloodRequestRouter.get('/:id', bloodRequestController.getBloodRequestById);

// // Update a blood request by ID
// bloodRequestRouter.patch('/:id', bloodRequestController.updateBloodRequest);

// // Delete a blood request by ID
// bloodRequestRouter.delete('/:id', bloodRequestController.deleteBloodRequest);

module.exports = requestRouter;