import type { Brick } from '../types';

export const exportService = {
  /**
   * Export bricks to JSON format
   */
  toJSON(bricks: Brick[]): string {
    return JSON.stringify(bricks, null, 2);
  },

  /**
   * Export bricks to CSV format
   */
  toCSV(bricks: Brick[]): string {
    if (bricks.length === 0) {
      return 'Number,Title,Tags,Created At,Updated At\n';
    }

    const headers = 'Number,Title,Tags,Created At,Updated At\n';
    const rows = bricks.map((brick) => {
      const escapeCsv = (value: string) => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      return [
        escapeCsv(brick.number),
        escapeCsv(brick.title || ''),
        escapeCsv(brick.tags.join('; ')),
        escapeCsv(brick.createdAt),
        escapeCsv(brick.updatedAt),
      ].join(',');
    });

    return headers + rows.join('\n');
  },

  /**
   * Export bricks to XML format
   */
  toXML(bricks: Brick[]): string {
    const escapeXml = (value: string) => {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const xmlParts = ['<?xml version="1.0" encoding="UTF-8"?>', '<bricks>'];

    bricks.forEach((brick) => {
      xmlParts.push('  <brick>');
      xmlParts.push(`    <id>${escapeXml(brick.id)}</id>`);
      xmlParts.push(`    <number>${escapeXml(brick.number)}</number>`);
      if (brick.title) {
        xmlParts.push(`    <title>${escapeXml(brick.title)}</title>`);
      }
      xmlParts.push('    <tags>');
      brick.tags.forEach((tag) => {
        xmlParts.push(`      <tag>${escapeXml(tag)}</tag>`);
      });
      xmlParts.push('    </tags>');
      xmlParts.push(`    <createdAt>${escapeXml(brick.createdAt)}</createdAt>`);
      xmlParts.push(`    <updatedAt>${escapeXml(brick.updatedAt)}</updatedAt>`);
      xmlParts.push('  </brick>');
    });

    xmlParts.push('</bricks>');
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
