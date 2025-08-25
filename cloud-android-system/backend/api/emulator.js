const express = require('express');
const router = express.Router();

// Mock endpoint returning Cloud Android Web URL
router.get('/url', (req, res) => {
    res.json({ url: "http://<ALB-DNS>:6080" });
});

module.exports = router;
