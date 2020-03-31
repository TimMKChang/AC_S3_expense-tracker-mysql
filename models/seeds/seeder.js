const mongoose = require('mongoose')
const Record = require('../record')
const User = require('../user')
const recordSeeds = require('../../record.json')
const bcrypt = require('bcryptjs')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/AC_S3_expense_tracker', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {

  const users = [
    {
      name: 'user1',
      email: 'user1@example.com',
      password: '123456',
      record_id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }
  ]

  async function createOneUser(user) {
    const { name, email, password } = user
    const newUser = new User({
      name,
      email,
      password,
    })

    // restore example users and records to default
    let existUser
    await User.findOne({ email: email })
      .then(user => {
        if (user) {
          existUser = user
        }
      })

    if (existUser) {
      await Record.deleteMany({ userId: existUser._id }, function (err) {
        if (err) return console.log(err)
      })
      await User.deleteOne({ _id: existUser._id }, function (err) {
        if (err) return console.log(err)
      })
    }

    newUser.password = await new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      })
    })

    await newUser
      .save()
      .then(async user => {

        const record_id = users.find(element => element.email === user.email).record_id

        async function createOneItem(id) {

          const record = recordSeeds.results.find(element => element.id === id)
          await Record.create({
            name: record.name,
            category: record.category,
            amount: record.amount,
            date: record.date,
            merchant: record.merchant,
            userId: user._id
          })

        }

        async function createItems(ids) {
          for (const id of ids) {
            await createOneItem(id);
          }
        }

        await createItems(record_id)
      })
      .catch(err => {
        console.log(err)
      })

  }

  const promises = []

  for (const user of users) {
    promises.push(createOneUser(user))
  }

  Promise.all(promises)
    .then(() => {
      mongoose.connection.close()
      console.log('Seeds had been created.')
    })

})
