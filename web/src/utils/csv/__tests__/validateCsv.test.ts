import { validateCsv, validateCsvFile } from "../validateCsv";
import fs from "fs";
import path from "path";
import { CsvValidationErrorMessage } from "@utils/errors";

describe("csvValidation", () => {
  test("should detect invalid format for null", () => {
    const { errors } = validateCsv(null);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect invalid format for undefined", () => {
    const { errors } = validateCsv(undefined);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect invalid format for empty object", () => {
    const { errors } = validateCsv({});
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect invalid format for random string", () => {
    const { errors } = validateCsv("random string");
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect invalid format for random number", () => {
    const { errors } = validateCsv(1234);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.invalidFormat);
  });

  test("should detect empty array", () => {
    const { errors } = validateCsv([]);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.emptyData);
  });

  test("should detect empty CSV", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-empty.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.emptyData);
  });

  test("should detect missing header", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-missing-header.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.rowLengthMismatch);
  });

  test("should detect row column mismatch", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-row-column-mismatch.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationErrorMessage.rowLengthMismatch);
  });

  test("should detect a missing column due to typo", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-header-typo.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    const error = errors[0];
    expect(error.message).toBe(CsvValidationErrorMessage.missingRequiredColumn);
    expect(error.hint).toBe("Columns: cohort");
  });

  test("should detect multiple missing columns", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-missing-required-columns.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    const error = errors[0];
    expect(error.message).toBe(CsvValidationErrorMessage.missingRequiredColumn);
    expect(error.hint).toBe("Columns: grade, monday, tuesday, wednesday");
  });

  test("should passing validation when optional columns are missing", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./valid-missing-optional-columns.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toEqual(0);
  });

  test("should fail due to mismatched column data", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./invalid-mismatched-column-data.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    const error = errors[0];
    expect(error.message).toBe(CsvValidationErrorMessage.missingTeacherEmail);
  });
});
