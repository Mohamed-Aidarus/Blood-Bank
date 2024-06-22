const express = require('express');
const donateRouter = express.Router();


const {
    createDonation,getAllDonations, deleteDonation
} = require('../Controllers/DonateController');
// Create a new blood request

donateRouter.get("/", getAllDonations);
donateRouter.post("/", createDonation);

donateRouter.delete("/:id", deleteDonation);

// // Get a single donation by ID
// donaterouter.get('/:id', donateController.getDonation);

// // Update a donation by ID
// donaterouter.patch('/:id', donateController.updateDonation);

// // Delete a donation by ID
// donaterouter.delete('/:id', donateController.deleteDonation);

module.exports = donateRouter;