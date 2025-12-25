import type { Brick, ExternalLink, AppState } from '../types';

export const exportService = {
  /**
   * Export bricks to JSON format
   */
  toJSON(bricks: Brick[], externalLinks?: ExternalLink[]): string {
    const data: AppState = {
      bricks,
      tags: [], // Tags are derived from bricks
      externalLinks,
    };
    return JSON.stringify(data, null, 2);
  },

  /**
   * Export bricks to CSV format
   */
  toCSV(bricks: Brick[], externalLinks?: ExternalLink[]): string {
    const escapeCsv = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    let output = '';

    // Export bricks section
    output += '[BRICKS]\n';
    output += 'Number,Title,Tags,Image URL,Created At,Updated At\n';
    
    if (bricks.length > 0) {
      const brickRows = bricks.map((brick) => {
        return [
          escapeCsv(brick.number),
          escapeCsv(brick.title || ''),
          escapeCsv(brick.tags.join('; ')),
          escapeCsv(brick.imageUrl || ''),
          escapeCsv(brick.createdAt),
          escapeCsv(brick.updatedAt),
        ].join(',');
      });
      output += brickRows.join('\n');
    }

    // Export external links section
    if (externalLinks && externalLinks.length > 0) {
      output += '\n\n[EXTERNAL_LINKS]\n';
      output += 'ID,Name,URL,Enabled\n';
      const linkRows = externalLinks.map((link) => {
        return [
          escapeCsv(link.id),
          escapeCsv(link.name),
          escapeCsv(link.url),
          escapeCsv(link.enabled.toString()),
        ].join(',');
      });
      output += linkRows.join('\n');
    }

    return output;
  },

  /**
   * Export bricks to XML format
   */
  toXML(bricks: Brick[], externalLinks?: ExternalLink[]): string {
    const escapeXml = (value: string) => {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const xmlParts = ['<?xml version="1.0" encoding="UTF-8"?>', '<appData>'];

    // Export bricks
    xmlParts.push('  <bricks>');
    bricks.forEach((brick) => {
      xmlParts.push('    <brick>');
      xmlParts.push(`      <id>${escapeXml(brick.id)}</id>`);
      xmlParts.push(`      <number>${escapeXml(brick.number)}</number>`);
      if (brick.title) {
        xmlParts.push(`      <title>${escapeXml(brick.title)}</title>`);
      }
      xmlParts.push('      <tags>');
      brick.tags.forEach((tag) => {
        xmlParts.push(`        <tag>${escapeXml(tag)}</tag>`);
      });
      xmlParts.push('      </tags>');
      if (brick.imageUrl) {
        xmlParts.push(`      <imageUrl>${escapeXml(brick.imageUrl)}</imageUrl>`);
      }
      xmlParts.push(`      <createdAt>${escapeXml(brick.createdAt)}</createdAt>`);
      xmlParts.push(`      <updatedAt>${escapeXml(brick.updatedAt)}</updatedAt>`);
      xmlParts.push('    </brick>');
    });
    xmlParts.push('  </bricks>');

    // Export external links
    if (externalLinks && externalLinks.length > 0) {
      xmlParts.push('  <externalLinks>');
      externalLinks.forEach((link) => {
        xmlParts.push('    <link>');
        xmlParts.push(`      <id>${escapeXml(link.id)}</id>`);
        xmlParts.push(`      <name>${escapeXml(link.name)}</name>`);
        xmlParts.push(`      <url>${escapeXml(link.url)}</url>`);
        xmlParts.push(`      <enabled>${link.enabled}</enabled>`);
        xmlParts.push('    </link>');
      });
      xmlParts.push('  </externalLinks>');
    }

    xmlParts.push('</appData>');
    return xmlParts.join('\n');
  },

  /**
   * Download data as a file
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
