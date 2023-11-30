/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';

// parser
app.use(express.json());
app.use(cors());

// get all routers
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello developer welcome the server',
  });
});

// not found middleware
app.use(notFound);

// global error handling middleware
app.use(globalErrorHandler);

// app.use((
//   error: any,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const statusCode = error.status || 500;
//   const message = error.message || 'something went wrong';

//   return res.status(statusCode).json({
//     success: false,
//     message: message,
//     error,
//   });
// });

export default app;
