// Imports
const router = require('express').Router();

// Export route
module.exports = (db) => {
    
    // Utils
    const user = require('../../server/user')(db);
    const auth = require('../../server/auth')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/rateLimiter')(2 * 60 * 1000, 30, "Too many requests. Try again later.")

    router.get('/:id', rateLimiter, auth.ensureAuthentication, async (req, res) => {
        var userObj = await user.getUser(req.params.id);
        if(!userObj) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user: userObj });
    })

    router.get('/list/:page', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        if(req.user.role !== "admin") return res.status(401).json({ message: 'Unauthorized' });
        if(!req.params.page) return res.status(400).json({ message: 'Missing page parameter.' });
        
        var users = await user.getUsers(req.params.page, 10);
        var totalusers = await user.getTotalUsers();

        return res.status(200).json({
            users: users,
            total: totalusers,
            pages: Math.ceil(totalusers / 10)
        });
    })



    return router;
}