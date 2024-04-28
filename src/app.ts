import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/router'

const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/', router);

export default app;