import type { Brick, ExternalLink } from '../types';
import { imageService } from './imageService';
import { exportService } from './exportService';

/**
 * Enhanced export service that handles fetching images from IndexedDB before export
 */
export const enhancedExportService = {
  /**
   * Prepare bricks for export by fetching images from IndexedDB
   */
  async prepareBricksForExport(bricks: Brick[]): Promise<Brick[]> {
    const preparedBricks: Brick[] = [];

    for (const brick of bricks) {
      let imageUrl = brick.imageUrl;

      // If the brick has an image ID reference, fetch the actual image data
      if (imageUrl && !imageUrl.startsWith('data:image/')) {
        const imageData = await imageService.getImage(imageUrl);
        imageUrl = imageData || imageUrl; // Use original ID as fallback
      }

      preparedBricks.push({
        ...brick,
        imageUrl,
      });
    }

    return preparedBricks;
  },

  /**
   * Export bricks to JSON format with images included
   */
  async toJSONWithImages(bricks: Brick[], externalLinks?: ExternalLink[]): Promise<string> {
    const preparedBricks = await this.prepareBricksForExport(bricks);
    return exportService.toJSON(preparedBricks, externalLinks);
  },

  /**
   * Export bricks to CSV format with images included
   */
  async toCSVWithImages(bricks: Brick[], externalLinks?: ExternalLink[]): Promise<string> {
    const preparedBricks = await this.prepareBricksForExport(bricks);
    return exportService.toCSV(preparedBricks, externalLinks);
  },

  /**
   * Export bricks to XML format with images included
   */
  async toXMLWithImages(bricks: Brick[], externalLinks?: ExternalLink[]): Promise<string> {
    const preparedBricks = await this.prepareBricksForExport(bricks);
    return exportService.toXML(preparedBricks, externalLinks);
  },
};
