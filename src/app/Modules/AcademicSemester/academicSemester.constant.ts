import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonth,
} from './academicSemester.interface';

export const Months: TMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSemesterName: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];

type TAcademicSemesterNameCodeMapper = {
  [key: string]: string;
};

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
