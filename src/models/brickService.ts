import type { Brick, BrickFormData } from '../types';

export const brickService = {
  /**
   * Generate a unique ID for a brick
   */
  generateId(): string {
    return `brick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Create a new brick
   */
  createBrick(formData: BrickFormData): Brick {
    const now = new Date().toISOString();
    return {
      id: this.generateId(),
      number: formData.number,
      title: formData.title,
      tags: formData.tags,
      createdAt: now,
      updatedAt: now,
    };
  },

  /**
   * Update an existing brick
   */
  updateBrick(brick: Brick, formData: BrickFormData): Brick {
    return {
      ...brick,
      number: formData.number,
      title: formData.title,
      tags: formData.tags,
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Filter bricks by tags
   */
  filterByTags(bricks: Brick[], tags: string[]): Brick[] {
    if (tags.length === 0) {
      return bricks;
    }
    return bricks.filter((brick) =>
      tags.some((tag) => brick.tags.includes(tag))
    );
  },

  /**
   * Sort bricks by number
   */
  sortByNumber(bricks: Brick[]): Brick[] {
    return [...bricks].sort((a, b) => {
      const numA = parseInt(a.number, 10);
      const numB = parseInt(b.number, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.number.localeCompare(b.number);
    });
  },

  /**
   * Extract all unique tags from bricks
   */
  extractTags(bricks: Brick[]): string[] {
    const tagSet = new Set<string>();
    bricks.forEach((brick) => {
      brick.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  },
};
