const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String
  },
  category: {
    type: String
  },
  date: {
    type: String,
    default: Date()
  },
  amount: {
    type: Number,
  },
  merchant: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema)
