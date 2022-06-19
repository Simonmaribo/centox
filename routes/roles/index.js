// Imports
const router = require('express').Router();

// Export route
module.exports = (db) => {
    
    // Utils
    const roles = require('../../server/roles')(db);
    const auth = require('../../server/auth')(db);

    // Create rate limiter
    const rateLimiter = require('../../server/utils/rateLimiter')(2 * 60 * 1000, 50, "Too many requests. Try again later.")

    router.get('/', rateLimiter, async (req, res) => {
        var _roles = await roles.getRoles();
        return res.status(200).json({ roles: _roles });
    })

    router.delete('/:id', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        if(req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        await roles.deleteRole(req.params.id, (response) => {
            return res.status(response.status).json({ message: response.message });
        });
    })

    router.post('/', rateLimiter, auth.ensureAuthenticationWithUser, async (req, res) => {
        if(req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        const { label, color, id } = req.body;
        if(!label || !color) return res.status(400).json({ message: "Missing fields 'label' or 'color'" })
        if(id){
            if(await roles.roleExists(id)){
                await roles.updateRole(id, label, color, (response) => {
                    return res.status(response.status).json({ message: response.message });
                });
            } else return res.status(400).json({ message: "Role with id '" + id + "' doesn't exists" })
        } else {
            await roles.createRole(label, color, (response) => {
                return res.status(response.status).json({ message: response.message });
            })
        }
    })


    return router;
}