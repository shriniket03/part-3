require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const phoneEntry = new mongoose.Schema({
    name: {
      type:String,
      minLength:3,
      required:true
    },
    number: {
      type:String,
      minLength:8,
      validate: {
        validator: function(v) {
          return /[0-9]{2,3}-[0-9]{1,}/.test(v)
        }
      },
      required:true
    }
})

phoneEntry.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Entry', phoneEntry)
