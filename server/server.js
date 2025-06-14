import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

// Initialize the express app
const app = express()

await connectDB()

// Middleware
app.use(cors())

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Course Management API')
})

app.post('/clerk', express.json(), clerkWebhooks)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 