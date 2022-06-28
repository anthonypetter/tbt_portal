import { normalizeToUtcDate } from "@utils/dateTime";
import { CsvValidationErrorMessage } from "@utils/errors";
import fs from "fs";
import path from "path";
import { validate, validateCsv } from "../validateCsv";

describe("csvValidation", () => {
  test("should detect invalid format for null", () => {
    const startDate = normalizeToUtcDate(new Date("8/1/2022"));
    const endDate = normalizeToUtcDate(new Date("9/1/2022"));

    const { errors } = validateCsv({
      unvalidatedCsv: null,
      startDate,
      endDate,
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect invalid format for undefined", () => {
    const startDate = normalizeToUtcDate(new Date("8/1/2022"));
    const endDate = normalizeToUtcDate(new Date("9/1/2022"));

    const { errors } = validateCsv({
      unvalidatedCsv: undefined,
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect invalid format for empty object", () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"));
    const endDate = normalizeToUtcDate(new Date("1/1/2023"));

    const { errors } = validateCsv({
      unvalidatedCsv: {},
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect invalid format for random string", () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"));
    const endDate = normalizeToUtcDate(new Date("1/1/2023"));

    const { errors } = validateCsv({
      unvalidatedCsv: "random string",
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect invalid format for random number", () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"));
    const endDate = normalizeToUtcDate(new Date("1/1/2023"));

    const { errors } = validateCsv({
      unvalidatedCsv: 1234,
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect empty array", () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"));
    const endDate = normalizeToUtcDate(new Date("1/1/2023"));

    const { errors } = validateCsv({
      unvalidatedCsv: [],
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.emptyData);
  });

  test("should detect empty CSV", async () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"))
      .getTime()
      .toString();
    const endDate = normalizeToUtcDate(new Date("1/1/2023"))
      .getTime()
      .toString();

    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-empty.csv")
    );

    const { errors } = await validate({
      data: readstream,
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.emptyData);
  });

  test("should detect missing header", async () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"))
      .getTime()
      .toString();
    const endDate = normalizeToUtcDate(new Date("1/1/2023"))
      .getTime()
      .toString();

    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-missing-header.csv")
    );

    const { errors } = await validate({
      data: readstream,
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.rowLengthMismatch);
  });

  test("should detect row column mismatch", async () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"))
      .getTime()
      .toString();
    const endDate = normalizeToUtcDate(new Date("1/1/2023"))
      .getTime()
      .toString();

    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-row-column-mismatch.csv")
    );

    const { errors } = await validate({
      data: readstream,
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.rowLengthMismatch);
  });

  test("should detect a missing column due to typo", async () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"))
      .getTime()
      .toString();
    const endDate = normalizeToUtcDate(new Date("1/1/2023"))
      .getTime()
      .toString();

    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-header-typo.csv")
    );

    const { errors } = await validate({
      data: readstream,
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    const error = errors[0];
    expect(error.message).toBe(CsvValidationErrorMessage.missingRequiredColumn);
    expect(error.hint).toBe("Columns: cohort");
  });

  test("should detect multiple missing columns", async () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"))
      .getTime()
      .toString();
    const endDate = normalizeToUtcDate(new Date("1/1/2023"))
      .getTime()
      .toString();

    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-missing-required-columns.csv")
    );

    const { errors } = await validate({
      data: readstream,
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    const error = errors[0];
    expect(error.message).toBe(CsvValidationErrorMessage.missingRequiredColumn);
    expect(error.hint).toBe("Columns: grade, monday, tuesday, wednesday");
  });

  test("should pass validation when optional columns are missing", async () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"))
      .getTime()
      .toString();
    const endDate = normalizeToUtcDate(new Date("1/1/2023"))
      .getTime()
      .toString();

    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./valid-missing-optional-columns.csv")
    );

    const { errors } = await validate({
      data: readstream,
      startDate,
      endDate,
    });

    expect(errors.length).toEqual(0);
  });

  test("should fail due to mismatched column data", async () => {
    const startDate = normalizeToUtcDate(new Date("1/1/2022"))
      .getTime()
      .toString();
    const endDate = normalizeToUtcDate(new Date("1/1/2023"))
      .getTime()
      .toString();

    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-mismatched-column-data.csv")
    );

    const { errors } = await validate({
      data: readstream,
      startDate,
      endDate,
    });

    expect(errors.length).toBeGreaterThan(0);
    const error = errors[0];
    expect(error.message).toBe(CsvValidationErrorMessage.missingTeacherEmail);
  });
});
