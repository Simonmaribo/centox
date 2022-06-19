// Imports
const router = require('express').Router();

// Export route
module.exports = (db) => {
    
    // Utils
    const auth = require('../../server/auth')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/utils/rateLimiter')(60 * 1000, 100, "Too many requests. Try again later.")

    router.get('/', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        // Tutorial: https://circlertech.com/working-with-discord-oauth2
        return res.json({
            user: req.user
        });
    })

    return router;
}