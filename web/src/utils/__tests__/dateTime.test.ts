/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getErrorMsg } from "@utils/tests";
import {
  calculateDurationInMinutes,
  calculateMinutesElapsedInDay,
  findWeekdayNumber,
  localizedTime,
  localizedWeekdays,
  normalizeDateFromUTCDateTime,
  normalizeTime,
  numberifyTime,
  printDuration,
  stringifyTime,
  Weekday,
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
        expect(findWeekdayNumber(Weekday.SUNDAY)).toBe(0);
        expect(findWeekdayNumber(Weekday.MONDAY)).toBe(1);
        expect(findWeekdayNumber(Weekday.TUESDAY)).toBe(2);
        expect(findWeekdayNumber(Weekday.WEDNESDAY)).toBe(3);
        expect(findWeekdayNumber(Weekday.THURSDAY)).toBe(4);
        expect(findWeekdayNumber(Weekday.FRIDAY)).toBe(5);
        expect(findWeekdayNumber(Weekday.SATURDAY)).toBe(6);
      });
    });

    describe("problem path", () => {
      test("should handle a bad input and return 0", () => {
        // @ts-ignore
        expect(findWeekdayNumber("blah")).toBe(0);
      });
    });
  });

  describe("printDuration()", () => {
    describe("happy path", () => {
      test("should return correct output for 60 minimum to hours cutoff", () => {
        expect(printDuration(0, 60)).toBe("0 min");
        expect(printDuration(5, 60)).toBe("5 min");
        expect(printDuration(60, 60)).toBe("1 hr");
        expect(printDuration(61, 60)).toBe("1 hr 1 min");
        expect(printDuration(120, 60)).toBe("2 hrs");
        expect(printDuration(121, 60)).toBe("2 hr 1 min");
      });

      test("should return correct output for 90 minimum to hours cutoff", () => {
        expect(printDuration(0, 90)).toBe("0 min");
        expect(printDuration(89, 90)).toBe("89 min");
        expect(printDuration(90, 90)).toBe("1 hr 30 min");
        expect(printDuration(91, 90)).toBe("1 hr 31 min");
      });
    });
  });

  describe("extractDateFromDateTime()", () => {
    describe("happy path", () => {
      test("should not convert to another date", () => {
        // Test machine running behind UTC would break.
        const midnight = new Date("2022-06-20T00:00:00Z");
        expect(normalizeDateFromUTCDateTime(midnight).getDate()).toBe(20);
        expect(normalizeDateFromUTCDateTime(midnight).getUTCDate()).toBe(20);

        // Test machine running ahead of UTC would break.
        const oneSecondToMidnight = new Date("2022-06-20T23:59:59Z");
        expect(
          normalizeDateFromUTCDateTime(oneSecondToMidnight).getDate()
        ).toBe(20);
        expect(
          normalizeDateFromUTCDateTime(oneSecondToMidnight).getUTCDate()
        ).toBe(20);
      });
    });
  });

  describe("numberifyTime()", () => {
    test("should return expected time values", () => {
      expect(numberifyTime("6:03")).toMatchObject({ hour: 6, minute: 3 });
      expect(numberifyTime("06:03")).toMatchObject({ hour: 6, minute: 3 });
    });

    test("should throw error time is incorrectly formatted.", () => {
      expect(getErrorMsg(() => numberifyTime(""))).toEqual(
        "Unrecognized time string format: empty string"
      );

      expect(getErrorMsg(() => numberifyTime("Blah"))).toEqual(
        "Unrecognized time string format: Blah"
      );

      expect(getErrorMsg(() => numberifyTime("1234"))).toEqual(
        "Unrecognized time string format: 1234"
      );

      expect(getErrorMsg(() => numberifyTime("6:3"))).toEqual(
        "Unrecognized time string format: 6:3"
      );

      expect(getErrorMsg(() => numberifyTime("0 6 : 3 0"))).toEqual(
        "Unrecognized time string format: 0 6 : 3 0"
      );
    });
  });

  describe("calculateDurationInMinutes()", () => {
    test("should calculation durations correctly", () => {
      expect(
        calculateDurationInMinutes(
          { hour: 0, minute: 0 },
          { hour: 23, minute: 59 }
        )
      ).toBe(1439);

      expect(
        calculateDurationInMinutes(
          { hour: 0, minute: 10 },
          { hour: 23, minute: 59 }
        )
      ).toBe(1429);

      expect(
        calculateDurationInMinutes(
          { hour: 5, minute: 15 },
          { hour: 6, minute: 30 }
        )
      ).toBe(75);

      expect(
        calculateDurationInMinutes(
          { hour: 12, minute: 7 },
          { hour: 12, minute: 8 }
        )
      ).toBe(1);

      expect(
        calculateDurationInMinutes(
          { hour: 0, minute: 0 },
          { hour: 0, minute: 0 }
        )
      ).toBe(0);
    });

    test("should throw an error if a negative duration is encountered", () => {
      expect(
        getErrorMsg(() =>
          calculateDurationInMinutes(
            { hour: 10, minute: 0 },
            { hour: 9, minute: 30 }
          )
        )
      ).toEqual("Negative durations are not supported.");

      expect(
        getErrorMsg(() =>
          calculateDurationInMinutes(
            { hour: 23, minute: 0 },
            { hour: 0, minute: 0 }
          )
        )
      ).toEqual("Negative durations are not supported.");

      expect(
        getErrorMsg(() =>
          calculateDurationInMinutes(
            { hour: 0, minute: 1 },
            { hour: 0, minute: 0 }
          )
        )
      ).toEqual("Negative durations are not supported.");
    });
  });

  describe("stringifyTime()", () => {
    test("should return expected time strings", () => {
      expect(stringifyTime({ hour: 0, minute: 0 })).toEqual("00:00");
      expect(stringifyTime({ hour: 6, minute: 25 })).toEqual("06:25");
      expect(stringifyTime({ hour: 1, minute: 24 })).toEqual("01:24");
      expect(stringifyTime({ hour: 14, minute: 14 })).toEqual("14:14");
      expect(stringifyTime({ hour: 23, minute: 59 })).toEqual("23:59");
    });

    test("should throw an error for invalid time values", () => {
      expect(getErrorMsg(() => stringifyTime({ hour: 24, minute: 0 }))).toEqual(
        "Invalid hour value encountered: 24"
      );

      expect(
        getErrorMsg(() => stringifyTime({ hour: 23, minute: 60 }))
      ).toEqual("Invalid minute value encountered: 60");

      expect(getErrorMsg(() => stringifyTime({ hour: 25, minute: 0 }))).toEqual(
        "Invalid hour value encountered: 25"
      );
      expect(
        getErrorMsg(() => stringifyTime({ hour: 12, minute: 65 }))
      ).toEqual("Invalid minute value encountered: 65");

      expect(
        getErrorMsg(() => stringifyTime({ hour: -1, minute: 30 }))
      ).toEqual("Invalid hour value encountered: -1");

      expect(
        getErrorMsg(() => stringifyTime({ hour: 7, minute: -30 }))
      ).toEqual("Invalid minute value encountered: -30");

      expect(
        getErrorMsg(() => stringifyTime({ hour: 100, minute: 7821 }))
      ).toEqual("Invalid hour value encountered: 100");
    });
  });
});
