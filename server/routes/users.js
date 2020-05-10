const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Beat } = require("../models/Beat");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, async (req, res) => {
    try {
        var user = await User.findById(req.user._id).select('-password');
        if (!user) throw Error('User does not exist');
        res.status(200).json({
            _id: user._id,
            isAuth: true,
            isAnonymous: user.isAnonymous,
            email: user.email,
            username: user.username,
            role: user.role,
            image: user.image,
            cart: user.cart,
            history: user.history
        });
    } catch (e) {
        console.log(e)
        res.status(400).json({ msg: e.message });
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
                    .cookie("w_auth", user.token)
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
    return res.status(200).send({
        success: true
    });
});

router.post("/addToCart", auth, (req, res) => { // doesn't have to be logged in
    if (res.statusCode === 401) { 
        // use localstorage
    } else {
        User.findOne({ _id: req.user._id }, (err, userInfo) => {
            let duplicateItem = false;

            userInfo.cart.forEach((item) => {
                if (item.id === req.query.beatId) { // beat already in cart
                    duplicateItem = true;
                }
            });

            if (duplicateItem) {
                User.findOneAndUpdate(
                    { _id: req.user._id, "cart.id": req.query.beatId },
                    { $inc: { "cart.$.quantity": 1 } },
                    { new: true },
                    (err, userInfo) => {
                        if (err) {
                            return res.json({ success: false, err });
                        }
                        res.status(200).json(userInfo.cart);
                    }
                );
            } else {
                User.findOneAndUpdate(
                    { _id: req.user._id },
                    {
                        $push: {
                            cart: {
                                id: req.query.beatId,
                                quantity: 1,
                                date: Date.now()
                            }
                        }
                    },
                    { new: true },
                    (err, userInfo) => {
                        if (err) return res.json({ success: false, err });
                        res.status(200).json(userInfo.cart);
                    }
                )
            }
        })
    }
})

router.get("/removeFromCart", auth, (req, res) => {
    let itemId = req.query.id;

    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": itemId } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let idArray = cart.map(item => {
                return item.id
            })

            Beat.find({ '_id': { $in: idArray } })
                .populate('producer')
                .exec((err, cartDetail) => {
                    return res.status(200).json({
                        cartDetail,
                        cart
                    })
                })

        }
    )
})

module.exports = router;
