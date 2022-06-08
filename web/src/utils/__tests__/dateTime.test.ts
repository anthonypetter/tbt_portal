/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  calculateMinutesElapsedInDay,
  findWeekdayNumber,
  localizedTime,
  localizedWeekdays,
  normalizeTime,
} from "../dateTime";

describe("dateTime", () => {
  describe("normalizeTime()", () => {
    describe("happy path", () => {
      test("should work with HH:mm", () => {
        expect(normalizeTime("12:30")).toBe("12:30");
      });

      test("should work with H:mm", () => {
        expect(normalizeTime("7:30")).toBe("07:30");
      });
    });

    describe("sad path", () => {
      test("should handle bad input gracefully", () => {
        expect(normalizeTime("")).toBe("00:00");
        expect(normalizeTime("blah")).toBe("00:00");
        expect(normalizeTime("99:99")).toBe("00:00");
      });
    });
  });

  describe("localizedTime()", () => {
    describe("happy path", () => {
      test("should return 24 hour mode for any locale", () => {
        expect(localizedTime("13:54", true)).toBe("13:54");
        expect(localizedTime("13:54", true, "en-US")).toBe("13:54");
        expect(localizedTime("13:54", true, "ro-RO")).toBe("13:54");
      });
      test("should return 12 hour mode for en-US locale", () => {
        expect(localizedTime("13:54", false, "en-US")).toBe("1:54 PM");
        expect(localizedTime("00:00", false, "en-US")).toBe("12:00 AM");
        expect(localizedTime("00:01", false, "en-US")).toBe("12:01 AM");
      });
      test("should return 12 hour mode for es-MX locale", () => {
        expect(localizedTime("13:54", false, "es-MX")).toMatch(/1:54 p.\sm./);
        expect(localizedTime("00:00", false, "es-MX")).toMatch(/0:00 a.\sm./);
        expect(localizedTime("00:01", false, "es-MX")).toMatch(/0:01 a.\sm./);
      });
      test("should return 12 hour mode for ro-RO locale", () => {
        expect(localizedTime("13:54", false, "ro-RO")).toBe("1:54 p.m.");
        expect(localizedTime("00:00", false, "ro-RO")).toBe("0:00 a.m.");
        expect(localizedTime("00:01", false, "ro-RO")).toBe("0:01 a.m.");
      });
    });
  });

  describe("calculateMinutesElapsedInDay()", () => {
    describe("happy path", () => {
      test("should calculate HH:mm times correctly", () => {
        expect(calculateMinutesElapsedInDay("00:00")).toBe(0);
        expect(calculateMinutesElapsedInDay("00:01")).toBe(1);
        expect(calculateMinutesElapsedInDay("01:00")).toBe(60);
        expect(calculateMinutesElapsedInDay("23:59")).toBe(1439);
      });

      test("should calculate H:mm times correctly", () => {
        expect(calculateMinutesElapsedInDay("0:00")).toBe(0);
        expect(calculateMinutesElapsedInDay("0:01")).toBe(1);
        expect(calculateMinutesElapsedInDay("1:00")).toBe(60);
        expect(calculateMinutesElapsedInDay("9:59")).toBe(599);
      });
    });

    describe("sad path", () => {
      test("should handle bad input gracefully", () => {
        expect(calculateMinutesElapsedInDay("")).toBe(0);
        expect(calculateMinutesElapsedInDay("blah")).toBe(0);
        expect(calculateMinutesElapsedInDay("99:99")).toBe(0);
      });
    });
  });

  describe("localizedWeekdays()", () => {
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
        const weekDays = localizedWeekdays("2022-06-01", "es-MX");
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
          "2022-01-01", // A Saturday.
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

  describe("findWeekdayNumber()", () => {
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
