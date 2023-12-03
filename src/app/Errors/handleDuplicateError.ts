/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources } from '../interface/error';

const handleDuplicateError = (error: any) => {
  const match = error.message.match(/"([^"]*)"/);
  const extractMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractMessage} is already exists`,
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
