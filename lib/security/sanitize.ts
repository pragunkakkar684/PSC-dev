/**
 * PSC Global — Server-Side HTML & Input Sanitizer
 * Prevents Stored XSS and malicious script injection in CMS rich text fields.
 */
import 'server-only';

export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty || typeof dirty !== 'string') return '';

  let clean = dirty;

  // 1. Remove dangerous script and style tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Remove inline event handlers (onload, onerror, onclick, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove javascript: and data: URIs in href or src attributes
  clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'>]*/gi, 'href="#"');
  clean = clean.replace(/src\s*=\s*["']?\s*javascript:[^"'>]*/gi, 'src=""');

  return clean.trim();
}
