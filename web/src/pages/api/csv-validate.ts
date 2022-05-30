import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import { getApiAuth } from "@utils/auth/server-side-auth";
import fs, { ReadStream } from "fs";
import { validateCsvFile } from "@utils/validateCsv";

export const COHORTS_CSV_FILE_NAME = "csvCohorts";

type Data = {
  message: string;
  validationResults?: { message: string; hint?: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { token, isAuthenticated } = await getApiAuth(req);
    if (!isAuthenticated || token === null) {
      res.status(400).json({ message: "unauthorized" });
      res.end();
    }

    const { stream, filepath } = await parseRequestForCsv(req);
    const { errors } = await validateCsvFile(stream);

    // Delete file now that we're done validating it.
    deleteFile(filepath);

    res.status(200).json({ message: "Successful", validationResults: errors });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "something went wrong." });
    res.end();
  }
}

/**
 * Parsing Utilities
 */

function parseRequestForCsv(
  req: NextApiRequest
): Promise<{ stream: ReadStream; filepath: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const form = new formidable.IncomingForm({
        keepExtensions: true,
        uploadDir: "./",
      });

      form.parse(req, async (err: unknown, fields, files) => {
        if (err) {
          console.error("[CSV Upload] - Error parsing CSV: ", err);
          throw err;
        }

        const file = extractFile(files[COHORTS_CSV_FILE_NAME]);
        const fileStream = fs.createReadStream(file.filepath);

        return resolve({ stream: fileStream, filepath: file.filepath });
      });
    } catch (error) {
      // TODO: improve
      console.error(error);
      return reject(null);
    }
  });
}

/**
 * Utils
 */

function extractFile(csvFile: File | File[]): File {
  let file: formidable.File | null;
  if (Array.isArray(csvFile)) {
    file = csvFile.length > 0 ? csvFile[0] : null;
  } else {
    file = csvFile;
  }

  if (!file) {
    throw new Error("Unable to parse CSV. Uploaded CSV is null.");
  }

  return file;
}

function deleteFile(filePath: string) {
  console.log("[CSV Upload] - deleting file: ", filePath);
  fs.unlink(filePath, function (err) {
    if (err) {
      console.error(err);
    }
    console.log("[CSV Upload] - temp file deleted.");
  });
}

/**
 * Config
 */

export const config = {
  api: {
    bodyParser: false,
  },
};
