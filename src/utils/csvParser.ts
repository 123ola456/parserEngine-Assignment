import fs from "fs";
import logger from "./logger";

export const parseCSV = (filePath: string): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const results: string[][] = [];
    const readStream = fs.createReadStream(filePath, { encoding: "utf-8" });
    

    let buffer = "";

    readStream.on("data", (chunk: string | Buffer) => {
      const data = typeof chunk === "string" ? chunk : chunk.toString("utf-8");//chunk must be string if not convert to string
      buffer += data;

      const lines = buffer.split("\n");//array from complete lines from the csv 
      buffer = lines.pop() || "";//delete last line from lines and assign to buffer and if the array is empty assign empty string

      for (const line of lines) {
        if (line.trim() === "") continue;//remove spaces from start and end and if there is an empty line skip it
        const columns = line
          .split(",")//divide the string into array using , as separator
          .map((value) => value.replace(/^"(.*)"$/, "$1").trim());//remove quotes and extra spaces 
        results.push(columns);
      }
    });

    readStream.on("end", () => {// end event is when we finish reading the file and checking if there is any remaining data in buffer
      if (buffer.trim() !== "") {
        const columns = buffer
          .split(",")
          .map((value) => value.replace(/^"(.*)"$/, "$1").trim());
        results.push(columns);
      }
      resolve(results);
    });

    readStream.on("error", (error) => {
      logger.error(`Error reading file ${filePath}:`, error);
      reject(error);
    });
  });
};



