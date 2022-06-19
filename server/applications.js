// Imports
const { ObjectId } = require('mongodb');

// Return module
module.exports = (db) => {
    const obj = {};

    /**
     * Create application
     * @param {String} formId - The form _id
     * @param {String} userId - The user _id
     * @param {Object} answers - The answers
     * @param {Function} callback - The callback
     */
    obj.createApplication = async (formId, userId, answers, callback) => {
        try {
            var userObject = new ObjectId(userId);
            var formObject = new ObjectId(formId);

            await db.applications.insertOne({
                form: formObject,
                user: userObject,
                createdAt: new Date().getTime(),
                statusUpdatedAt: new Date().getTime(),
                status: "pending",
                comments: [],
                answers: answers
            }, (err, res) => callback({ status: 200, message: "Ansøgningen er blevet oprettet!", applicationId: res.insertedId }));
        } catch(err) {
            callback({ status: 500, message: 'Der opstod en intern fejl.' });
        }
    }

    /**
     * Get the number of total applications with a specific status and formId
     * @param {String} formId - The form _id
     * @param {String[]} status - The status
     */
    obj.getTotalApplications = async (formId, status) => {
        try {
            var formObject = new ObjectId(formId);

            if(Array.isArray(status)){
                var statusObject = [];
                for(var i = 0; i < status.length; i++){
                    statusObject.push({ status: status[i] });
                }
                var count = await db.applications.count({ form: formObject, '$or': statusObject });
                return count;
            } else {
                var count = await db.applications.count({ form: formObject, status: status });
                return count;
            }
        } catch(err) {
            return 0;
        }
    }


    /**
     * Get a paginated list of all application with a specific status
     * 
     * @param {String} formId - The form _id
     * @param {String} status - The status
     * @param {Number} page - The page
     * @param {Number} limit - The limit
     */
    obj.getAllApplications = async (formId, status, page, limit) => {
        try {

            var formObject = new ObjectId(formId);

            if(Array.isArray(status)){
                var statusObject = [];
                for(var i = 0; i < status.length; i++)
                    statusObject.push({ status: status[i] });
                return db.applications.find({ form: formObject, '$or': statusObject }, { projection: { answers: 0, comments: 0 }, skip: (page - 1) * limit, limit: limit, sort: { createdAt: -1} }).toArray();
            } else {
                return db.applications.find({ form: formObject, status: status }, { projection: { answers: 0, comments: 0 }, skip: (page - 1) * limit, limit: limit, sort: { createdAt: -1} }).toArray();
            }
        }
        catch(err) {
            return []
        }
    }

    /**
     * Get a list of users applications
     * @param {String} userId - The user _id
     */
    obj.getUserApplications = async (userId) => {
        try {
            var userObject = new ObjectId(userId);
            return db.applications.find({ user: userObject }, { projection: { answers: 0, comments: 0 }}).toArray();
        }
        catch(err) {
            return []
        }
    }

    /**
     * Get a specific application
     * @param {String} applicationId - The application _id
     */
    obj.getApplication = async (applicationId) => {
        try {
            var applicationObject = new ObjectId(applicationId);
            return db.applications.findOne({ _id: applicationObject });
        }
        catch(err) {
            return null
        }
    }

    /**
     * Delete an application
     * @param {String} applicationId - The application _id
     * @param {Function} callback - The callback
     */
    obj.deleteApplication = async (applicationId, callback) => {
        try {
            var applicationObject = new ObjectId(applicationId);
            await db.applications.deleteOne({ _id: applicationObject }, (err, res) => {
                if(err){
                    console.log(err);
                    return callback({ status: 500, message: 'Der opstod en intern fejl.' });
                }
                return callback({ status: 200, message: 'Ansøgningen er blevet slettet.' })
            });
        }
        catch(err) {
            return callback({ status: 500, message: 'Der opstod en intern fejl.' });
        }
    }

    /** 
     * Change the status of an application
     * @param {String} applicationId - The application _id
     * @param {String} userId - the id of the user who updates the status
     * @param {String} status - The status
     * @param {Function} callback - The callback
     */
    obj.changeStatus = async (applicationId, userId, status, callback) => {
        try {
            var applicationObject = new ObjectId(applicationId);
            var userObject = new ObjectId(userId);
            await db.applications.updateOne({ _id: applicationObject }, { $set: { status: status, statusUpdatedAt: new Date().getTime(), statusUpdatedBy: userObject } }, (err, res) => {
                if(err){
                    console.log(err);
                    return callback({ status: 500, message: 'Der opstod en intern fejl.' });
                }
                return callback({ status: 200, message: "Ansøgningens status er blevet ændret." })
            });
        }
        catch(err) {
            return callback({ status: 500, message: 'Der opstod en intern fejl.' });
        }
    }

    /**
     * Add a comment to an application
     * @param {String} applicationId - The application _id
     * @param {String} userId - The user _id
     * @param {String} comment - The comment
     * @param {Function} callback - The callback
     */
    obj.addComment = async (applicationId, userId, comment, callback) => {
        try {
            var applicationObject = new ObjectId(applicationId);
            var userObject = new ObjectId(userId);
            await db.applications.updateOne({ _id: applicationObject }, { $push: { comments: { user: userObject, text: comment, createdAt: new Date().getTime() } } }, (err, res) => {
                if(err){
                    console.log(err);
                    return callback({ status: 500, message: 'Der opstod en intern fejl.' });
                }
                return callback({ status: 200, message: "Du har tilføjet en kommentar!" })
            });
        }
        catch(err) {
            return callback({ status: 500, message: 'Der opstod en intern fejl.' });
        }
    }

    return obj;
}