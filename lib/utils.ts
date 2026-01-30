import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Format a price for display
 */
export function formatPrice(amount: number, currency = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date, locale = 'en-CA'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a random visitor ID for analytics
 */
export function generateVisitorId(): string {
  return 'v_' + Math.random().toString(36).substring(2, 15);
}

/**
 * Get or create visitor ID from cookie
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';

  const cookieName = 'ac_visitor_id';
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) return value;
  }

  const visitorId = generateVisitorId();
  document.cookie = `${cookieName}=${visitorId}; max-age=${60 * 60 * 24 * 365}; path=/`;
  return visitorId;
}

/**
 * Check if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure URL has protocol
 */
export function ensureProtocol(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

/**
 * Canadian Provinces and Territories
 */
export const PROVINCES_TERRITORIES = [
  { code: 'AB', name: 'Alberta', region: 'Western Canada' },
  { code: 'BC', name: 'British Columbia', region: 'Western Canada' },
  { code: 'MB', name: 'Manitoba', region: 'Western Canada' },
  { code: 'NB', name: 'New Brunswick', region: 'Atlantic Canada' },
  { code: 'NL', name: 'Newfoundland and Labrador', region: 'Atlantic Canada' },
  { code: 'NS', name: 'Nova Scotia', region: 'Atlantic Canada' },
  { code: 'NT', name: 'Northwest Territories', region: 'Northern Canada' },
  { code: 'NU', name: 'Nunavut', region: 'Northern Canada' },
  { code: 'ON', name: 'Ontario', region: 'Eastern Canada' },
  { code: 'PE', name: 'Prince Edward Island', region: 'Atlantic Canada' },
  { code: 'QC', name: 'Quebec', region: 'Eastern Canada' },
  { code: 'SK', name: 'Saskatchewan', region: 'Western Canada' },
  { code: 'YT', name: 'Yukon', region: 'Northern Canada' },
] as const;

export type ProvinceCode = typeof PROVINCES_TERRITORIES[number]['code'];

/**
 * Get region name from province code
 */
export function getRegionFromProvince(provinceCode: string): string | null {
  const province = PROVINCES_TERRITORIES.find(p => p.code === provinceCode);
  return province?.region || null;
}

/**
 * Validate and format Canadian postal code
 * Format: A1A 1A1 (letter-digit-letter space digit-letter-digit)
 */
export function formatPostalCode(postalCode: string): string {
  // Remove all spaces and convert to uppercase
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();

  // Insert space after first 3 characters if we have 6 characters
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }

  return cleaned.toUpperCase();
}

/**
 * Validate Canadian postal code format
 * Returns error message or null if valid
 */
export function validatePostalCode(postalCode: string): string | null {
  if (!postalCode || postalCode.trim() === '') {
    return 'Postal code is required';
  }

  // Remove spaces and check format
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();

  // Canadian postal code pattern: letter-digit-letter-digit-letter-digit
  // Note: Letters D, F, I, O, Q, U are not used
  const postalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/;

  if (!postalCodeRegex.test(cleaned)) {
    return 'Please enter a valid Canadian postal code (e.g., A1A 1A1)';
  }

  return null;
}

/**
 * Validate short description for contact information
 * Returns error message or null if valid
 */
export function validateShortDescription(text: string): string | null {
  if (!text) return null;

  // Email pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (emailRegex.test(text)) {
    return 'Please do not include email addresses in the short description. Use the Contact Email field instead.';
  }

  // URL pattern (http, https, www, or common domains)
  const urlRegex = /(https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.(com|ca|org|net|co|io|biz|info)[^\s]*/i;
  if (urlRegex.test(text)) {
    return 'Please do not include website URLs in the short description. Use the Website field instead.';
  }

  // Phone number patterns (various formats)
  // Matches: 123-456-7890, (123) 456-7890, 123.456.7890, 1234567890, +1 123 456 7890
  const phoneRegex = /(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  if (phoneRegex.test(text)) {
    return 'Please do not include phone numbers in the short description. Use the Phone field instead.';
  }

  return null;
}
