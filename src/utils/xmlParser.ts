import { DOMParser } from '@xmldom/xmldom';

export const parseXml = (xmlString: string | null): Record<string, any> | null => {
  if (!xmlString || xmlString.trim() === '') return null;

  // Keep any parse error message captured by the handler
  let handlerError: string | null = null;

  const parser = new DOMParser({
    errorHandler: {
      warning: () => {},
      error: (msg) => { handlerError = handlerError || msg; },
      fatalError: (msg) => { handlerError = handlerError || msg; },
    },
  });

  // parse
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  
  //    Check for parsererror elements first (most reliable).
  const parserErrors = Array.from(xmlDoc.getElementsByTagName('parsererror'));
  if (parserErrors.length > 0) {
    const text = (parserErrors[0].textContent || '').trim();
    throw new Error(text ? `XML Parsing Error: ${text}` : 'XML Parsing Error: Malformed XML');
  }

  // if the handler captured something, throw it
  if (handlerError) {
    throw new Error(`XML Parsing Error: ${handlerError}`);
  }

  // find the actual root element - sometimes documentElement can be null,
  //    so fall back to firstElementChild.
  let root = xmlDoc.documentElement;
  if (!root) {
    root = (xmlDoc as any).firstElementChild || null;
  }
  if (!root) return null;

  // convert node -> object
  const parseNode = (node: Element): any => {
    const result: any = {};

    // attributes as @name
    if (node.attributes && node.attributes.length > 0) {
      for (let i = 0; i < node.attributes.length; i++) {
        const a = node.attributes[i];
        result[`@${a.nodeName}`] = a.nodeValue;
      }
    }

    // children and text
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i] as any;

      // text node (trimmed)
      if (child.nodeType === 3) {
        const txt = (child.nodeValue || '').trim();
        if (txt) {
          // if there are other keys, keep '#text', otherwise return as simple text
          if (Object.keys(result).length === 0 && node.childNodes.length === 1) {
            return txt;
          }
          result['#text'] = (result['#text'] ? result['#text'] + txt : txt);
        }
        continue;
      }

      // element node
      if (child.nodeType === 1) {
        const name = child.nodeName;
        const value = parseNode(child);
        if (result[name] === undefined) result[name] = value;
        else if (Array.isArray(result[name])) result[name].push(value);
        else result[name] = [result[name], value];
      }
    }

    return result;
  };

  const out: any = {};
  out[root.nodeName] = parseNode(root);
  return out;
};
