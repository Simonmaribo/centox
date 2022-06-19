// Imports
const router = require('express').Router();

// Export route
module.exports = (db) => {
    
    // Utils
    const user = require('../../server/user')(db);
    const forms = require('../../server/forms')(db);
    const auth = require('../../server/auth')(db);
    const applications = require('../../server/applications')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/utils/rateLimiter')(2 * 60 * 1000, 10, "Too many requests. Try again later.")


    // Create application
    router.post('/:id', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        var form = await forms.getForm(req.params.id);
        if(!form) return res.status(404).json({ message: "Form not found" });

        if(!form.permissions[req.user?.role] || !form.permissions[req.user?.role].create) return res.status(401).json({ message: "You do not have permission to answer this form." });

        var answers = req.body.answers;

        if(!answers) return res.status(400).json({ message: "No answers provided" });

         // loop though the field object and check if they are valid
        for(var key in form.fields)
            if(form.fields[key].required && !answers[form.fields[key].id]) {
                return res.status(400).json({ message: `The field '${form.fields[key].label}' is required.` });
            }
        
        await applications.createApplication(form._id, req.user._id, answers, (response) => {
            return res.status(response.status).json({ message: response.message, applicationId: response.applicationId });
        });
    })

    // Get application by id
    router.get('/:id', auth.ensureAuthenticationWithUser, async (req, res) => {
        var application = await applications.getApplication(req.params.id);
        if(!application) return res.status(404).json({ message: "Application not found" });
        var form = await forms.getForm(application.form);
        if(!form) return res.status(404).json({ message: "Form not found" });

        if(req.user._id.toString() !== application.user.toString() && (!form.permissions[req.user?.role] || !form.permissions[req.user?.role].viewOthers)) 
            return res.status(401).json({ message: "You do not have permission to view this type of application." });

        var userObj = await user.getUserById(application.user);
        if(!userObj) return res.status(404).json({ message: "User not found" });
        
        return res.status(200).json({ application: application, form: form, user: userObj });
    });

    // Delete application
    router.delete('/:id', auth.ensureAuthenticationWithUser, async (req, res) => {
        var application = await applications.getApplication(req.params.id);
        if(!application) return res.status(404).json({ message: "Application not found" });
        
        if(req.user.role != 'admin' && req.user._id.toString() != application.user.toString()) return res.status(401).json({ message: "You do not have permission to delete this application." });
        
        await applications.deleteApplication(req.params.id, (response) => {
            return res.status(response.status).json({ message: response.message });
        });
    })

    // change status of application
    router.put('/:id/status', auth.ensureAuthenticationWithUser, async (req, res) => {
        const { status } = req.body;
        if(!status) return res.status(400).json({ message: "No status provided" });
        if(!['pending', 'accepted', 'rejected'].includes(status)) return res.status(400).json({ message: "Invalid status" });

        var application = await applications.getApplication(req.params.id);
        if(!application) return res.status(404).json({ message: "Application not found" });

        var form = await forms.getForm(application.form);
        if(!form) return res.status(404).json({ message: "Form not found" });
        if(!form.permissions[req.user?.role] || !form.permissions[req.user?.role].changeStatus) 
            return res.status(401).json({ message: "You do not have permission to change the status of this type of application." });

        await applications.changeStatus(req.params.id, req.user._id, req.body.status, (response) => {
            return res.status(response.status).json({ message: response.message });
        });
    });

    // create comment
    router.post('/:id/comment', auth.ensureAuthenticationWithUser, async (req, res) => {
        var { comment } = req.body;
        if(!comment) return res.status(400).json({ message: "No comment provided" });

        var application = await applications.getApplication(req.params.id);
        if(!application) return res.status(404).json({ message: "Application not found" });

        var form = await forms.getForm(application.form);
        if(!form) return res.status(404).json({ message: "Form not found" });
        if(!form.permissions[req.user?.role] || !form.permissions[req.user?.role].comment)
            return res.status(401).json({ message: "You do not have permission to comment on this type of application." });

        await applications.addComment(req.params.id, req.user._id, comment, (response) => {
            return res.status(response.status).json({ message: response.message });
        });
    });


    return router;
}