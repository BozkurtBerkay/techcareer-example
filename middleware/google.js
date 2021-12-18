const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/user/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {

        User.findOne({ email: profile._json.email }, async (err, user) => {
            if (!user) {
                const passwordHash = await bcrypt.hash("techcareer", process.env.PASSWORD_KEY * 1)
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(), name: profile.displayName, email: profile._json.email, password: passwordHash,
                })

                newUser.save()
                return done(null, newUser)
            }
            
            return done(null, user)
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})