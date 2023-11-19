import express, { Application, NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
const app: Application = express();
import cors from 'cors';
import { studentRoutes } from './app/Modules/Student/student.router';

// parser
app.use(express.json());
app.use(cors());

// get all routers
app.use('/api/v1/student', studentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello developer welcome the server',
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(500, 'Routes not found'));
});


app.use((error: any, req: Request, res: Response) => {
  return res.status(error.status || 500).json({
    success: false,
    message: error.message,
  });
});

export default app;
