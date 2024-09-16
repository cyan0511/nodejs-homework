import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import contactsRouter from './routes/api/contactRoutes.js';
import usersRouter from './routes/api/userRoutes.js';
import {errorHandler} from "./middlewares/errorHandler.js";
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

//public distribution
app.use(express.static("public"));

app.use('/api/contacts', contactsRouter)
app.use('/api/users', usersRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

// Error-handling middleware
app.use(errorHandler);

export default app;
