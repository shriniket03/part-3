const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(morgan('tiny'))
app.use(express.json())

morgan.token('response', (req) => { //creating id token
    if (req.method==="POST") {
        return JSON.stringify(req.body)
    }
    return ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response'))

data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request,response) => {
    response.json(data)
})

app.get('/info', (request,response) => {
    response.send(`<p>Phone book has info for ${data.length} people</p> 
    <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request,response) => {
    const id = request.params.id
    const entry = data.find(entry=>entry.id===id)
    response.json(entry)
})

app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id
    data = data.filter(entry=>entry.id!==id)
    response.status(204).end()
})

app.post('/api/persons', (request,response,next) => {
    const body = request.body
    console.log(body)
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
          })
    }
    else if (data.filter(entry=>entry.name===body.name).length > 0) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }
    const newRecord = {id:Math.floor(Math.random()*999999999), name:body.name, number:body.number}
    data = data.concat(newRecord)
    response.json(newRecord)
    next()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})