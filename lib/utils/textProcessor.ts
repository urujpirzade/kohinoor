/**
 * Text Processing Utilities for PDF Compatibility
 *
 * This module handles text processing for PDF generation, including
 * transliteration of Devanagari script and other Unicode characters
 * that are not supported by jsPDF's default fonts.
 */

/**
 * Basic Devanagari to Latin transliteration map
 * This provides a fallback for common Marathi/Hindi characters
 */
const devanagariToLatinMap: Record<string, string> = {
  // Vowels
  अ: 'a',
  आ: 'aa',
  इ: 'i',
  ई: 'ii',
  उ: 'u',
  ऊ: 'uu',
  ए: 'e',
  ऐ: 'ai',
  ओ: 'o',
  औ: 'au',

  // Consonants
  क: 'ka',
  ख: 'kha',
  ग: 'ga',
  घ: 'gha',
  ङ: 'nga',
  च: 'cha',
  छ: 'chha',
  ज: 'ja',
  झ: 'jha',
  ञ: 'nja',
  ट: 'ta',
  ठ: 'tha',
  ड: 'da',
  ढ: 'dha',
  ण: 'na',
  त: 'ta',
  थ: 'tha',
  द: 'da',
  ध: 'dha',
  न: 'na',
  प: 'pa',
  फ: 'pha',
  ब: 'ba',
  भ: 'bha',
  म: 'ma',
  य: 'ya',
  र: 'ra',
  ल: 'la',
  व: 'va',
  श: 'sha',
  ष: 'sha',
  स: 'sa',
  ह: 'ha',

  // Vowel signs (matras)
  'ा': 'aa',
  'ि': 'i',
  'ी': 'ii',
  'ु': 'u',
  'ू': 'uu',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',

  // Special characters
  '्': '', // Virama (halant) - removes inherent vowel
  'ं': 'n', // Anusvara
  'ः': 'h', // Visarga
  '।': '.', // Devanagari danda (full stop)
  '॥': '||', // Double danda
};

/**
 * Transliterates Devanagari text to Latin script for PDF compatibility
 * @param text - Text that may contain Devanagari characters
 * @returns Transliterated text using Latin characters
 */
export function transliterateDevanagari(text: string): string {
  if (!text) return text;

  let result = '';

  for (const char of text) {
    if (devanagariToLatinMap[char]) {
      result += devanagariToLatinMap[char];
    } else if (char.match(/[\u0900-\u097F]/)) {
      // If it's a Devanagari character not in our map, use a placeholder
      result += '?';
    } else {
      // Keep non-Devanagari characters as-is
      result += char;
    }
  }

  return result;
}

/**
 * Processes text for PDF compatibility by handling Unicode characters
 * that are not supported by jsPDF's default fonts
 * @param text - Input text that may contain unsupported characters
 * @returns PDF-compatible text
 */
export function processPDFText(text: string): string {
  if (!text) return text;

  // First, transliterate Devanagari characters
  let processedText = transliterateDevanagari(text);

  // Handle other common Unicode issues
  processedText = processedText
    // Replace smart quotes with regular quotes
    .replace(/[\u201C\u201D]/g, '"') // Left and right double quotation marks
    .replace(/[\u2018\u2019]/g, "'") // Left and right single quotation marks
    // Replace em dash and en dash with regular dash
    .replace(/[\u2014\u2013]/g, '-') // Em dash and en dash
    // Replace ellipsis with three dots
    .replace(/\u2026/g, '...') // Horizontal ellipsis
    // Remove or replace other problematic Unicode characters
    .replace(/[^\x00-\x7F]/g, (match) => {
      // If it's still a non-ASCII character after above replacements, replace with ?
      return '?';
    });

  return processedText;
}

/**
 * Creates a note about text processing for PDF reports
 * @returns Informational text about transliteration
 */
export function getPDFTextProcessingNote(): string {
  return 'Note: Devanagari text has been transliterated to Latin script for PDF compatibility.';
}
