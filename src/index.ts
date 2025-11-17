
import path from 'path';
import logger from './utils/logger';
import { parseCSV } from './utils/csvParser';
import { parseJSON } from './utils/jsonParser';
import { parseXml } from './utils/xmlParser';

type ParserType = 'csv' | 'json' | 'xml';

/**
 * Parse a file based on type
 */
async function parseFile(fileType: ParserType, filePath: string) {
  switch (fileType) {
    case 'csv':
      return await parseCSV(filePath);
    case 'json':
      return await parseJSON(filePath);
    case 'xml':
      return await parseXml(filePath);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Log an object both to console and logger in pretty JSON
 */
function logPretty(obj: any) {
  console.log(obj); // console log is already readable
  logger.info(JSON.stringify(obj, null, 2)); // log to file in pretty format
}

/**
 * Main function
 */
async function main() {
  try {
    // --- CSV Example ---
    const csvPath = path.resolve(__dirname, './data/cake orders.csv');
    const csvData = await parseFile('csv', csvPath);

    const csvHeaderOrder = [
      "id","Type","Flavor","Filling","Size","Layers","Frosting Type","Frosting Flavor",
      "Decoration Type","Decoration Color","Custom Message","Shape","Allergies",
      "Special Ingredients","Packaging Type","Price","Quantity"
    ];

    csvData?.forEach((cake: Record<string, any>, index: number) => {
      const orderedCake: Record<string, any> = {};
      csvHeaderOrder.forEach(header => {
        orderedCake[header] = cake[header];
      });
      orderedCake.cakeNumber = index + 1;
      logPretty(orderedCake);
    });

    // --- JSON Example ---
    const jsonPath = path.resolve(__dirname, './data/book orders.json');
    const jsonData = (await parseFile('json', jsonPath)) ?? [];

    jsonData.forEach((order: any, index: number) => {
      order.orderNumber = index + 1;
      logPretty(order);
    });

    // --- XML Example ---
    const xmlPath = path.resolve(__dirname, './data/toy orders.xml');
    const xmlData = await parseFile('xml', xmlPath);

    // XML might return a root object, we assume it has multiple rows
    let rows: any[] = [];
    if (Array.isArray(xmlData)) {
      rows = xmlData;
    } else if (xmlData && typeof xmlData === 'object') {
      rows = (xmlData as Record<string, any>).data?.row ?? [];
    }
    rows.forEach((item: any, index: number) => {
      item.itemNumber = index + 1;
      logPretty(item);
    });

  } catch (err) {
    logger.error('Error parsing file: %o', err);
  }
}

main();
