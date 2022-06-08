/* eslint-disable @typescript-eslint/ban-ts-comment */
import { findWeekdayNumber, localizedWeekdays } from "../dateTime";

describe("dateTime", () => {
  describe("localizedWeekdays", () => {
    describe("happy path", () => {
      test("should work with basic arguments", () => {
        const weekDays = localizedWeekdays("2022-06-01");
        expect(weekDays.length).toBe(7);
      });

      test("should work with English (US) locale", () => {
        const weekDays = localizedWeekdays("2022-06-01", "en-US");
        expect(weekDays.length).toBe(7);
        expect(weekDays).toEqual(
          expect.objectContaining([
            {
              long: "Sunday",
              short: "Sun",
              narrow: "S",
              isoDateTime: expect.any(String),
            },
            {
              long: "Monday",
              short: "Mon",
              narrow: "M",
              isoDateTime: expect.any(String),
            },
            {
              long: "Tuesday",
              short: "Tue",
              narrow: "T",
              isoDateTime: expect.any(String),
            },
            {
              long: "Wednesday",
              short: "Wed",
              narrow: "W",
              isoDateTime: expect.any(String),
            },
            {
              long: "Thursday",
              short: "Thu",
              narrow: "T",
              isoDateTime: expect.any(String),
            },
            {
              long: "Friday",
              short: "Fri",
              narrow: "F",
              isoDateTime: expect.any(String),
            },
            {
              long: "Saturday",
              short: "Sat",
              narrow: "S",
              isoDateTime: expect.any(String),
            },
          ])
        );
      });

      test("should work with Spanish (Mexico) locale", () => {
        const weekDays = localizedWeekdays("2022-06-01", "es-MX");
        expect(weekDays.length).toBe(7);
        expect(weekDays).toEqual([
          {
            long: "domingo",
            short: "dom",
            narrow: "D",
            isoDateTime: expect.any(String),
          },
          {
            long: "lunes",
            short: "lun",
            narrow: "L",
            isoDateTime: expect.any(String),
          },
          {
            long: "martes",
            short: "mar",
            narrow: "M",
            isoDateTime: expect.any(String),
          },
          {
            long: "miércoles",
            short: "mié",
            narrow: "M",
            isoDateTime: expect.any(String),
          },
          {
            long: "jueves",
            short: "jue",
            narrow: "J",
            isoDateTime: expect.any(String),
          },
          {
            long: "viernes",
            short: "vie",
            narrow: "V",
            isoDateTime: expect.any(String),
          },
          {
            long: "sábado",
            short: "sáb",
            narrow: "S",
            isoDateTime: expect.any(String),
          },
        ]);
      });

      test("should work with English (US) locale and specific date", () => {
        const weekDays = localizedWeekdays(
          "2022-01-01", // A Saturday.
          "en-US"
        );
        expect(weekDays.length).toBe(7);
        expect(weekDays).toEqual([
          {
            long: "Sunday",
            short: "Sun",
            narrow: "S",
            isoDateTime: expect.stringMatching(/^2021-12-26/),
          },
          {
            long: "Monday",
            short: "Mon",
            narrow: "M",
            isoDateTime: expect.stringMatching(/^2021-12-27/),
          },
          {
            long: "Tuesday",
            short: "Tue",
            narrow: "T",
            isoDateTime: expect.stringMatching(/^2021-12-28/),
          },
          {
            long: "Wednesday",
            short: "Wed",
            narrow: "W",
            isoDateTime: expect.stringMatching(/^2021-12-29/),
          },
          {
            long: "Thursday",
            short: "Thu",
            narrow: "T",
            isoDateTime: expect.stringMatching(/^2021-12-30/),
          },
          {
            long: "Friday",
            short: "Fri",
            narrow: "F",
            isoDateTime: expect.stringMatching(/^2021-12-31/),
          },
          {
            long: "Saturday",
            short: "Sat",
            narrow: "S",
            isoDateTime: expect.stringMatching(/^2022-01-01/),
          },
        ]);
      });
    });
  });

  describe("findWeekdayNumber", () => {
    describe("happy path", () => {
      test("should find any day of the week", () => {
        expect(findWeekdayNumber("sunday")).toBe(0);
        expect(findWeekdayNumber("monday")).toBe(1);
        expect(findWeekdayNumber("tuesday")).toBe(2);
        expect(findWeekdayNumber("wednesday")).toBe(3);
        expect(findWeekdayNumber("thursday")).toBe(4);
        expect(findWeekdayNumber("friday")).toBe(5);
        expect(findWeekdayNumber("saturday")).toBe(6);
      });
    });

    describe("problem path", () => {
      test("should handle a bad input and return 0", () => {
        // @ts-ignore
        expect(findWeekdayNumber("blah")).toBe(0);
      });
    });
  });
});
