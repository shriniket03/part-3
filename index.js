
const Entry = require('./models/entry')

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const errorHandler = (error, request, response, next) => {
  // console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  else if (error.name === 'ValidationError') {
    return response.status(400).json({ fault: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


morgan.token('response', (req) => { //creating id token
  if (req.method==='POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response'))

app.get('/api/persons', (request,response) => {
  Entry.find({}).then(data => {
    response.json(data)
  })
})

app.get('/info', (request,response) => {
  Entry.find({}).then(data => {
    response.send(`<p>Phone book has info for ${data.length} people</p> 
  <p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request,response,next) => {
  const id = request.params.id
  Entry.findById(id).then(data => {
    if (data) {
      response.json(data)
    }
    else {
      response.status(404).end()
    }
  })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request,response,next) => {
  const id = request.params.id
  Entry.findByIdAndDelete(id).then(data => {
    if (data) {
      response.status(204).end()
    }
    else {
      response.status(404).end()
    }
  }).catch(error => {
    next(error)
  })
})

app.post('/api/persons', (request,response,next) => {
  const body = request.body

  const newRecord = new Entry({
    name: body.name,
    number: body.number
  })
  newRecord.save().then(() => {
    console.log(`added ${body.name} number ${body.number} to phonebook`)
    response.json(newRecord)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request,response,next) => {
  const id = request.params.id
  const body = request.body

  const updateRecord = {
    name: body.name,
    number:body.number
  }

  Entry.findByIdAndUpdate(id,updateRecord,{ new:true, runValidators: true, context:'query' }).then(data => {
    response.json(data)
  }).catch(error => next(error))

})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})