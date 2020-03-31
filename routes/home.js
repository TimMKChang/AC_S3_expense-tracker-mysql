const express = require('express')
const router = express.Router()

// homepage
router.get('/', (req, res) => {
  res.redirect('/record')
})

module.exports = router
