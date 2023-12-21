/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

// parser
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// get all routers
app.use('/api/v1', router);

app.get('/', async (req: Request, res: Response) => {
  res.json({
    message: 'Hello developer welcome the server',
  });
});

// not found middleware
app.use(notFound);

// global error handling middleware
app.use(globalErrorHandler);

export default app;
