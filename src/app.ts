import express, { Application, Request, Response } from 'express';
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

export default app;
