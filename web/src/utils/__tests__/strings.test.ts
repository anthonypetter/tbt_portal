import { formatOrdinal } from "@utils/strings";

describe("strings", () => {
  describe("formatOrdinals()", () => {
    describe("happy path", () => {
      test("should work with basic numbers", () => {
        expect(formatOrdinal(1)).toBe("1st");
        expect(formatOrdinal(2)).toBe("2nd");
        expect(formatOrdinal(3)).toBe("3rd");
        expect(formatOrdinal(4)).toBe("4th");
        expect(formatOrdinal(10)).toBe("10th");
      });

      test("should work with zero", () => {
        expect(formatOrdinal(0)).toBe("0th");
      });

      test("should work with negative numbers", () => {
        expect(formatOrdinal(-1)).toBe("-1st");
        expect(formatOrdinal(-2)).toBe("-2nd");
        expect(formatOrdinal(-3)).toBe("-3rd");
        expect(formatOrdinal(-4)).toBe("-4th");
        expect(formatOrdinal(-10)).toBe("-10th");
      });
    });
  });
});
