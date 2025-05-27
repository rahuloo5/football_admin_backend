const express = require('express');
const router = express.Router();
const { getMediaContents, addMediaContents } = require('./mediaManagement');

// Get all media contents
router.get('/media', async (req, res) => {
    try {
        const mediaContents = getMediaContents();
        res.json({
            success: true,
            data: mediaContents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Upload media files
router.post('/media', async (req, res) => {
    try {
        const uploadedFiles = await addMediaContents(req, res);
        res.json({
            success: true,
            data: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 