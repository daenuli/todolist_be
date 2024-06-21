const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const taskRouter = require('./routes/task')
const authRouter = require('./routes/auth')
const mongoose = require('mongoose')

dotenv.config()

const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(bodyParser.json())

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(() => console.log('MongoDB connection failed'))

app.use('/api/task', taskRouter)
app.use('/api/auth', authRouter)

app.use((req, res, next) => {
    res.status(404).send({ message: 'Not found' })
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})