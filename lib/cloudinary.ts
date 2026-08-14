/**
 * PSC Global CMS — Cloudinary Server-Only Configuration
 *
 * IMPORTANT: This file is marked server-only.
 * The CLOUDINARY_API_SECRET must NEVER reach the browser.
 *
 * All Cloudinary operations must go through this module or
 * through lib/services/media.ts — never from client components.
 */
import 'server-only';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_FOLDERS, type CloudinaryFolder } from '@/lib/constants/cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'placeholder',
  api_key: process.env.CLOUDINARY_API_KEY || 'placeholder',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'placeholder',
  secure: true,
});

export { cloudinary, CLOUDINARY_FOLDERS, type CloudinaryFolder };
