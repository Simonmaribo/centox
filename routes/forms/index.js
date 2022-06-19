// Imports
const router = require('express').Router();

// Export route
module.exports = (db) => {
    
    // Utils
    const forms = require('../../server/forms')(db);
    const auth = require('../../server/auth')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/utils/rateLimiter')(2 * 60 * 1000, 100, "For mange anmodninger. Prøv igen senere.")

    router.get('/', rateLimiter, auth.ensureAuthentication, async (req, res) => {
        await forms.getForms((response) => {
            if(response.status == 200) {
                return res.status(response.status).json({ message: response.message, forms: response.data });
            }
            return res.status(response.status).json({ message: response.message });
        });
    })


    router.get('/:id', rateLimiter, auth.ensureAuthentication, async (req, res) => {
        var form = await forms.getForm(req.params.id);
        if(!form) return res.status(404).json({ message: "Form not found" });
        return res.status(200).json({ form: form });
    })


    router.delete('/:id', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        if(req.user.role !== "admin") return res.status(401).json({ message: "Forbidden." });
        await forms.deleteForm(req.params.id, (response) => res.status(response.status).json({ message: response.message }));
    })



    router.post('/:id', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        if(req.user.role !== "admin") return res.status(401).json({ message: "Forbidden." });

        const { form } = req.body;

        // check if the form contains a name
        if(!form.name) return res.status(400).json({ message: "Der skal angives et navn til skemaet." });
        if(!form.updatedAt || !form.createdAt) return res.status(400).json({ message: 'Form cannot change its creation or update date.' });
        if(!form.permissions) return res.status(400).json({ message: 'Form must have a permissions object.' });
        
        // loop though the permissions object and check if they are valid
        for(let role in form.permissions)
            for(let permission in form.permissions[role])
                if(form.permissions[role][permission] !== true && form.permissions[role][permission] !== false) 
                    return res.status(400).json({ message: 'Form permission object must be a boolean.' });
        
        // loop though the fields and check if they are valid
        let i = 0; // count the fields?
        for(let field of form.fields){
            if(!field.id) return res.status(400).json({ message: `Form field ${i} must have an id.` });
            if(!field.type || !['text', 'heading', 'shorttext', 'longtext', 'select', 'checkbox'].includes(field.type)) 
                return res.status(400).json({ message: `Feltet ${i} skal have en type.` });
            if(field.type == 'text' && !field.description)
                return res.status(400).json({ message: `Feltet ${i} skal have tekst.` });
            if(field.type != 'text' && !field.label)
                return res.status(400).json({ message: `Feltet ${i} skal have et spørgsmål eller overskrift.` });            
            i++;
        }

        if(!form) return res.status(400).json({ message: "Form not provided." });

        var dbForm = await forms.getForm(req.params.id);
        if(!dbForm) return res.status(404).json({ message: "Form not found" });

        await forms.updateForm(req.params.id, form, (response) => res.status(response.status).json({ message: response.message }));
    })



    return router;
}