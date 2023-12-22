import { z } from 'zod';

const userSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .optional(),
});

export const userValidation = {
  userSchema,
};
