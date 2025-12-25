import { useState, useEffect } from 'react';
import type { ExternalLink } from '../types';
import { storageService } from '../storage/storageService';

export function useExternalLinks() {
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(() => {
    return storageService.getExternalLinks();
  });

  // Save external links to localStorage whenever they change
  useEffect(() => {
    storageService.saveExternalLinks(externalLinks);
  }, [externalLinks]);

  const addExternalLink = (link: Omit<ExternalLink, 'id'>) => {
    const newLink: ExternalLink = {
      ...link,
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    };
    setExternalLinks([...externalLinks, newLink]);
  };

  const updateExternalLink = (id: string, updates: Partial<ExternalLink>) => {
    setExternalLinks(externalLinks.map((link) =>
      link.id === id ? { ...link, ...updates } : link
    ));
  };

  const deleteExternalLink = (id: string) => {
    setExternalLinks(externalLinks.filter((link) => link.id !== id));
  };

  const toggleExternalLink = (id: string) => {
    setExternalLinks(externalLinks.map((link) =>
      link.id === id ? { ...link, enabled: !link.enabled } : link
    ));
  };

  const importExternalLinks = (links: ExternalLink[]) => {
    setExternalLinks(links);
  };

  return {
    externalLinks,
    addExternalLink,
    updateExternalLink,
    deleteExternalLink,
    toggleExternalLink,
    importExternalLinks,
  };
}
