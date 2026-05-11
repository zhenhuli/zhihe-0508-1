import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);

class XmlJsonConverter {
  constructor() {
    this.xmlParserOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      trimValues: true
    };
    
    this.xmlBuilderOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      format: true,
      indentBy: '  '
    };
    
    this.hljs = hljs;
  }

  xmlToJson(xmlString) {
    try {
      if (!this.isValidXml(xmlString)) {
        throw new Error('Invalid XML format');
      }
      
      const parser = new XMLParser(this.xmlParserOptions);
      const jsonObj = parser.parse(xmlString);
      
      return {
        success: true,
        result: jsonObj,
        formatted: this.formatJson(jsonObj)
      };
    } catch (error) {
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  jsonToXml(jsonInput) {
    try {
      let jsonObj;
      
      if (typeof jsonInput === 'string') {
        jsonObj = this.parseJson(jsonInput);
        if (!jsonObj.success) {
          throw new Error(jsonObj.error);
        }
        jsonObj = jsonObj.result;
      } else if (typeof jsonInput === 'object') {
        jsonObj = jsonInput;
      } else {
        throw new Error('Invalid JSON input');
      }
      
      const builder = new XMLBuilder(this.xmlBuilderOptions);
      const xmlString = builder.build(jsonObj);
      
      return {
        success: true,
        result: xmlString,
        formatted: this.formatXml(xmlString)
      };
    } catch (error) {
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  parseJson(jsonString) {
    try {
      const result = JSON.parse(jsonString);
      return {
        success: true,
        result: result
      };
    } catch (error) {
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  isValidXml(xmlString) {
    try {
      const parser = new XMLParser(this.xmlParserOptions);
      parser.parse(xmlString);
      return true;
    } catch {
      return false;
    }
  }

  formatJson(jsonObj, indent = 2) {
    return JSON.stringify(jsonObj, null, indent);
  }

  formatXml(xmlString) {
    try {
      const builder = new XMLBuilder({
        ...this.xmlBuilderOptions,
        format: true,
        indentBy: '  '
      });
      
      const parser = new XMLParser(this.xmlParserOptions);
      const jsonObj = parser.parse(xmlString);
      
      return builder.build(jsonObj);
    } catch {
      return xmlString;
    }
  }

  minifyJson(jsonString) {
    try {
      const jsonObj = JSON.parse(jsonString);
      return JSON.stringify(jsonObj);
    } catch (error) {
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  detectFormat(inputString) {
    const trimmed = inputString.trim();
    
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'json';
    }
    
    if (trimmed.startsWith('<')) {
      return 'xml';
    }
    
    return 'unknown';
  }

  highlightCode(code, language) {
    try {
      const lang = language || this.detectFormat(code);
      
      if (lang === 'json' || lang === 'xml') {
        const result = this.hljs.highlight(code, { language: lang });
        return {
          success: true,
          language: lang,
          highlighted: result.value,
          relevance: result.relevance
        };
      }
      
      return {
        success: false,
        error: `Unsupported language: ${lang}`
      };
    } catch (error) {
      return {
        success: false,
        error: this.extractErrorMessage(error)
      };
    }
  }

  getLanguageDisplayName(language) {
    const languageNames = {
      json: 'JSON',
      xml: 'XML',
      unknown: '未知'
    };
    return languageNames[language] || language;
  }

  extractErrorMessage(error) {
    if (error instanceof SyntaxError) {
      return `Syntax error: ${error.message}`;
    }
    if (error.message) {
      return error.message;
    }
    return 'Unknown error occurred';
  }
}

const converter = new XmlJsonConverter();
export default converter;
