import { z } from 'zod';

const userSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['in-progress', 'blocked']),
  }),
});

export const userValidation = {
  userSchema,
  changeStatusValidationSchema,
};
