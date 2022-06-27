import { getApiAuth } from "@utils/auth/server-side-auth";
import { ProcessedCohort } from "@utils/csv/parseCsv";
import { validate } from "@utils/csv/validateCsv";
import formidable, { File } from "formidable";
import fs, { ReadStream } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export const COHORTS_CSV_FILE_NAME = "csvCohorts";

const TEMP_UPLOAD_DIR = "./temp";

type Data = {
  message: string;
  validationErrors?: { message: string; hint?: string }[];
  processedCsv?: ProcessedCohort[];
};

/**
 * Per Apollo's recommendation (https://www.apollographql.com/docs/apollo-server/data/file-uploads/)
 * We will handle file uploads outside of graphql. Instead we'll use the NextJS API feature to handle this.
 */

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

    const { stream, filepath, startDate, endDate } = await parseRequestForCsv(
      req
    );

    const { csv: processedCsv, errors } = await validate({
      data: stream,
      startDate,
      endDate,
    });

    // Delete file now that we're done validating it.
    deleteFile(filepath);

    res.status(200).json({
      message: "Successful",
      validationErrors: errors,
      processedCsv,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "something went wrong." });
    res.end();
  }
}

/**
 * Parsing Utilities
 */

function parseRequestForCsv(req: NextApiRequest): Promise<{
  stream: ReadStream;
  filepath: string;
  startDate?: formidable.Fields["field"];
  endDate?: formidable.Fields["field"];
}> {
  return new Promise(async (resolve, reject) => {
    try {
      const form = new formidable.IncomingForm({
        keepExtensions: true,
        uploadDir: TEMP_UPLOAD_DIR,
      });

      form.parse(req, async (err: unknown, fields, files) => {
        if (err) {
          console.error("[CSV Upload] - Error parsing CSV: ", err);
          throw err;
        }

        const file = extractFile(files[COHORTS_CSV_FILE_NAME]);
        const fileStream = fs.createReadStream(file.filepath);

        return resolve({
          stream: fileStream,
          filepath: file.filepath,
          startDate: fields.startDate,
          endDate: fields.endDate,
        });
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
