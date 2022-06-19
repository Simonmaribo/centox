// Imports
const router = require('express').Router();

// Export route
module.exports = (db) => {
    
    // Utils
    const user = require('../../server/user')(db);
    const auth = require('../../server/auth')(db);
    const applications = require('../../server/applications')(db);
    const forms = require('../../server/forms')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/utils/rateLimiter')(2 * 60 * 1000, 30, "For mange anmodninger. Prøv igen senere.")

    router.get('/:discordId', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        var userObj = await user.getUser(req.params.discordId);
        if(!userObj) return res.status(404).json({ message: "Brugeren blev ikke fundet." });

        var permissions = await forms.getAllFormPermissions();
        var applicationArr = await applications.getUserApplications(userObj._id);
        var allowedApplications = []

        for(var i = 0; i < applicationArr.length; i++) {
            var application = applicationArr[i];
            if(application.user.toString() != req.user._id){
                var rolePermissions = permissions[application.form][req.user?.role];
                if(!rolePermissions || !rolePermissions.viewOthers) continue;
            }
            allowedApplications.push(application)
        }
        return res.status(200).json({ applications: allowedApplications });
    })



    return router;
}