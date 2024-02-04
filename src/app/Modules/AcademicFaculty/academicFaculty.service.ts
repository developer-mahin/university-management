import QueryBuilder from '../../QueryBuilder/QueryBuilder';
import { TAcademicFaculty } from './academicFaculty.interface';
import AcademicFaculty from './academicFaculty.model';

const createAcademicFaculty = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAcademicFaculties = async (query: Record<string, unknown>) => {
  const AcademicFacultySearchableFields = ['name'];
  const academicFacultyQuery = new QueryBuilder(AcademicFaculty.find({}), query)
    .search(AcademicFacultySearchableFields)
    .fields()
    .filter()
    .sort()
    .paginate();

  const result = await academicFacultyQuery.queryModel;
  const meta = await academicFacultyQuery.countTotal();

  return { meta, result };
};

const getSingleAcademicFaculty = async (id: string) => {
  const result = await AcademicFaculty.findOne({ _id: id });
  return result;
};

const updateAcademicFaculty = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const academicFacultyService = {
  createAcademicFaculty,
  getAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
