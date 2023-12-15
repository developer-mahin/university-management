import { z } from 'zod';

const createPreRequisiteCoursesSchema = z.object({
  course: z.string(),
  idDeleted: z.boolean(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credit: z.number(),
    preRequisiteCourses: z.array(createPreRequisiteCoursesSchema).optional(),
  }),
});

const updatePreRequisiteCoursesSchema = z.object({
  course: z.string().optional(),
  idDeleted: z.boolean().optional(),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credit: z.number().optional(),
    preRequisiteCourses: z.array(updatePreRequisiteCoursesSchema).optional(),
  }),
});

export const courseValidation = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
