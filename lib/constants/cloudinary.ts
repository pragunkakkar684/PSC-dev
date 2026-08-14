/**
 * Client-safe Cloudinary constants (folders and limits).
 * Safe to import in both Client Components and Server Components.
 */

export const CLOUDINARY_FOLDERS = {
  team: 'psc-global/team',
  events: 'psc-global/events',
  insights: 'psc-global/insights',
  pages: 'psc-global/pages',
  documents: 'psc-global/documents',
  industries: 'psc-global/industries',
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
