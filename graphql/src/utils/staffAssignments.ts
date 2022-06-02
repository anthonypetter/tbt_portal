import differenceBy from "lodash/differenceBy";

export function findToDelete<StaffInput extends { userId: number }>({
  existingStaff,
  newStaff,
}: {
  existingStaff: StaffInput[];
  newStaff: StaffInput[];
}) {
  const assignmentsToDelete = differenceBy(
    existingStaff, //The array to inspect
    newStaff, //The values to exclude
    (teacher) => teacher.userId
  );

  return assignmentsToDelete;
}

export function findToAdd<StaffInput extends { userId: number }>({
  existingStaff,
  newStaff,
}: {
  existingStaff: StaffInput[];
  newStaff: StaffInput[];
}) {
  const assignmentsToAdd = differenceBy(
    newStaff, //The array to inspect
    existingStaff, //The values to exclude
    (teacher) => teacher.userId
  );

  return assignmentsToAdd;
}
