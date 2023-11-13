const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');
require('dotenv').config();
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // Make sure this is properly set in your keys file or environment variables
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Make sure this is properly set in your keys file or environment variables
        callbackURL: '/auth/google/callback',
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }).then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new User({ googleId: profile.id })
              .save()
              .then((user) => done(null, user));
          }
        });
      }
    )
  );