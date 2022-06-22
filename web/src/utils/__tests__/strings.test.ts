import { formatGrade, formatOrdinal } from "@utils/strings";

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

  describe("formatGrade()", () => {
    describe("happy path", () => {
      test("should return correct output for various number grades", () => {
        expect(formatGrade("1", true)).toBe("1st");
        expect(formatGrade("2", true)).toBe("2nd");
        expect(formatGrade("3", true)).toBe("3rd");
        expect(formatGrade("4", true)).toBe("4th");
        expect(formatGrade("10", true)).toBe("10th");
        expect(formatGrade("    10    ", true)).toBe("10th");

        expect(formatGrade("1", false)).toBe("1st");
        expect(formatGrade("2", false)).toBe("2nd");
        expect(formatGrade("3", false)).toBe("3rd");
        expect(formatGrade("4", false)).toBe("4th");
        expect(formatGrade("10", false)).toBe("10th");
        expect(formatGrade("    10    ", false)).toBe("10th");
      });
      test("should return correct output for 'K'", () => {
        expect(formatGrade("k", false)).toBe("k");
        expect(formatGrade("K", false)).toBe("K");
        expect(formatGrade("    k    ", false)).toBe("k");
        expect(formatGrade("    K    ", false)).toBe("K");

        expect(formatGrade("k", true)).toBe("kindergarten");
        expect(formatGrade("K", true)).toBe("Kindergarten");
        expect(formatGrade("    k    ", true)).toBe("kindergarten");
        expect(formatGrade("    K    ", true)).toBe("Kindergarten");
      });
    });
    describe("sad path", () => {
      test("should handle bad/weird input gracefully", () => {
        expect(formatGrade("")).toBe("");
        expect(formatGrade(" ")).toBe(" ");
        expect(formatGrade("fooooo")).toBe("fooooo");
        expect(formatGrade("kk")).toBe("kk");
        expect(formatGrade("kindergarten")).toBe("kindergarten");

        expect(formatGrade("-10")).toBe("-10th");
        expect(formatGrade("0")).toBe("0th");
      });
    });
  });
});
