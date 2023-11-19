import { NextFunction, Request, Response } from 'express';
import { studentServicer } from './student.services';
import StudentValidationSchema from './student.validation';
import createError from 'http-errors';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const student = req.body;
    if (!student) {
      throw createError(500, 'data not found');
    }

    // data validation with zod
    const parseDataFromZodValidation = StudentValidationSchema.parse(student);
    const result = await studentServicer.saveStudentInDB(
      parseDataFromZodValidation,
    );

    if (result === undefined) {
      throw createError(500, 'initial server error');
    } else {
      res.status(200).json({
        success: true,
        message: 'successfully created the user',
        data: result,
      });
    }
  } catch (error) {
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message;
      next(errorMessage);
    }
  }
};

const getALlStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await studentServicer.getALlStudentFromDB();
    res.status(200).json({
      success: true,
      message: 'successfully created the user',
      data: result,
    });
  } catch (error) {
    let errorMessage = 'Failed to do something exceptional';
    if (error instanceof Error) {
      errorMessage = error.message;
      next(errorMessage);
    }
  }
};
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await studentServicer.getSingleStudentFromDB(studentId);
    res.status(200).json({
      success: true,
      message: 'successfully created the user',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const studentController = {
  createStudent,
  getALlStudent,
  getSingleStudent,
};
