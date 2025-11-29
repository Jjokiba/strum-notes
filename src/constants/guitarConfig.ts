/**
 * Guitar Configuration Constants
 * 
 * This file centralizes all guitar-related configuration data:
 * - String tunings
 * - Chromatic note scale
 * - Fretboard dimensions
 */

// ============= FRETBOARD STRUCTURE =============

/**
 * Total number of frets on the guitar neck
 * Standard guitars typically have 16-24 frets
 */
export const TOTAL_FRETS = 16;

// ============= STRING TUNING =============

/**
 * Standard guitar tuning (from highest to lowest pitch)
 * Format: NoteName + Octave number
 * 
 * Index 0 = Highest string (thinnest) = High E (E4)
 * Index 1 = B string (B3)
 * Index 2 = G string (G3)
 * Index 3 = D string (D3)
 * Index 4 = A string (A2)
 * Index 5 = Lowest string (thickest) = Low E (E2)
 */
export const OPEN_STRINGS = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];

// ============= MUSICAL SCALE =============

/**
 * Complete chromatic scale (all 12 notes in Western music)
 * This represents one octave, repeating every 12 semitones
 * 
 * Used to calculate notes at different frets:
 * - Each fret moves up one semitone (one position in this array)
 * - After note 'B', we return to 'C' and increment the octave
 */
export const CHROMATIC_SCALE = [
  'C',   // 0
  'C#',  // 1
  'D',   // 2
  'D#',  // 3
  'E',   // 4
  'F',   // 5
  'F#',  // 6
  'G',   // 7
  'G#',  // 8
  'A',   // 9
  'A#',  // 10
  'B'    // 11
] as const;

// ============= VISUAL CONFIGURATION =============

/**
 * String thickness mapping (in pixels)
 * Thinner strings = higher pitch
 */
export const STRING_THICKNESS = {
  HIGH_STRINGS: 1,    // Strings 1-2 (E, B)
  MID_STRINGS: 2,     // Strings 3-4 (G, D)
  LOW_STRINGS: 3      // Strings 5-6 (A, E)
} as const;

/**
 * Fret marker positions (decorative dots on fretboard)
 * These help guitarists navigate the fretboard visually
 */
export const FRET_MARKERS = {
  SINGLE_DOTS: [3, 5, 7, 9, 15] as number[],  // Single dot frets
  DOUBLE_DOT: 12                               // Double dot (octave marker)
};
