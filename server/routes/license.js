//=================================
//             License
//=================================

/** Express router providing license related routes
 * @module routers/license
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express');

/**
 * Express router to mount license related functions on.
 * @type {object}
 * @const
 * @namespace licenseRouter
 */
const router = express.Router();

const {License} = require("../models/License");
const {User} = require("../models/User");
const {auth} = require("../middleware/auth");

/**
 * Route for creating new licenses.
 * @name POST/create
 * @function
 * @memberof module:routers/license~licenseRouter
 * @inner
 * @param {string} path - Express path
 * @param {middleware} auth - Auth middleware
 * @param {callback} cb - Callback function
 */
router.post("/create", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.user) throw Error('User is not authenticated.');
            if (req.user.role !== 1) throw Error('User does not have permission to perform this action.');

            const license = new License(req.body);

            const userId = req.user._id;

            const savedLicense = await license.save();

            await User.updateOne({_id: userId}, {$push: {licenses: savedLicense._id}});

            return res.status(201).json({
                success: true,
                license: savedLicense,
                licenseId,
            });

        } catch (e) {
            console.log(e);
            return res.status(400).json({success: false, msg: e.message});
        }
    } else {
        return res.status(401).json({
            success: false,
            msg: 'User is not authenticated.'
        });
    }
});

/**
 * Route for getting license info by id.
 * @name GET/getById
 * @function
 * @memberof module:routers/license~licenseRouter
 * @inner
 * @param {string} path - Express path
 * @param {middleware} auth - Auth middleware
 * @param {callback} cb - Callback function
 */
router.get("/getById", async (req, res) => {
    try {
        const licenseId = req.query.id;
        if (!licenseId) throw Error('License id is not present in request url.');

        const foundLicense = await License.findById(licenseId).select('-__v').exec();

        if (foundLicense === null) {
            throw Error('Cannot find a license by that id.');
        }

        return res.status(200).json({
            success: true,
            license: foundLicense,
            licenseId,
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({success: false, msg: e.message});
    }
});

/**
 * Route for getting all licenses of the current user.
 * @name GET/licenses
 * @function
 * @memberof module:routers/license~licenseRouter
 * @inner
 * @param {string} path - Express path
 * @param {middleware} auth - Auth middleware
 * @param {callback} cb - Callback function
 */
 router.get("/licenses", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.user) throw Error('User is not authenticated.');
            if (req.user.role !== 1) throw Error('User does not have permission to perform this action.');

            const licenses = await License.find({ '_id': { $in: req.user.licenses } }).select('-__v');
    
            return res.status(200).json({
                success: true,
                licenses: licenses
            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({success: false, msg: e.message});
        }
    }
    else {
        return res.status(401).json({
            success: false,
            msg: 'User is not authenticated.'
        });
    }
});

/**
 * Route for updating existing licenses.
 * Takes a query param id: document id for license.
 * @name PUT/update
 * @function
 * @memberof module:routers/license~licenseRouter
 * @inner
 * @param {string} path - Express path
 * @param {middleware} auth - Auth middleware
 * @param {callback} cb - Callback function
 */
router.put("/update", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.user) throw Error('User is not authenticated.');
            if (req.user.role !== 1) throw Error('User does not have permission to perform this action.');
            const licenseId = req.query.id;
            if (!licenseId) throw Error('License id is not present in request url.');

            const updatedLicense = await License.findOneAndUpdate(
                {_id: licenseId},
                req.body,
                {new: true}
            )
                .select('-__v')
                .exec();

            if (updatedLicense === null) {
                throw Error('Cannot find a license by that id.');
            }

            return res.status(200).json({
                success: true,
                license: updatedLicense,
                licenseId,
            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({success: false, msg: e.message});
        }
    } else {
        return res.status(401).json({
            success: false,
            msg: 'User is not authenticated.'
        });
    }
});


/**
 * Route for toggling enable/disable a license.
 * Takes a query param id: document id for license.
 * Takes a body param enabled: boolean
 * @name PUT/toggle
 * @function
 * @memberof module:routers/license~licenseRouter
 * @inner
 * @param {string} path - Express path
 * @param {middleware} auth - Auth middleware
 * @param {callback} cb - Callback function
 */
 router.put("/toggle", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.user) throw Error('User is not authenticated.');
            if (req.user.role !== 1) throw Error('User does not have permission to perform this action.');
            const licenseId = req.query.id;
            if (!licenseId) throw Error('License id is not present in request url.');

            const updatedLicense = await License.findOneAndUpdate({_id: licenseId}, [{$set: {enabled: {$not: "$enabled"}}}]).exec();

            if (updatedLicense == null || updatedLicense.ok === 0) {
                throw Error('Cannot find a license by that id.');
            }

            return res.status(200).json({
                success: true,
                licenseId,
            });
        } catch (e) {
            return res.status(400).json({success: false, msg: e.message});
        }
    } else {
        return res.status(401).json({
            success: false,
            msg: 'User is not authenticated.'
        });
    }
});

/**
 * Route for deleting licenses.
 * Takes a query param id: document id for license.
 * @name DELETE/delete
 * @function
 * @memberof module:routers/license~licenseRouter
 * @inner
 * @param {string} path - Express path
 * @param {middleware} auth - Auth middleware
 * @param {callback} cb - Callback function
 */
router.delete("/delete", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.user) throw Error('User is not authenticated.');
            if (req.user.role !== 1) throw Error('User does not have permission to perform this action.');
            const licenseId = req.query.id;
            if (!licenseId) throw Error('License id is not present in request url.');

            const deletionResult = await License.deleteOne({_id: licenseId});

            if (deletionResult.deletedCount === 0) {
                throw Error('License not found or cannot be deleted.');
            }
            
            const userId = req.user._id;
            await User.updateOne({_id: userId}, {$pull: {licenses: licenseId}});

            return res.status(200).json({
                success: true,
                licenseId,
            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({success: false, msg: e.message});
        }
    } else {
        return res.status(401).json({
            success: false,
            msg: 'User is not authenticated.'
        });
    }
});

module.exports = router;
