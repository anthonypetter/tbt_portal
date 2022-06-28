import { calculateDurationInMinutes, stringifyTime } from "../dateTime";
import { getErrorMsg } from "../tests";

describe("dateTime utils", () => {
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
