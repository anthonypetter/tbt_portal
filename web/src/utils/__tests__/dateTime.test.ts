/* eslint-disable @typescript-eslint/ban-ts-comment */
import { localizedWeekdays, findWeekdayNumberOffset } from "../dateTime";

describe("dateTime", () => {
  describe("localizedWeekdays", () => {
    describe("happy path", () => {
      test("should work with default values", () => {
        const weekDays = localizedWeekdays();
        expect(weekDays.length).toBe(7);
      });

      test("should work with English (US) locale", () => {
        const weekDays = localizedWeekdays(new Date(), "en-US");
        expect(weekDays.length).toBe(7);
        expect(weekDays).toEqual(
          expect.objectContaining([
            {
              long: "Sunday",
              short: "Sun",
              narrow: "S",
              isoDate: expect.any(String),
            },
            {
              long: "Monday",
              short: "Mon",
              narrow: "M",
              isoDate: expect.any(String),
            },
            {
              long: "Tuesday",
              short: "Tue",
              narrow: "T",
              isoDate: expect.any(String),
            },
            {
              long: "Wednesday",
              short: "Wed",
              narrow: "W",
              isoDate: expect.any(String),
            },
            {
              long: "Thursday",
              short: "Thu",
              narrow: "T",
              isoDate: expect.any(String),
            },
            {
              long: "Friday",
              short: "Fri",
              narrow: "F",
              isoDate: expect.any(String),
            },
            {
              long: "Saturday",
              short: "Sat",
              narrow: "S",
              isoDate: expect.any(String),
            },
          ])
        );
      });

      test("should work with Spanish (Mexico) locale", () => {
        const weekDays = localizedWeekdays(new Date(), "es-MX");
        expect(weekDays.length).toBe(7);
        expect(weekDays).toEqual([
          {
            long: "domingo",
            short: "dom",
            narrow: "D",
            isoDate: expect.any(String),
          },
          {
            long: "lunes",
            short: "lun",
            narrow: "L",
            isoDate: expect.any(String),
          },
          {
            long: "martes",
            short: "mar",
            narrow: "M",
            isoDate: expect.any(String),
          },
          {
            long: "miércoles",
            short: "mié",
            narrow: "M",
            isoDate: expect.any(String),
          },
          {
            long: "jueves",
            short: "jue",
            narrow: "J",
            isoDate: expect.any(String),
          },
          {
            long: "viernes",
            short: "vie",
            narrow: "V",
            isoDate: expect.any(String),
          },
          {
            long: "sábado",
            short: "sáb",
            narrow: "S",
            isoDate: expect.any(String),
          },
        ]);
      });

      test("should work with English (US) locale and specific date", () => {
        const weekDays = localizedWeekdays(
          new Date(Date.UTC(2022, 0, 1)), // 0 = January, just FYI.
          "en-US"
        );
        expect(weekDays.length).toBe(7);
        expect(weekDays).toEqual([
          {
            long: "Sunday",
            short: "Sun",
            narrow: "S",
            isoDate: "2021-12-26",
          },
          {
            long: "Monday",
            short: "Mon",
            narrow: "M",
            isoDate: "2021-12-27",
          },
          {
            long: "Tuesday",
            short: "Tue",
            narrow: "T",
            isoDate: "2021-12-28",
          },
          {
            long: "Wednesday",
            short: "Wed",
            narrow: "W",
            isoDate: "2021-12-29",
          },
          {
            long: "Thursday",
            short: "Thu",
            narrow: "T",
            isoDate: "2021-12-30",
          },
          {
            long: "Friday",
            short: "Fri",
            narrow: "F",
            isoDate: "2021-12-31",
          },
          {
            long: "Saturday",
            short: "Sat",
            narrow: "S",
            isoDate: "2022-01-01",
          },
        ]);
      });
    });
  });

  describe("weekdayStartDayOffset", () => {
    describe("happy path", () => {
      test("should return correct indexes for Sunday (0) start day week", () => {
        expect(findWeekdayNumberOffset("sunday", 0)).toBe(0);
        expect(findWeekdayNumberOffset("monday", 0)).toBe(1);
        expect(findWeekdayNumberOffset("saturday", 0)).toBe(6);
      });

      test("should return correct indexes for Monday (1) start day week", () => {
        expect(findWeekdayNumberOffset("sunday", 1)).toBe(6);
        expect(findWeekdayNumberOffset("monday", 1)).toBe(0);
        expect(findWeekdayNumberOffset("saturday", 1)).toBe(5);
      });

      test("should return correct indexes for Saturday (6) start day week", () => {
        expect(findWeekdayNumberOffset("sunday", 6)).toBe(1);
        expect(findWeekdayNumberOffset("monday", 6)).toBe(2);
        expect(findWeekdayNumberOffset("saturday", 6)).toBe(0);
      });
    });

    describe("sad path", () => {
      test("should correctly handle a non-existent day", () => {
        // @ts-ignore
        expect(findWeekdayNumberOffset("blah", 0)).toBe(0);
      });
    });
  });
});
