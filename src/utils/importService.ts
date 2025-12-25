import type { Brick, ExternalLink } from '../types';
import { brickService } from '../models/brickService';

export interface ImportResult {
  bricks: Brick[];
  externalLinks?: ExternalLink[];
}

/**
 * Generate a unique ID for an external link
 */
function generateExternalLinkId(): string {
  return `link-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export const importService = {
  /**
   * Import bricks from JSON format
   */
  fromJSON(content: string): ImportResult {
    try {
      const data = JSON.parse(content);
      
      // Handle legacy format (array of bricks)
      if (Array.isArray(data)) {
        return {
          bricks: this.validateBricks(data),
          externalLinks: undefined,
        };
      }
      
      // Handle new format (AppState with bricks and externalLinks)
      if (typeof data === 'object' && data !== null) {
        const result: ImportResult = {
          bricks: [],
          externalLinks: undefined,
        };
        
        if (Array.isArray(data.bricks)) {
          result.bricks = this.validateBricks(data.bricks);
        } else {
          throw new Error('Invalid JSON format: bricks field is missing or not an array');
        }
        
        if (data.externalLinks && Array.isArray(data.externalLinks)) {
          result.externalLinks = this.validateExternalLinks(data.externalLinks);
        }
        
        return result;
      }
      
      throw new Error('Invalid JSON format: expected an array or object');
    } catch (error) {
      throw new Error(`Failed to import JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Import bricks from CSV format
   */
  fromCSV(content: string): ImportResult {
    try {
      const result: ImportResult = {
        bricks: [],
        externalLinks: undefined,
      };

      const sections = content.split(/\n\s*\[/);
      
      for (const section of sections) {
        const lines = section.trim().split('\n');
        if (lines.length === 0) continue;

        const sectionName = lines[0].replace(/[\\[\\]]/g, '').toUpperCase();
        
        if (sectionName === 'BRICKS' || !sectionName.startsWith('[')) {
          // Process bricks section
          const headerIndex = lines.findIndex(line => line.toLowerCase().includes('number'));
          if (headerIndex === -1) continue;

          const dataLines = lines.slice(headerIndex + 1);
          const bricks: Brick[] = [];

          for (const line of dataLines) {
            if (!line.trim() || line.startsWith('[')) continue;

            const values = this.parseCSVLine(line);
            if (values.length < 3) continue;

            const [number, title, tagsStr, imageUrl, createdAt, updatedAt] = values;
            const tags = tagsStr ? tagsStr.split(';').map((t) => t.trim()).filter((t) => t) : [];

            const brick: Brick = {
              id: brickService.generateId(),
              number: number || '',
              title: title || undefined,
              tags,
              imageUrl: imageUrl || undefined,
              createdAt: createdAt || new Date().toISOString(),
              updatedAt: updatedAt || new Date().toISOString(),
            };

            bricks.push(brick);
          }

          result.bricks = this.validateBricks(bricks);
        } else if (sectionName === 'EXTERNAL_LINKS') {
          // Process external links section
          const headerIndex = lines.findIndex(line => line.toLowerCase().includes('id') || line.toLowerCase().includes('name'));
          if (headerIndex === -1) continue;

          const dataLines = lines.slice(headerIndex + 1);
          const externalLinks: ExternalLink[] = [];

          for (const line of dataLines) {
            if (!line.trim() || line.startsWith('[')) continue;

            const values = this.parseCSVLine(line);
            if (values.length < 4) continue;

            const [id, name, url, enabled] = values;
            
            externalLinks.push({
              id: id || generateExternalLinkId(),
              name: name || '',
              url: url || '',
              enabled: enabled.toLowerCase() === 'true',
            });
          }

          if (externalLinks.length > 0) {
            result.externalLinks = this.validateExternalLinks(externalLinks);
          }
        }
      }

      if (result.bricks.length === 0) {
        throw new Error('No bricks found in the CSV file');
      }

      return result;
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
  fromXML(content: string): ImportResult {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');

      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid XML format');
      }

      const result: ImportResult = {
        bricks: [],
        externalLinks: undefined,
      };

      // Check for legacy format (root is <bricks>)
      const rootElement = xmlDoc.documentElement;
      const isLegacyFormat = rootElement.tagName === 'bricks';

      // Parse bricks
      const brickElements = isLegacyFormat 
        ? xmlDoc.querySelectorAll('brick')
        : xmlDoc.querySelectorAll('bricks > brick');
      const bricks: Brick[] = [];

      brickElements.forEach((brickEl) => {
        const id = brickEl.querySelector('id')?.textContent || brickService.generateId();
        const number = brickEl.querySelector('number')?.textContent || '';
        const title = brickEl.querySelector('title')?.textContent || undefined;
        const imageUrl = brickEl.querySelector('imageUrl')?.textContent || undefined;
        const tagElements = brickEl.querySelectorAll('tags > tag');
        const tags = Array.from(tagElements).map((el) => el.textContent || '').filter((t) => t);
        const createdAt = brickEl.querySelector('createdAt')?.textContent || new Date().toISOString();
        const updatedAt = brickEl.querySelector('updatedAt')?.textContent || new Date().toISOString();

        bricks.push({
          id,
          number,
          title,
          tags,
          imageUrl,
          createdAt,
          updatedAt,
        });
      });

      result.bricks = this.validateBricks(bricks);

      // Parse external links (only in new format)
      if (!isLegacyFormat) {
        const linkElements = xmlDoc.querySelectorAll('externalLinks > link');
        const externalLinks: ExternalLink[] = [];

        linkElements.forEach((linkEl) => {
          const id = linkEl.querySelector('id')?.textContent || generateExternalLinkId();
          const name = linkEl.querySelector('name')?.textContent || '';
          const url = linkEl.querySelector('url')?.textContent || '';
          const enabledText = linkEl.querySelector('enabled')?.textContent || 'true';
          const enabled = enabledText.toLowerCase() === 'true';

          externalLinks.push({ id, name, url, enabled });
        });

        if (externalLinks.length > 0) {
          result.externalLinks = this.validateExternalLinks(externalLinks);
        }
      }

      return result;
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
        imageUrl: brickObj.imageUrl ? String(brickObj.imageUrl) : undefined,
        createdAt: typeof brickObj.createdAt === 'string' ? brickObj.createdAt : new Date().toISOString(),
        updatedAt: typeof brickObj.updatedAt === 'string' ? brickObj.updatedAt : new Date().toISOString(),
      };
    });
  },

  /**
   * Validate imported external links
   */
  validateExternalLinks(links: unknown[]): ExternalLink[] {
    return links.map((link: unknown, index: number) => {
      if (typeof link !== 'object' || link === null) {
        throw new Error(`External link at index ${index} is not an object`);
      }

      const linkObj = link as Record<string, unknown>;

      if (!linkObj.name || typeof linkObj.name !== 'string') {
        throw new Error(`External link at index ${index} is missing required field: name`);
      }
      if (!linkObj.url || typeof linkObj.url !== 'string') {
        throw new Error(`External link at index ${index} is missing required field: url`);
      }

      return {
        id: typeof linkObj.id === 'string' ? linkObj.id : generateExternalLinkId(),
        name: String(linkObj.name),
        url: String(linkObj.url),
        enabled: typeof linkObj.enabled === 'boolean' ? linkObj.enabled : true,
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
