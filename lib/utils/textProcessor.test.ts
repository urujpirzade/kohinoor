/**
 * Unit tests for Text Processor
 */

import {
  transliterateDevanagari,
  processPDFText,
  getPDFTextProcessingNote,
} from './textProcessor';

describe('Text Processor', () => {
  describe('transliterateDevanagari', () => {
    it('should return empty string for empty input', () => {
      expect(transliterateDevanagari('')).toBe('');
    });

    it('should return unchanged text for non-Devanagari text', () => {
      expect(transliterateDevanagari('Hello World')).toBe('Hello World');
      expect(transliterateDevanagari('123 ABC')).toBe('123 ABC');
    });

    it('should transliterate basic Devanagari vowels', () => {
      // Using Unicode escape sequences for Devanagari characters
      expect(transliterateDevanagari('\u0905')).toBe('a'); // अ
      expect(transliterateDevanagari('\u0906')).toBe('aa'); // आ
      expect(transliterateDevanagari('\u0907')).toBe('i'); // इ
    });

    it('should transliterate basic Devanagari consonants', () => {
      expect(transliterateDevanagari('\u0915')).toBe('ka'); // क
      expect(transliterateDevanagari('\u0916')).toBe('kha'); // ख
      expect(transliterateDevanagari('\u0917')).toBe('ga'); // ग
    });

    it('should handle mixed text', () => {
      expect(transliterateDevanagari('Hello \u0905 World')).toBe(
        'Hello a World',
      );
      expect(transliterateDevanagari('\u0915 Day')).toBe('ka Day');
    });

    it('should use placeholder for unmapped characters', () => {
      const result = transliterateDevanagari('\u0950'); // Om symbol
      expect(result).toBe('?');
    });
  });

  describe('processPDFText', () => {
    it('should return empty string for empty input', () => {
      expect(processPDFText('')).toBe('');
    });

    it('should handle null and undefined input', () => {
      expect(processPDFText(null as string)).toBe(null);
      expect(processPDFText(undefined as string)).toBe(undefined);
    });

    it('should process Devanagari text', () => {
      const result = processPDFText('\u092c\u093e\u0936\u093e'); // बाशा
      expect(result).not.toMatch(/[\u0900-\u097F]/);
      expect(result).toMatch(/[a-zA-Z?]+/);
    });

    it('should handle smart quotes', () => {
      expect(processPDFText('\u201cHello\u201d')).toBe('"Hello"');
      expect(processPDFText('\u2018Hello\u2019')).toBe("'Hello'");
    });

    it('should handle dashes', () => {
      expect(processPDFText('Hello\u2014World')).toBe('Hello-World');
      expect(processPDFText('Hello\u2013World')).toBe('Hello-World');
    });

    it('should handle ellipsis', () => {
      expect(processPDFText('Hello\u2026')).toBe('Hello...');
    });

    it('should preserve English text and numbers', () => {
      const input = 'John Doe 123 ABC';
      expect(processPDFText(input)).toBe('John Doe 123 ABC');
    });
  });

  describe('getPDFTextProcessingNote', () => {
    it('should return informational note', () => {
      const note = getPDFTextProcessingNote();
      expect(note).toContain('Devanagari');
      expect(note).toContain('transliterated');
      expect(note).toContain('PDF compatibility');
    });
  });
});
