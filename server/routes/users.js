const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, async (req, res) => {
    if (req.isAuth) {
        try {
            if (!req.user) throw Error('User does not exist');
            return res.status(200).json({
                _id: req.user._id,
                isAuth: true,
                email: req.user.email,
                username: req.user.username,
                role: req.user.role,
                image: req.user.image,
                cart: req.user.cart,
                history: req.user.history
            });
        } catch (e) {
            console.log(e)
            return res.status(400).json({ msg: e.message });
        }
    } else {
        return res.status(200).json({
            isAuth: false
        });
    }
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/registerAnon", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
            userId: user._id
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "Wrong password" });
            }

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res
                    .cookie("w_auth", user.token, { sameSite: "lax", httpOnly: true })
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.post("/loginAnon", (req, res) => {
    User.findOne({ _id: req.body.id }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, id not found"
            });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "Wrong password" });
            }

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    return res
        .cookie("w_auth", "", { expires: new Date(null) })
        .status(200)
        .send({
        success: true
    });
});

module.exports = router;
