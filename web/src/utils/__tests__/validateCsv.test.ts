import {
  validateCsv,
  CsvValidationError,
  validateCsvFile,
} from "../validateCsv";
import fs from "fs";
import path from "path";

describe("csvValidation", () => {
  test("should detect invalid format for null", () => {
    const { errors } = validateCsv(null);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationError.invalidFormat);
  });

  test("should detect invalid format for undefined", () => {
    const { errors } = validateCsv(undefined);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationError.invalidFormat);
  });

  test("should detect invalid format for empty object", () => {
    const { errors } = validateCsv({});
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationError.invalidFormat);
  });

  test("should detect invalid format for random string", () => {
    const { errors } = validateCsv("random string");
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationError.invalidFormat);
  });

  test("should detect invalid format for random number", () => {
    const { errors } = validateCsv(1234);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationError.invalidFormat);
  });

  test("should detect empty array", () => {
    const { errors } = validateCsv([]);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationError.emptyData);
  });

  test("should detect empty CSV", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./empty.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationError.emptyData);
  });

  test("should detect missing header", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./missing-header.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationError.rowLengthMismatch);
  });

  test("should detect row column mismatch.", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./row-column-mismatch.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe(CsvValidationError.rowLengthMismatch);
  });

  test("should detect a missing column due to typo.", async () => {
    const readstream = fs.createReadStream(
      path.resolve(__dirname, "./header-typo.csv")
    );

    const { errors } = await validateCsvFile(readstream);
    expect(errors.length).toBeGreaterThan(0);
    const error = errors[0];
    expect(error.message).toBe(CsvValidationError.missingColumn);
    expect(error.hint).toBe("cohorttypo");
  });
});
