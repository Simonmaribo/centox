// Imports
const router = require('express').Router();

// Export route
module.exports = (db) => {
    
    // Utils
    const forms = require('../../server/forms')(db);
    const auth = require('../../server/auth')(db);
    const applications = require('../../server/applications')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/utils/rateLimiter')(2 * 60 * 1000, 15, "Too many requests. Try again later.")


    // Create application
    router.get('/:id/:page', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {

        var status = req.query.status;
        if(!status) return res.status(400).json({ message: 'Missing status parameter.' });
        if(Array.isArray(status)){
            for(var i = 0; i < status.length; i++){
                if(!["pending", "accepted", "rejected"].includes(status[i]))
                    return res.status(400).json({ message: 'Invalid status parameter.' });
            }
        }
        
        var form = await forms.getForm(req.params.id);
        if(!form) return res.status(404).send({ status: 404, message: "Form not found." });

        if(!form.permissions[req.user?.role] || !form.permissions[req.user?.role].viewOthers) return res.status(401).json({ message: "You do not have permission to view other applications for this type of form." });

        var page = parseInt(req.params.page);
        var applicationsArr = await applications.getAllApplications(req.params.id, status, page, 10);
        var totalApplications = await applications.getTotalApplications(req.params.id, status);
        
        //var totalapplications = await applications.getTotalApplications(req.params.id, status);
        return res.status(200).json({
            applications: applicationsArr,
            total: totalApplications,
            pages: Math.ceil(totalApplications / 10)
        });
    })

    return router;
}