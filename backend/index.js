const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')

connectToMongo()

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())//middleware to use json in req.body

//Avaliable routes
app.use('/api/note', require('./routes/notes'))
app.use('/api/auth', require('./routes/auth'))

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})