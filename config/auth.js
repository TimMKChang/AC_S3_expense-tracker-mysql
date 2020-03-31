module.exports = {
  authenticated: (req, res, next) => {
    // authenticate all routes except '/users/*'
    // const regex = RegExp('/users|/auth');
    // if (regex.test(req.originalUrl)) {
    //   return next()
    // }

    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', 'Please login first!')
    res.redirect('/user/login')
  }
}
