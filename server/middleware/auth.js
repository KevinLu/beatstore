const { User } = require("../models/User");
const jwt = require('jsonwebtoken');
const config = require("../config/key");

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;

  // Check for token
  if (!token) {
    //res.json({ isAuth: false, error: true });
    req.isAuth = false;
    //res.end();
    next();
    return;
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    // Add user from payload
    User.findById(decoded)
      .select('-password')
      .exec((err, user) => {
        if (err) {
          throw err;
        }
        req.isAuth = true;
        req.token = token;
        req.user = user;
        next();
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, isAuth: false, msg: 'Token is not valid.' });
    res.end();
  }
};

module.exports = { auth };
