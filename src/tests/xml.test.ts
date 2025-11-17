import { parseXml } from '../utils/xmlParser';

describe('XML Parser', () => {
  test('should parse XML into JS object', () => {
    const xml = `
      <data>
        <row>
          <OrderID>5001</OrderID>
          <Type>Plush Toy</Type>
          <AgeGroup>13+</AgeGroup>
          <Brand>FunTime</Brand>
          <Material>Fabric</Material>
          <BatteryRequired>Yes</BatteryRequired>
          <Educational>Yes</Educational>
          <Price>247</Price>
          <Quantity>7</Quantity>
        </row>
      </data>`;
    const result = parseXml(xml);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('data');

    // normalize row -> array if needed
    const row = result!.data.row;
    const rows = Array.isArray(row) ? row : [row];

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].OrderID).toBe('5001'); // OrderID returns as simple text because it's only text child
    expect(rows[0].Type).toBe('Plush Toy');
  });

 

  test('should handle XML with attributes and text content', () => {
    const xml = '<note id="1"><to>Tove</to><from>Jani</from><body>Reminder</body></note>';
    const res = parseXml(xml);
    expect(res).toEqual({
      note: {
        '@id': '1',
        to: 'Tove',
        from: 'Jani',
        body: 'Reminder'
      }
    });
  });

  test('should return null for empty XML', () => {
    expect(parseXml('')).toBeNull();
    expect(parseXml('   ')).toBeNull();
  });

  test('should handle text node', () => {
    const xml = '<root>text content</root>';
    const result = parseXml(xml);
    expect(result).toEqual({ root: 'text content' });
  });

  test('should return null for null xmlString', () => {
    expect(parseXml(null)).toBeNull();
  });
});
