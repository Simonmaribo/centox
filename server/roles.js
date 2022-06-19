// Return module
module.exports = (db) => {
    const obj = {};

    const user = require('./user')(db);


    /**
     * Gets an array of created roles.
     * @returns {Array} Array of roles
     */
    obj.getRoles = async () => {
        var res = await db.roles.find({}).toArray();
        if(!res) return {};
        const roles = {}
        for(var i = 0; i < res.length; i++) 
            roles[res[i].id] = res[i];
        return roles;
    }

    /**
     * Gets a role by id.
     * @param {String} id - Role id or label
     * @returns {Object} Role
     */
    obj.getRole = async (id) => {
        var res = await db.roles.findOne({id: id.toLowerCase()});
        if(!res) return null;
        return res;
    }

    /**
     * Returns whether a role exists or not.
     * @param {String} id - Role id or label
     * @returns {Boolean} Whether the role exists or not
     */
    obj.roleExists = async (id) => {
        var res = await db.roles.findOne({id: id?.toLowerCase()});
        return res ? true : false;
    }

    /**
     * Updates a role.
     * @param {String} id - Role id
     * @param {String} label - Role label
     * @param {String} color - Role color
     * @returns {Object} Updated role
     */
    obj.updateRole = async (id, label, color, cb) => {
        if(id.toLowerCase() != label.toLowerCase()) return cb({ status: 400, message: "Bogstaverne i ranken kan ikke ændres, kun om de er store el. små." });
        await db.roles.updateOne({id: id}, {$set: {label: label, color: color.toLowerCase() }}, (err, res) => {
            if(err) return cb({ status: 500, message: `Der opstod en fejl under opdatering af ranken '${label}'` });
            return cb({ status: 200, message: `Ranken '${label}' er blevet opdateret.` });
        });
    }

    /**
     * Creates a role.
     * @param {String} label - Role label
     * @param {String} color - Role color
     * @returns {Object} Created role
     * @throws {Error} If the role already exists
     */
    obj.createRole = async (label, color, cb) => {
        if(await obj.roleExists(label)) return cb({ status: 400, message: `Ranken '${label}' findes allerede.` });
        else await db.roles.insertOne({id: label.toLowerCase(), label: label, color: color.toLowerCase()}, (err, res) => {
            if(err) return cb({ status: 500, message: `Der opstod en fejl under oprettelse af ranken '${label}'` });
            return cb({ status: 200, message: `Ranken '${label}' er blevet lavet!` });
        });
    }

    /**
     * Deletes a role.
     * @param {String} id - Role id
     * @returns {Function} Callback function
     */
    obj.deleteRole = async (id, cb) => {
        var role = await obj.getRole(id);

        if(!role) return cb({ status: 400, message: `Ranken '${id}' findes ikke.` });
        if(role.deletable === false) return cb({ status: 400, message: `Ranken '${id}' kan ikke blive slettet.` });
        
        else {
            await obj.resetRole(id);
            await db.roles.deleteOne({id: id}, (err, res) => {
                if(err) return cb({ status: 500, message: `Der opstod en fejl under sletning af ranken '${id}'` });
                return cb({ status: 200, message: `Ranken '${id}' er blevet slettet.` });
            });
        }
    }

    obj.isValidColor = (color) => {
        // Create function to check though a list of allowed colors
        const allowedColors = [
            'gray',
            'red',
            'pink',
            'grape',
            'violet',
            'indigo',
            'blue',
            'cyan',
            'green',
            'lime',
            'yellow',
            'orange',
            'teal'
        ];
        return allowedColors.includes(color.toLowerCase());
    }

    /**
     * Create function where users with a specific role is being reset to 'default' role.
     * @param {String} role - Role id
     * @returns {Function} Callback function
     */
    obj.resetRole = async (role) => {
        await db.users.updateMany({role: role.toLowerCase()}, {$set: {role: 'spiller'}});
    }

    return obj;
}