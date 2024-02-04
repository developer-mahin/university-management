export const calculateMarksAndGrade = (marks: number) => {
  let result = {
    grade: 'NA',
    gradePoints: 0,
  };
  if (marks >= 0 && marks <= 19) {
    result = {
      grade: 'F',
      gradePoints: 0.0,
    };
  } else if (marks >= 20 && marks <= 39) {
    result = {
      grade: 'D',
      gradePoints: 2.0,
    };
  } else if (marks >= 40 && marks <= 59) {
    result = {
      grade: 'C',
      gradePoints: 3.0,
    };
  } else if (marks >= 60 && marks <= 79) {
    result = {
      grade: 'B',
      gradePoints: 3.5,
    };
  } else if (marks >= 80 && marks <= 100) {
    result = {
      grade: 'A',
      gradePoints: 4.0,
    };
  } else {
    result = {
      grade: 'NA',
      gradePoints: 0,
    };
  }

  return result;
};
