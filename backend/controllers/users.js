const User = require('../module/user');
const passport = require('passport');

module.exports.registerForm = (req, res) => {
    res.json({ message: 'ok' });
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return res.status(500).json({ error: true, status: 500, message: err.message });
            }
            res.status(201).json({ message: 'Welcome to yel-camp', user: { _id: registeredUser._id, username: registeredUser.username, email: registeredUser.email } });
        })
    }
    catch (e) {
        res.status(400).json({ error: true, status: 400, message: e.message });
    }
}

module.exports.loginForm = (req, res) => {
    res.json({ message: 'ok' });
}

module.exports.login = (req, res) => {
    res.json({ message: 'welcome back', user: { _id: req.user._id, username: req.user.username, email: req.user.email } });
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json({ error: true, status: 500, message: err.message });
        }
        res.json({ message: 'Logged Out!!' });
    })
}

module.exports.currentUser = (req, res) => {
    if (req.user) {
        res.json({ user: { _id: req.user._id, username: req.user.username, email: req.user.email } });
    } else {
        res.json({ user: null });
    }
}
