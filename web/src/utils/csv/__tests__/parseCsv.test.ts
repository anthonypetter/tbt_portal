import { parseCsv } from "../parseCsv";
import fs from "fs";
import path from "path";

describe("parseCsv", () => {
  test("should parse a valid csv", async () => {
    const expected = [
      {
        cohortName: "a-1",
        googleClassroomLink: undefined,
        grade: "K",
        monday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "Math",
            startTime: "15:00",
            endTime: "16:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:00",
            endTime: "13:00",
            timezone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "Math",
            startTime: "10:00",
            endTime: "12:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "14:00",
            endTime: "16:00",
            timezone: "EST",
          },
        ],
        thursday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        friday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "ELA",
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: "MATH",
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
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        thursday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        friday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "ELA",
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
          {
            subject: "MATH",
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
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        thursday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        friday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "ELA",
            teacher: {
              fullName: "testemail 2",
              email: "testemail2@gmail.com",
            },
          },
          {
            subject: "MATH",
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
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        thursday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        friday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "ELA",
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
          {
            subject: "MATH",
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
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        thursday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        friday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "ELA",
            teacher: {
              fullName: "testemail 3",
              email: "testemail3@tutored.live",
            },
          },
          {
            subject: "MATH",
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
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        thursday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        friday: [
          {
            subject: "Math",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "ELA",
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: "MATH",
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
            subject: "ELA",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: "9:00",
            endTime: "10:00",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "10:00",
            endTime: "11:00",
            timezone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "ELA",
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: "MATH",
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
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        thursday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        friday: [
          {
            subject: "Math",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "ELA",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "ELA",
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: "MATH",
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
            subject: "ELA",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: "11:30",
            endTime: "12:30",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "12:30",
            endTime: "13:30",
            timezone: "EST",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: "06:30",
            endTime: "07:30",
            timezone: "EST",
          },
          {
            subject: "Math",
            startTime: "08:00",
            endTime: "09:00",
            timezone: "EST",
          },
        ],
        saturday: [],
        sunday: [],
        staffAssignments: [
          {
            subject: "ELA",
            teacher: {
              fullName: "testemail 1",
              email: "testemail1@gmail.com",
            },
          },
          {
            subject: "MATH",
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
});
