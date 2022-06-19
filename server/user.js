// Imports
const { ObjectId } = require('mongodb');

// Return module
module.exports = (db) => {
    const obj = {};

    const auth = require('./auth')(db);

    /**
     * Check if a user by a specific discord id exists in the database
     * @param {Number} discord id
     * @returns {Boolean} if the user exists or not
     */
    obj.exists = async (id) => {
        var res = await db.users.findOne({ id });
        if(!res) return false;
        return true;
    }

    /**
     * Update discord user information when logging in.
     * @param {Number} id discord if of user
     * @param {*} data object with data to update
     * @returns 
     */

    obj.updateDiscord = async (id, data, callback) => {
        var user = await obj.getUser(id);
        if(user == null) return;
        
        user.username = data.username;
        user.avatar = data.avatar;

        db.users.updateOne({ id }, {$set: user }, (err, res) => {
            if (err) {
                console.error(err);
            }
        });
    }

    /**
     * Creates a new user in the database
     * @param {*} user 
     * @param {Function} callback 
     */
    obj.createNew = async (data, callback) => {
        // DO SOMETHING
        if (!await obj.exists(data.id)){
            const user = {
                id: data.id,
                username: data.username,
                avatar: data.avatar,
                role: 'spiller',
                createdAt: new Date().getTime(),
            }
            db.users.insertOne(user, async (err, res) => {
                if (err) console.log(err);
            });
        }
    }

    /**
     * Login to user
     * @param {String} userId
     */
     obj.loginToUser = async (discordId, req, callback) => {
        var user = await db.users.findOne({ id: discordId });
        if (!user) callback({status: 404, message: 'User not found.'});
        else {
            var token = auth.generateAccessToken(user._id.toString());
            db.logins.insertOne({
                token: token,
                ipaddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                user: new ObjectId(user._id),
                loggedIn: new Date().getTime()
            }, async (err, res) => {
                if (err) {
                    console.error(err);
                    return callback({status: 404, message: 'Der var noget som gik galt.'});
                }
                return callback({status: 200, message: `Du har logget ind.`, data: { token: token }});
            });
        }
    }

    /**
     * Logout
     * @param {String} token 
     */ 
    obj.logout = async (token, callback) => {
        db.logins.updateOne({ token: token }, { $unset: { token: 1 } }, (err, result) => {
            if (err) {
                console.error(err);
                callback({
                    status: 400,
                    message: 'Noget gik galt ved at logge ud'
                });
            } else {
                callback({
                    status: 200,
                    message: 'Logget ud.'
                });
            }
        });
    }

    /**
     * Logout all logged in sessions
     * @param {String} userId 
     * @param {Function} callback
     */ 
    obj.logoutFromAllSessions = async (userId, callback) => {
        db.logins.updateMany({user: new ObjectId(userId)}, {$unset: {token: 1}}, (err, result) => {
            if (err) {
                console.error(err);
                callback({
                    status: 400,
                    message: 'Noget gik galt ved at logge ud af alle sessioner.'
                });
            } else {
                callback({
                    status: 200,
                    message: 'Logget ud af alle sessioner.'
                });
            }
        });
    }

    /**
     * Get user data
     * @param {String} id discord id
     */
    obj.getUser = async (discordId) => {
        var user = await db.users.findOne({ id: discordId });
        if (!user) return null;
        return user;
    }

    /**
     * Get user data by user id
     * @param {String} userId 
     */
     obj.getUserById = async (userId) => {
        try {
            var user = await db.users.findOne({ _id: new ObjectId(userId) });
            if (!user) return null;
            return user;
        } catch (err) {
            return null;
        }
    }

    /**
     * Get user data from access token
     * @param {String} accessToken 
     */
    obj.getUserFromAccessToken = async (accessToken) => {
        var login = await db.logins.findOne({token: accessToken});
        if (!login) return null;
        var user = await db.users.findOne({_id: new ObjectId(login._id)});
        if (!user) return null;
        return user;
    }


    /** 
     * Get list of users from mongodb based upon page number
     * @param {Number} page
     * @param {Number} limit
     * @returns {Array} list of users
     */
    obj.getUsers = async (page, limit) => {
        return await db.users.find({}).skip((page-1) * limit).limit(limit).toArray();
    }

    /**
     * Get total amount of documents in collection
     * @returns {Number} total amount of documents
     */
    obj.getTotalUsers = async () => {
        return await db.users.count();
    }

    /**
     * Check if user can edit another user
     * @param {String} userId
     * @param {String} targetId
     * @returns {Boolean} if the user can edit the user or not
     */
    obj.canEditUser = async (userId, targetId) => {

        // check if user and target is the same user.
        if(userId.toString() === targetId.toString()) return false;

        var user = await db.users.findOne({ _id: new ObjectId(userId) });
        if (!user) return false;

        // if the user is the owner, he can edit anyone.
        if(user.owner) return true;

        // only admins can edit users.
        if(user.role == 'admin') {
            var target = await db.users.findOne({ _id: new ObjectId(targetId) });
            if (!target) return false;
            // if the target is an admin only the owner can edit him.
            if(target.role == 'admin') return false;
            return true;
        } else return false;
    }

    /**
     * Update a users role
     * @param {String} userId
     * @param {String} Role
     * @param {Function} callback
     */
    obj.updateRole = async (userId, role, callback) => {
        var user = await db.users.findOne({ _id: new ObjectId(userId) });
        if (!user) callback({status: 404, message: 'Brugeren blev ikke fundet.'});
        else {
            user.role = role;
            db.users.updateOne({ _id: new ObjectId(userId) }, {$set: user}, (err, res) => {
                if (err) {
                    console.error(err);
                    callback({status: 404, message: 'Der gik noget galt.'});
                } else {
                    callback({status: 200, message: 'Ranken er blevet opdateret.'});
                }
            });
        }
    }
    
    return obj;
}