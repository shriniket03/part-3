const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as param')
  process.exit()
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@fso.9qgya.mongodb.net/?retryWrites=true&w=majority&appName=FSO`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phoneEntry = new mongoose.Schema({
  name: String,
  number: String
})

const Entry = mongoose.model('Entry',phoneEntry)

if (process.argv.length===3) {
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(entry.name + ' ' + entry.number)
    })
    mongoose.connection.close()
  })
}
else {
  const entryName = process.argv[3]
  const entryNumber = process.argv[4]
  if (entryName===undefined || entryNumber===undefined) {
    console.log('Give name & number as param')
    mongoose.connection.close()
  }
  else {
    const entry = new Entry({
      name: entryName,
      number: entryNumber
    })
    entry.save().then(() => {
      console.log(`added ${entryName} number ${entryNumber} to phonebook`)
      mongoose.connection.close()
    })
  }
}
