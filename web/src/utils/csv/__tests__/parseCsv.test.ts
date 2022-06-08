import { parseCsv, parseHhMm } from "../parseCsv";
import fs from "fs";
import path from "path";
import { AssignmentSubject } from "@generated/graphql";
import { CsvValidationError, CsvValidationErrorMessage } from "@utils/errors";

describe("parseCsv", () => {
  test("should parse a valid math and ela csv", async () => {
    const expected = [
      {
        cohortName: "a-1",
        googleClassroomLink: undefined,
        grade: "K",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "15:00",
            endTime: "16:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:00",
            endTime: "13:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "10:00",
            endTime: "12:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "14:00",
            endTime: "16:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "a-2",
        googleClassroomLink: undefined,
        grade: "K",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "b-1",
        googleClassroomLink: undefined,
        grade: "2",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "b-2",
        googleClassroomLink: undefined,
        grade: "3",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
        ],
      },
      {
        cohortName: "b-3",
        googleClassroomLink: undefined,
        grade: "4",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
        ],
      },
      {
        cohortName: "c-1",
        googleClassroomLink: undefined,
        grade: "5",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "c-2",
        googleClassroomLink: undefined,
        grade: "6",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "c-3",
        googleClassroomLink: undefined,
        grade: "7",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Ela,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "c-4",
        googleClassroomLink: undefined,
        grade: "8",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "12:30",
            endTime: "13:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "06:30",
            endTime: "07:30",
            timeZone: "EST",
          },
          {
            subject: AssignmentSubject.Math,
            startTime: "08:00",
            endTime: "09:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
    ];

    const readStream = fs.createReadStream(
      path.resolve(__dirname, "./valid-math-and-ela.csv")
    );

    expect(await parseCsv(readStream)).toEqual(expected);

    const casingReadStream = fs.createReadStream(
      path.resolve(__dirname, "./valid-math-and-ela-casing.csv")
    );

    expect(await parseCsv(casingReadStream)).toEqual(expected);
  });

  test("should parse a valid ela only csv", async () => {
    const expected = [
      {
        cohortName: "a-1",
        grade: "K",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "a-2",
        grade: "K",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "b-1",
        grade: "2",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "b-2",
        grade: "3",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
        ],
      },
      {
        cohortName: "b-3",
        grade: "4",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
        ],
      },
      {
        cohortName: "c-1",
        grade: "5",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "c-2",
        grade: "6",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "c-3",
        grade: "7",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "c-4",
        grade: "8",
        monday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Ela,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Ela,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
    ];

    const readStream = fs.createReadStream(
      path.resolve(__dirname, "./valid-ela-only.csv")
    );

    const result = await parseCsv(readStream);
    expect(result).toEqual(expected);
  });

  test("should parse a valid math only csv", async () => {
    const expected = [
      {
        cohortName: "a-1",
        grade: "K",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "a-2",
        grade: "K",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "b-1",
        grade: "2",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "b-2",
        grade: "3",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
        ],
      },
      {
        cohortName: "b-3",
        grade: "4",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
        ],
      },
      {
        cohortName: "c-1",
        grade: "5",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "c-2",
        grade: "6",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "c-3",
        grade: "7",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "c-4",
        grade: "8",
        monday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: AssignmentSubject.Math,
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: AssignmentSubject.Math,
            teacher: {
              fullName: "testemail 4",
              email: "testemail4@gmail.com",
            },
          },
        ],
      },
    ];

    const readStream = fs.createReadStream(
      path.resolve(__dirname, "./valid-math-only.csv")
    );

    const result = await parseCsv(readStream);
    expect(result).toEqual(expected);
  });

  test("should parse a valid gen only csv", async () => {
    const expected = [
      {
        cohortName: "gen1",
        grade: "8",
        monday: [
          {
            subject: "GENERAL",
            startTime: "14:00",
            endTime: "15:00",
            timeZone: "PST",
          },
        ],
        tuesday: [
          {
            subject: "GENERAL",
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "GENERAL",
            startTime: "14:00",
            endTime: "15:00",
            timeZone: "PST",
          },
        ],
        thursday: [
          {
            subject: "GENERAL",
            startTime: "10:00",
            endTime: "11:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: "GENERAL",
            startTime: "14:00",
            endTime: "15:00",
            timeZone: "PST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "GENERAL",
            teacher: {
              fullName: "Victor Merino",
              email: "victor@gmail.com",
            },
          },
        ],
      },
      {
        cohortName: "gen2",
        grade: "9",
        monday: [
          {
            subject: "GENERAL",
            startTime: "15:00",
            endTime: "16:00",
            timeZone: "PST",
          },
        ],
        tuesday: [
          {
            subject: "GENERAL",
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "GENERAL",
            startTime: "15:00",
            endTime: "16:00",
            timeZone: "PST",
          },
        ],
        thursday: [
          {
            subject: "GENERAL",
            startTime: "9:00",
            endTime: "10:00",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: "GENERAL",
            startTime: "15:00",
            endTime: "16:00",
            timeZone: "PST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "GENERAL",
            teacher: {
              fullName: "Eddie Vedder",
              email: "eddie@pj.com",
            },
          },
        ],
      },
      {
        cohortName: "gen3",
        grade: "10",
        monday: [
          {
            subject: "GENERAL",
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "GENERAL",
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "GENERAL",
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: "GENERAL",
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: "GENERAL",
            startTime: "11:30",
            endTime: "12:30",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "GENERAL",
            teacher: {
              fullName: "James Hetfield",
              email: "james@metal.com",
            },
          },
        ],
      },
      {
        cohortName: "gen4",
        grade: "11",
        monday: [
          {
            subject: "GENERAL",
            startTime: "11:15",
            endTime: "12:15",
            timeZone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "GENERAL",
            startTime: "12:30",
            endTime: "15:30",
            timeZone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "GENERAL",
            startTime: "11:15",
            endTime: "12:15",
            timeZone: "EST",
          },
        ],
        thursday: [
          {
            subject: "GENERAL",
            startTime: "12:30",
            endTime: "15:30",
            timeZone: "EST",
          },
        ],
        friday: [
          {
            subject: "GENERAL",
            startTime: "11:15",
            endTime: "12:15",
            timeZone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "GENERAL",
            teacher: {
              fullName: "MJ",
              email: "mj@bulls.win",
            },
          },
        ],
      },
    ];

    const readStream = fs.createReadStream(
      path.resolve(__dirname, "./valid-gen-only.csv")
    );

    const result = await parseCsv(readStream);
    expect(result).toEqual(expected);
  });

  test("should parse time correctly", () => {
    expect(parseHhMm("9:30")).toEqual("9:30");
    expect(parseHhMm("09:30")).toEqual("09:30");
    expect(parseHhMm("23:59")).toEqual("23:59");
    expect(parseHhMm("12:34")).toEqual("12:34");
    expect(parseHhMm("00:01")).toEqual("00:01");
    expect(getErrorMsg(() => parseHhMm("09:30"))).toEqual(undefined);
  });

  test("should fail to parse time", () => {
    expect(getErrorMsg(() => parseHhMm("0930"))).toEqual(
      CsvValidationErrorMessage.invalidTimeFormat
    );
    expect(getErrorMsg(() => parseHhMm("1:1"))).toEqual(
      CsvValidationErrorMessage.invalidTimeFormat
    );
    expect(getErrorMsg(() => parseHhMm("25:30"))).toEqual(
      CsvValidationErrorMessage.invalidTimeFormat
    );
    expect(getErrorMsg(() => parseHhMm("abcd"))).toEqual(
      CsvValidationErrorMessage.invalidTimeFormat
    );
    expect(getErrorMsg(() => parseHhMm(""))).toEqual(
      CsvValidationErrorMessage.invalidTimeFormat
    );
    expect(getErrorMsg(() => parseHhMm("09:68"))).toEqual(
      CsvValidationErrorMessage.invalidTimeFormat
    );
    expect(getErrorMsg(() => parseHhMm("12:"))).toEqual(
      CsvValidationErrorMessage.invalidTimeFormat
    );
  });
});

function getErrorMsg(parseTime: () => void): string | undefined {
  let errorMessage;

  try {
    parseTime();
  } catch (error: unknown) {
    if (error instanceof CsvValidationError) {
      errorMessage = error.message;
    } else {
      errorMessage = "Parsing Failed for unknown reason.";
    }
  }

  return errorMessage;
}
