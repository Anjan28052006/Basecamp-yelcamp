const express = require('express');
const router = express.Router();
const User = require('../module/user');
const passport = require('passport'); //1
const users = require('../controllers/users')

router.route('/register')
    .get(users.registerForm)
    .post(users.register)

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ error: true, status: 401, message: info?.message || 'Invalid username or password' });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return users.login(req, res);
        });
    })(req, res, next);
});
router.get('/login', users.loginForm)

router.get('/logout', users.logout);

router.get('/me', users.currentUser);

module.exports = router;
