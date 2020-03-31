const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const passport = require('passport')
const bcrypt = require('bcryptjs')

// login page
router.get('/login', (req, res) => {
  return res.render('login')
})
// login check
router.post('/login', (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    req.flash('warning_msg', 'Please enter your email and password!')
    return res.redirect('/user/login')
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('warning_msg', info.message)
      return res.redirect('/user/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next)
})
// register page
router.get('/register', (req, res) => {
  return res.render('register')
})
// register check
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body

  let errors = []

  if (!name || !email || !password || !password2) {
    errors.push({ message: 'All fields are required!' })
  }

  if (password && password2 && password !== password2) {
    errors.push({ message: 'Inconsistent Passwords!' })
  }

  if (errors.length > 0) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  }

  User.findOne({ where: { email: email } })
    .then(user => {
      if (user) {

        errors.push({ message: 'The email address is already registered!' })

        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          name,
          email,
          password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err
            }
            newUser.password = hash

            newUser
              .save()
              .then(user => {
                return res.redirect('/user/login')
              })
              .catch(err => {
                console.log(err)
              })
          })
        })

      }
    })
})
// logout
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', 'You have been successfully logged out!')
  return res.redirect('/user/login')
})

module.exports = router
