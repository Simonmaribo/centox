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
    const rateLimiter = require('../../server/utils/rateLimiter')(2 * 60 * 1000, 10, "For mange anmodninger. Prøv igen senere.")


    // Create application
    router.post('/:id', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        var form = await forms.getForm(req.params.id);
        if(!form) return res.status(404).json({ message: "Skemaet findes ikke." });

        if(!form.permissions[req.user?.role] || !form.permissions[req.user?.role].create) return res.status(401).json({ message: "Du har ikke adgang til at lave denne type ansøgning." });

        var answers = req.body.answers;

        if(!answers) return res.status(400).json({ message: "Der blev ikke angivet nogle svar." });

         // loop though the field object and check if they are valid
        for(var key in form.fields)
            if(form.fields[key].required && !answers[form.fields[key].id]) {
                return res.status(400).json({ message: `Feltet '${form.fields[key].label}' er påkrævet.` });
            }
        
        await applications.createApplication(form._id, req.user._id, answers, (response) => {
            return res.status(response.status).json({ message: response.message, applicationId: response.applicationId });
        });
    })

    // Get application by id
    router.get('/:id', auth.ensureAuthenticationWithUser, async (req, res) => {
        var application = await applications.getApplication(req.params.id);
        if(!application) return res.status(404).json({ message: 'Ansøgningen blev ikke fundet.' });
        var form = await forms.getForm(application.form);
        if(!form) return res.status(404).json({ message: "Skemaet blev ikke fundet" });

        if(req.user._id.toString() !== application.user.toString() && (!form.permissions[req.user?.role] || !form.permissions[req.user?.role].viewOthers)) 
            return res.status(401).json({ message: "Du har ikke adgang til at se andres ansøgninger." });

        var userObj = await user.getUserById(application.user);
        if(!userObj) return res.status(404).json({ message: "Brugeren blev ikke fundet." });
        
        return res.status(200).json({ application: application, form: form, user: userObj });
    });

    // Delete application
    router.delete('/:id', auth.ensureAuthenticationWithUser, async (req, res) => {
        var application = await applications.getApplication(req.params.id);
        if(!application) return res.status(404).json({ message: "Ansøgningen blev ikke fundet." });
        
        if(req.user.role != 'admin' && req.user._id.toString() != application.user.toString()) return res.status(401).json({ message: "Du har ikke adgang til at slette ansøgninger." });
        
        await applications.deleteApplication(req.params.id, (response) => {
            return res.status(response.status).json({ message: response.message });
        });
    })

    // change status of application
    router.put('/:id/status', auth.ensureAuthenticationWithUser, async (req, res) => {
        const { status } = req.body;
        if(!status) return res.status(400).json({ message: "Ingen status angivet" });
        if(!['pending', 'accepted', 'rejected'].includes(status)) return res.status(400).json({ message: "Ugyldig status angivet" });

        var application = await applications.getApplication(req.params.id);
        if(!application) return res.status(404).json({ message: "Ansøgningen blev ikke fundet." });

        var form = await forms.getForm(application.form);
        if(!form) return res.status(404).json({ message: "Skemaet blev ikke fundet." });
        if(!form.permissions[req.user?.role] || !form.permissions[req.user?.role].changeStatus) 
            return res.status(401).json({ message: "Du har ikke adgang til at ændre status på denne type ansøgning." });

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
            return res.status(401).json({ message: "Du har ikke adgang til at kommentere denne ansøgning." });

        await applications.addComment(req.params.id, req.user._id, comment, (response) => {
            return res.status(response.status).json({ message: response.message });
        });
    });


    return router;
}