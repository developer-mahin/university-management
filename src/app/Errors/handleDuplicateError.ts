/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const match = error.message.match(/"([^"]*)"/);
  const message = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${message} is already exists`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Duplicate error',
    errorSources,
  };
};

export default handleDuplicateError;
