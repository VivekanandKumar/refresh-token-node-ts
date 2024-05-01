import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/router'
import infoRouter from './routes/infoRouter'
const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/', infoRouter);
app.use('/api/', router);

export default app;