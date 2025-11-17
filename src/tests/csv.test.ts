import fs from "fs";
import { Readable } from "stream";//stream is a built in class in module fs and readable its  also  a built in class in stream module
import { parseCSV } from "../utils/csvParser";

// Mock logger to avoid console output
jest.mock("../utils/logger", () => ({
  error: jest.fn(),
}));

// Helper: Create mock readable stream from string
const mockReadStream = (data: string): Readable => {
  return Readable.from([data]);
};

describe("parseCSV", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should parse a normal CSV file correctly", async () => {
    const csvData = `"id","Type","Flavor","Price"
"0","Sponge","Vanilla","50"
"1","Chocolate","Dark","75"`;

    jest.spyOn(fs, "createReadStream").mockReturnValue(mockReadStream(csvData) as any);//take csvData  as a mocked read stream instead of reading a large file

    const result = await parseCSV("cakes.csv");//anytime parseCSV is called it will use the mocked read stream

    expect(result).toEqual([
      ["id", "Type", "Flavor", "Price"],
      ["0", "Sponge", "Vanilla", "50"],
      ["1", "Chocolate", "Dark", "75"],
    ]);
  });

  it("should handle an empty file ", async () => {
    jest.spyOn(fs, "createReadStream").mockReturnValue(mockReadStream("") as any);
    const result = await parseCSV("empty.csv");
    expect(result).toEqual([]);
  });

  it("should handle a file with only headers", async () => {
    const csvData = `"id","Type","Flavor"`;
    jest.spyOn(fs, "createReadStream").mockReturnValue(mockReadStream(csvData) as any);
    const result = await parseCSV("headers.csv");
    expect(result).toEqual([["id","Type","Flavor"]]);
  });

  it("should trim spaces and remove quotes", async () => {
    const csvData = `"id","Type","Flavor"
"0"," Sponge "," Vanilla "`; 

    jest.spyOn(fs, "createReadStream").mockReturnValue(mockReadStream(csvData) as any);

    const result = await parseCSV("trimmed.csv");

    expect(result).toEqual([
      ["id","Type","Flavor"],
      ["0","Sponge","Vanilla"],
    ]);
  });

  it("should handle missing values", async () => {
    const csvData = `"id","Type","Flavor"
"0","Sponge",`;
    jest.spyOn(fs, "createReadStream").mockReturnValue(mockReadStream(csvData) as any);

    const result = await parseCSV("missing.csv");

    expect(result).toEqual([
      ["id","Type","Flavor"],
      ["0","Sponge",""],
    ]);
  });

  it("should reject if file reading fails", async () => {
    const mockError = new Error("File not found");//creating a fake error

    const errorStream = new Readable({
      read() {
        this.destroy(mockError);
      },
    });

    jest.spyOn(fs, "createReadStream").mockReturnValue(errorStream as any);

    await expect(parseCSV("invalid.csv")).rejects.toThrow("File not found");
  });
});
