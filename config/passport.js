const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'The email is not registered!' })
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err
            }
            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'The password is incorrect!' })
            }
          })

        })
    })
  )

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    function (accessToken, refreshToken, profile, done) {

      User.findOne({ email: profile._json.email })
        .then(user => {
          if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8)
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(randomPassword, salt, (err, hash) => {
                const newUser = new User({
                  name: profile._json.name,
                  email: profile._json.email,
                  password: hash
                })
                newUser.save()
                  .then(user => {
                    return done(null, user)
                  }).catch(err => {
                    console.log(err)
                  })
              })
            })
          } else {
            return done(null, user)
          }
        })

    }
  ));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile._json.email })
        .then(user => {
          if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8)
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(randomPassword, salt, (err, hash) => {
                const newUser = new User({
                  name: profile._json.name,
                  email: profile._json.email,
                  password: hash
                })
                newUser.save()
                  .then(user => {
                    return done(null, user)
                  }).catch(err => {
                    console.log(err)
                  })
              })
            })
          } else {
            return done(null, user)
          }
        })
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .exec((err, user) => {
        done(err, user)
      })
  })

}
