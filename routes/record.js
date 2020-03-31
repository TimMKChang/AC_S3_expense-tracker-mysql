const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const Record = db.Record
const hasSpecialCharacters = require('../public/javascripts/hasSpecialCharacters')
const Sequelize = require("sequelize")
const { Op } = require("sequelize")

// '/restaurants/*' all should be authenticated
const { authenticated } = require('../config/auth')
router.all('*', authenticated)

// read all page
router.get('/', (req, res) => {

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const month = req.query.month || ''
  let _regex_date = '.'
  if (month) {
    _regex_date = `[0-9]{4}-${month}-[0-9]{2}`
  }

  const category = req.query.category || ''
  let _regex_category = '.'
  if (category) {
    _regex_category = category
  }

  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")
      return Record.findAll({
        raw: true,
        nest: true,
        where: {
          userId: req.user.id,
          date: { [Op.regexp]: _regex_date },
          category: { [Op.regexp]: _regex_category },
          deleted_at: '0'
        },
        order: [
          ['date', 'DESC']
        ]
      })
    })
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
    UserId: req.user.id
  })

  record.save()
    .then(() => {
      return res.redirect('/record')
    })
    .catch(err => {
      console.log(err)
    })

})
// read update page
router.get('/:id/edit', (req, res) => {

  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")
      return Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
    })
    .then(record => {

      // category selected
      let options = ['Housing', 'Transportation', 'Entertainment', 'Food', 'Others']
      options.forEach(option => {
        if (option === record.category) {
          record[`option${option}`] = true
        }
      })

      return res.render('edit', { record: record.get() })
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

  Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
    .then(record => {
      record.name = req.body.name
      record.category = req.body.category
      record.date = req.body.date
      record.amount = req.body.amount
      record.merchant = req.body.merchant

      return record.save()
    })
    .then(record => {
      return res.redirect('/record')
    })
    .catch(err => {
      return console.error(err)
    })

})
// delete
router.delete('/:id', (req, res) => {
  Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
    .then(record => {
      record.deleted_at = new Date().toString()
      return record.save()
    })
    .then(record => {
      return res.redirect('/record')
    })
    .catch(err => {
      return console.error(err)
    })
})

module.exports = router
