const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const apiKey = 'b3157a6052c24ef2aab80222a6de5464';
        // Note: we use server-side axios to bypass NewsAPI browser CORS restrictions on the free tier
        const response = await axios.get(`https://newsapi.org/v2/everything?q=banking+OR+finance+OR+economy&language=en&sortBy=publishedAt&pageSize=12&apiKey=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching news from API:", error.message);
        res.status(500).json({ message: "Failed to fetch news" });
    }
});

module.exports = router;
