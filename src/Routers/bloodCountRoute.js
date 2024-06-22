const express = require('express');
const bloodCountRouter = express.Router();
const {
    getBloodUnitCount
} = require('../Controllers/BloodCountController');
bloodCountRouter.get("/", getBloodUnitCount);
module.exports = bloodCountRouter;