// Imports
const router = require('express').Router();

// Export route
module.exports = (db) => {
    
    // Utils
    const forms = require('../../server/forms')(db);
    const auth = require('../../server/auth')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/utils/rateLimiter')(2 * 60 * 1000, 35, "For mange anmodninger. Prøv igen senere.")

    router.post('/', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        if(req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        await forms.createForm((response) => {
            res.status(response.status).json({ message: response.message});
        });
    })

    return router;
}