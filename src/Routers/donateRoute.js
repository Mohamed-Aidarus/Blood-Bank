const express = require('express');
const donateRouter = express.Router();


const {
    createDonation,getAllDonations
} = require('../Controllers/DonateController');
// Create a new blood request

donateRouter.get("/", getAllDonations);
donateRouter.post("/", createDonation);

// // Get a single donation by ID
// donaterouter.get('/:id', donateController.getDonation);

// // Update a donation by ID
// donaterouter.patch('/:id', donateController.updateDonation);

// // Delete a donation by ID
// donaterouter.delete('/:id', donateController.deleteDonation);

module.exports = donateRouter;