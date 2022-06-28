import { normalizeToUtcDate } from "@utils/dateTime";
import { CsvValidationError, CsvValidationErrorMessage } from "@utils/errors";
import fs from "fs";
import path from "path";
import { parseCsv, parseHhMm } from "../parseCsv";
import { parseDates } from "../validateCsv";

describe("parseCsv", () => {
  test("should parse a valid math and ela csv", async () => {
    const startDate = normalizeToUtcDate(new Date("6/27/2022"));
    const endDate = normalizeToUtcDate(new Date("7/27/2022"));

    const expected = [
      {
        cohortName: "a-1",
        grade: "K",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 15,
              minute: 0,
            },
            endTime: {
              hour: 16,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 0,
            },
            endTime: {
              hour: 13,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 12,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 14,
              minute: 0,
            },
            endTime: {
              hour: 16,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
        grade: "K",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
        grade: "2",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
        grade: "3",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
        grade: "4",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
        grade: "5",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
        grade: "6",
        monday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
        grade: "7",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "ELA",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
        grade: "8",
        monday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 13,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 6,
              minute: 30,
            },
            endTime: {
              hour: 7,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
          {
            subject: "MATH",
            startTime: {
              hour: 8,
              minute: 0,
            },
            endTime: {
              hour: 9,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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

    expect(
      await parseCsv({
        data: readStream,
        startDate,
        endDate,
      })
    ).toEqual(expected);

    const casingReadStream = fs.createReadStream(
      path.resolve(__dirname, "./valid-math-and-ela-casing.csv")
    );

    expect(
      await parseCsv({
        data: casingReadStream,
        startDate,
        endDate,
      })
    ).toEqual(expected);
  });

  test("should parse a valid ela only csv", async () => {
    const startDate = normalizeToUtcDate(new Date("8/1/2022"));
    const endDate = normalizeToUtcDate(new Date("9/1/2022"));

    const expected = [
      {
        cohortName: "a-1",
        grade: "K",
        monday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
          {
            subject: "ELA",
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
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
          {
            subject: "ELA",
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
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
          {
            subject: "ELA",
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
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
          {
            subject: "ELA",
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
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
          {
            subject: "ELA",
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
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
          {
            subject: "ELA",
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
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
          {
            subject: "ELA",
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
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
          {
            subject: "ELA",
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
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "ELA",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
          {
            subject: "ELA",
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

    const result = await parseCsv({
      data: readStream,
      startDate,
      endDate,
    });

    expect(result).toEqual(expected);
  });

  test("should parse a valid math only csv", async () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2023"));
    const endDate = normalizeToUtcDate(new Date("6/1/2023"));

    const expected = [
      {
        cohortName: "a-1",
        grade: "K",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
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
        grade: "K",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
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
        grade: "2",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
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
        grade: "3",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
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
        grade: "4",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
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
        grade: "5",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
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
        grade: "6",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
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
        grade: "7",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
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
        grade: "8",
        monday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "MATH",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
        staffAssignments: [
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
      path.resolve(__dirname, "./valid-math-only.csv")
    );

    const result = await parseCsv({
      data: readStream,
      startDate,
      endDate,
    });

    expect(result).toEqual(expected);
  });

  test("should parse a valid gen only csv", async () => {
    const startDate = normalizeToUtcDate(new Date("2/25/2023"));
    const endDate = normalizeToUtcDate(new Date("4/17/2023"));

    const expected = [
      {
        cohortName: "gen1",
        grade: "8",
        monday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 14,
              minute: 0,
            },
            endTime: {
              hour: 15,
              minute: 0,
            },
            timeZone: "America/Los_Angeles",
          },
        ],
        tuesday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 14,
              minute: 0,
            },
            endTime: {
              hour: 15,
              minute: 0,
            },
            timeZone: "America/Los_Angeles",
          },
        ],
        thursday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 10,
              minute: 0,
            },
            endTime: {
              hour: 11,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 14,
              minute: 0,
            },
            endTime: {
              hour: 15,
              minute: 0,
            },
            timeZone: "America/Los_Angeles",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
            startTime: {
              hour: 15,
              minute: 0,
            },
            endTime: {
              hour: 16,
              minute: 0,
            },
            timeZone: "America/Los_Angeles",
          },
        ],
        tuesday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 15,
              minute: 0,
            },
            endTime: {
              hour: 16,
              minute: 0,
            },
            timeZone: "America/Los_Angeles",
          },
        ],
        thursday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 9,
              minute: 0,
            },
            endTime: {
              hour: 10,
              minute: 0,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 15,
              minute: 0,
            },
            endTime: {
              hour: 16,
              minute: 0,
            },
            timeZone: "America/Los_Angeles",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 11,
              minute: 30,
            },
            endTime: {
              hour: 12,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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
            startTime: {
              hour: 11,
              minute: 15,
            },
            endTime: {
              hour: 12,
              minute: 15,
            },
            timeZone: "America/New_York",
          },
        ],
        tuesday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 15,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        wednesday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 11,
              minute: 15,
            },
            endTime: {
              hour: 12,
              minute: 15,
            },
            timeZone: "America/New_York",
          },
        ],
        thursday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 12,
              minute: 30,
            },
            endTime: {
              hour: 15,
              minute: 30,
            },
            timeZone: "America/New_York",
          },
        ],
        friday: [
          {
            subject: "GENERAL",
            startTime: {
              hour: 11,
              minute: 15,
            },
            endTime: {
              hour: 12,
              minute: 15,
            },
            timeZone: "America/New_York",
          },
        ],
        saturday: [],
        sunday: [],
        cohortStartDate: startDate.getTime(),
        cohortEndDate: endDate.getTime(),
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

    const result = await parseCsv({
      data: readStream,
      startDate,
      endDate,
    });

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

  test("should fail to parse dates", () => {
    expect(getErrorMsg(() => parseDates(null, null))).toEqual(
      "Unable to detect start/end dates."
    );

    expect(getErrorMsg(() => parseDates(undefined, "1234568423"))).toEqual(
      "Unable to detect start/end dates."
    );

    expect(getErrorMsg(() => parseDates(0, 0))).toEqual(
      "Unable to detect start/end dates."
    );

    expect(getErrorMsg(() => parseDates("null", "null"))).toEqual(
      "Unable to detect start/end dates."
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
