import QueryBuilder from '../../QueryBuilder/QueryBuilder';
import { TAcademicDepartment } from './academicDepartment.interface';
import AcademicDepartment from './academicDepartment.model';

const createAcademicDepartment = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartment = async (query: Record<string, unknown>) => {
  const AcademicDepartmentSearchableFields = ['name'];
  const academicDepartmentQuery = new QueryBuilder(
    AcademicDepartment.find({}).populate('academicFaculty'),
    query,
  )
    .search(AcademicDepartmentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await academicDepartmentQuery.queryModel;
  const meta = await academicDepartmentQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleAcademicDepartment = async (id: string) => {
  const result = await AcademicDepartment.findOne({ _id: id }).populate(
    'academicFaculty',
  );
  return result;
};

const updateAcademicDepartment = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true },
  );
  return result;
};

export const academicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
