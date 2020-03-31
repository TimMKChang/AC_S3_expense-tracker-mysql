const express = require('express')
const router = express.Router()
const Record = require('../models/record')
const hasSpecialCharacters = require('../public/javascripts/hasSpecialCharacters')

// '/restaurants/*' all should be authenticated
const { authenticated } = require('../config/auth')
router.all('*', authenticated)

// read all page
router.get('/', (req, res) => {

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const month = req.query.month || ''
  let _regex_date = new RegExp('');
  if (month) {
    _regex_date = new RegExp(`[0-9]{4}-${month}-[0-9]{2}`);
  }

  const category = req.query.category || ''
  const _regex_category = new RegExp(category);

  Record.find({ userId: req.user._id, date: { $regex: _regex_date }, category: { $regex: _regex_category } })
    .sort({ date: 'desc' })
    .lean()
    .then(records => {

      // get total amount
      let totalAmount = 0
      const iconsClass = {
        Housing: 'fas fa-home',
        Transportation: 'fas fa-shuttle-van',
        Entertainment: 'fas fa-grin-beam',
        Food: 'fas fa-utensils',
        Others: 'fas fa-pen'
      }

      records.forEach(record => {
        totalAmount += record.amount
        record.iconClass = iconsClass[record.category]
      })

      // res.locals
      res.locals.indexHandlebars = true

      return res.render('index', { records, totalAmount, category, months, month })
    })
    .catch(err => {
      return console.error(err)
    })
})
// read create page
router.get('/new', (req, res) => {
  return res.render('new')
})
// create
router.post('/', (req, res) => {

  const newRecord = req.body
  // category selected
  let options = ['Housing', 'Transportation', 'Entertainment', 'Food', 'Others']
  options.forEach(option => {
    if (option === newRecord.category) {
      newRecord[`option${option}`] = true
    }
  })
  // avoid special characters
  if (hasSpecialCharacters(newRecord.merchant) || hasSpecialCharacters(newRecord.name)) {
    newErrorMsg = 'There are invalid characters in your input should be avoided!'
    return res.render('new', { newRecord, newErrorMsg })
  }
  // check each input category date amount
  _regex_date = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
  if (!options.includes(newRecord.category) || !_regex_date.test(newRecord.date) || isNaN(newRecord.amount)) {
    newErrorMsg = 'There are invalid characters in your input should be avoided!'
    return res.render('new', { newRecord, newErrorMsg })
  }

  const record = new Record({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
    merchant: req.body.merchant,
    userId: req.user._id
  })

  record.save(err => {
    if (err) {
      return console.error(err)
    }
    return res.redirect('/record')
  })

})
// read update page
router.get('/:id/edit', (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .then(record => {

      // category selected
      let options = ['Housing', 'Transportation', 'Entertainment', 'Food', 'Others']
      options.forEach(option => {
        if (option === record.category) {
          record[`option${option}`] = true
        }
      })

      return res.render('edit', { record })
    })
    .catch(err => {
      return console.error(err)
    })
})
// updete
router.put('/:id', (req, res) => {

  const newRecord = req.body
  // category selected
  let options = ['Housing', 'Transportation', 'Entertainment', 'Food', 'Others']
  options.forEach(option => {
    if (option === newRecord.category) {
      newRecord[`option${option}`] = true
    }
  })
  // avoid special characters
  if (hasSpecialCharacters(newRecord.merchant) || hasSpecialCharacters(newRecord.name)) {
    newErrorMsg = 'There are invalid characters in your input should be avoided!'
    return res.render('new', { newRecord, newErrorMsg })
  }
  // check each input category date amount
  _regex_date = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
  if (!options.includes(newRecord.category) || !_regex_date.test(newRecord.date) || isNaN(newRecord.amount)) {
    newErrorMsg = 'There are invalid characters in your input should be avoided!'
    return res.render('new', { newRecord, newErrorMsg })
  }

  Record.findOne({ _id: req.params.id, userId: req.user._id })
    .then(record => {
      record.name = req.body.name
      record.category = req.body.category
      record.date = req.body.date
      record.amount = req.body.amount
      record.merchant = req.body.merchant

      record.save(err => {
        if (err) {
          return console.error(err)
        }
        return res.redirect('/record')
      })
    })
    .catch(err => {
      return console.error(err)
    })
})
// delete
router.delete('/:id', (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id })
    .then(record => {
      record.remove(err => {
        if (err) {
          return console.error(err)
        }
        return res.redirect('/record')
      })
    })
    .catch(err => {
      return console.error(err)
    })
})

module.exports = router
