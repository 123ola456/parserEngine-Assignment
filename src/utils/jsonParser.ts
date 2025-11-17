
import fs from 'fs';
import logger from './logger';

export const parseJSON = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        logger.error("Error reading JSON file %s: %o", filePath, err);
        return reject(err);
      }
      try {
        const jsonData = JSON.parse(data);
        if (!Array.isArray(jsonData)) {
          throw new Error("JSON file should contain an array of objects");
        }
        resolve(jsonData);
      } catch (parseErr) {
        logger.error("Error parsing JSON: %o", parseErr);
        reject(parseErr);
      }
    });
  });
};
