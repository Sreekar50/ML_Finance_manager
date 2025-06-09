const express = require('express');
const { processTransaction } = require('../controllers/transactionController');
const router = express.Router();

// Route for handling file upload and processing
router.post('/upload', processTransaction);

module.exports = router;
