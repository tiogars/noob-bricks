import type { Brick } from '../types';
import { brickService } from '../models/brickService';

export const importService = {
  /**
   * Import bricks from JSON format
   */
  fromJSON(content: string): Brick[] {
    try {
      const data = JSON.parse(content);
      if (!Array.isArray(data)) {
        throw new Error('Invalid JSON format: expected an array');
      }
      return this.validateBricks(data);
    } catch (error) {
      throw new Error(`Failed to import JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Import bricks from CSV format
   */
  fromCSV(content: string): Brick[] {
    try {
      const lines = content.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV file is empty or has no data rows');
      }

      // Skip header row
      const dataLines = lines.slice(1);
      const bricks: Brick[] = [];

      for (const line of dataLines) {
        if (!line.trim()) continue;

        const values = this.parseCSVLine(line);
        if (values.length < 3) continue;

        const [number, title, tagsStr, createdAt, updatedAt] = values;
        const tags = tagsStr ? tagsStr.split(';').map((t) => t.trim()).filter((t) => t) : [];

        const brick: Brick = {
          id: brickService.generateId(),
          number: number || '',
          title: title || undefined,
          tags,
          createdAt: createdAt || new Date().toISOString(),
          updatedAt: updatedAt || new Date().toISOString(),
        };

        bricks.push(brick);
      }

      return this.validateBricks(bricks);
    } catch (error) {
      throw new Error(`Failed to import CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Parse a CSV line handling quotes and commas
   */
  parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  },

  /**
   * Import bricks from XML format
   */
  fromXML(content: string): Brick[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');

      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid XML format');
      }

      const brickElements = xmlDoc.querySelectorAll('brick');
      const bricks: Brick[] = [];

      brickElements.forEach((brickEl) => {
        const id = brickEl.querySelector('id')?.textContent || brickService.generateId();
        const number = brickEl.querySelector('number')?.textContent || '';
        const title = brickEl.querySelector('title')?.textContent || undefined;
        const tagElements = brickEl.querySelectorAll('tags > tag');
        const tags = Array.from(tagElements).map((el) => el.textContent || '').filter((t) => t);
        const createdAt = brickEl.querySelector('createdAt')?.textContent || new Date().toISOString();
        const updatedAt = brickEl.querySelector('updatedAt')?.textContent || new Date().toISOString();

        bricks.push({
          id,
          number,
          title,
          tags,
          createdAt,
          updatedAt,
        });
      });

      return this.validateBricks(bricks);
    } catch (error) {
      throw new Error(`Failed to import XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Validate imported bricks
   */
  validateBricks(bricks: unknown[]): Brick[] {
    return bricks.map((brick: unknown, index: number) => {
      // Runtime type validation
      if (typeof brick !== 'object' || brick === null) {
        throw new Error(`Brick at index ${index} is not an object`);
      }
      
      const brickObj = brick as Record<string, unknown>;
      
      if (!brickObj.number || typeof brickObj.number !== 'string' && typeof brickObj.number !== 'number') {
        throw new Error(`Brick at index ${index} is missing required field: number`);
      }
      if (!Array.isArray(brickObj.tags)) {
        throw new Error(`Brick at index ${index} has invalid tags field`);
      }

      return {
        id: typeof brickObj.id === 'string' ? brickObj.id : brickService.generateId(),
        number: String(brickObj.number),
        title: brickObj.title ? String(brickObj.title) : undefined,
        tags: brickObj.tags.map((t: unknown) => String(t)),
        createdAt: typeof brickObj.createdAt === 'string' ? brickObj.createdAt : new Date().toISOString(),
        updatedAt: typeof brickObj.updatedAt === 'string' ? brickObj.updatedAt : new Date().toISOString(),
      };
    });
  },

  /**
   * Read file content
   */
  readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          resolve(content);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },
};
