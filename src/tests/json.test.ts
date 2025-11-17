/// <reference types="jest" />
import { parseJSON } from '../utils/jsonParser';
import path from 'path';

describe('JSON Parser', () => {
  const filePath = path.resolve(__dirname, '../data/book orders.json');

  test('should parse JSON into array of objects', async () => {
    // Arrange
    const expectedFirstOrder = {
      "Order ID": "2001",
      "Book Title": "Edge of Eternity",
      "Author": "Dan Brown",
      "Genre": "Science Fiction",
      "Format": "Paperback",
      "Language": "French",
      "Publisher": "Oxford Press",
      "Special Edition": "Signed Copy",
      "Packaging": "Eco-Friendly Packaging",
      "Price": "12",
      "Quantity": "5"
    };

    // Act
    const data = await parseJSON(filePath);

    // Assertions
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0); // should have at least 1 item
    expect(data[0]).toEqual(expectedFirstOrder); // first item matches expected
    expect(data[0]["Order ID"]).toBe("2001"); // first id check
    expect(data[1]).toHaveProperty("Book Title"); // second object has Book Title
  });
});
