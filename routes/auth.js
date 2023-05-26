const express = require('express');
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');
const {isnotLogedIn} = require('../middleware/middlewares')


router.get('/signup', async (req, res) => {
res.render('auth/signup');});
router.post('/signup', async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({email, username});
        const newUser = await User.register(user, password);

    req.login(newUser, err => {
        if (err) {
            return next(err);
        }
        req.flash('success', `Welcome ${newUser.username}!`);
        res.redirect('/campgrounds');
    });

   
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
    
});
router.get('/login', isnotLogedIn, async (req, res) => {
    res.render('auth/login');
});
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true, failureFlash:true,  keepSessionInfo: true,}), async (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}!`);
    console.log(req.session)
    res.redirect(req.session.returnTo||'/campgrounds');
});
router.post('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err) }
    req.flash('success', 'You are logged out');
    res.redirect('/campgrounds');
})
});
module.exports = router;
