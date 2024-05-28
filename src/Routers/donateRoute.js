// routes.js
const express = require('express');
const donaterouter = express.Router();
const donateController = require('../Controllers/DonateController');

// Create a new donation
donaterouter.post('/', donateController.createDonation);

// Get all donations
donaterouter.get('/', donateController.getAllDonations);

// Get a single donation by ID
donaterouter.get('/:id', donateController.getDonation);

// Update a donation by ID
donaterouter.patch('/:id', donateController.updateDonation);

// Delete a donation by ID
donaterouter.delete('/:id', donateController.deleteDonation);

module.exports = donaterouter;