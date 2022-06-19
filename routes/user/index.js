// Imports
const router = require('express').Router();

// Export route
module.exports = (db) => {
    
    // Utils
    const user = require('../../server/user')(db);
    const roles = require('../../server/roles')(db);
    const auth = require('../../server/auth')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/utils/rateLimiter')(2 * 60 * 1000, 30, "Too many requests. Try again later.")

    router.get('/:id', rateLimiter, auth.ensureAuthentication, async (req, res) => {
        if(!req.params.id) return res.status(400).json({message: 'Missing id'});

        var userObj;
        if(req.params.id.length > 18)
            userObj = await user.getUserById(req.params.id)
        else
            userObj = await user.getUser(req.params.id)
        if(!userObj) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user: userObj });
    })

    router.post('/:_id', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        var userObj = await user.getUserById(req.params._id);
        if(!userObj) return res.status(404).json({ message: "User not found" });
        if(await user.canEditUser(req.user._id, userObj._id)){
            if(await roles.roleExists(req.body.roleId)){
                await user.updateRole(userObj._id, req.body.roleId, (response) => res.status(response.status).json({ message: response.message }));
            } else return res.status(404).json({ message: "Role not found" });
        } else return res.status(400).json({ message: "You do not have permission to edit this user." });
    })

    return router;
}