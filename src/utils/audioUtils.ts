// Web Audio API utility for generating guitar note tones

let audioContext: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];

// Stop all currently playing notes
export const stopAllNotes = (): void => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  activeOscillators.forEach(osc => {
    try {
      osc.stop(now);
    } catch (e) {
      // Oscillator may already be stopped
    }
  });
  
  activeOscillators = [];
};

// Initialize the audio context
const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Calculate frequency for a note (A4 = 440Hz as reference)
const getFrequency = (note: string): number => {
  const noteFrequencies: { [key: string]: number } = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88,
  };

  // Extract note name and octave
  const noteName = note.slice(0, -1);
  const octave = parseInt(note.slice(-1));
  
  // Base frequency from the map
  const baseFreq = noteFrequencies[noteName] || 440;
  
  // Adjust for octave (A4 is our reference at 440Hz)
  const octaveOffset = octave - 4;
  const frequency = baseFreq * Math.pow(2, octaveOffset);
  
  return frequency;
};

// Play a tone that sounds more like a real acoustic guitar
export const playNote = (note: string, duration: number = 0.5, stopPrevious: boolean = false): void => {
  const ctx = getAudioContext();
  const frequency = getFrequency(note);
  
  // Stop previous notes if in monophonic mode
  if (stopPrevious) {
    stopAllNotes();
  }
  
  // Create multiple oscillators for harmonics (makes it sound more guitar-like)
  const fundamental = ctx.createOscillator();
  const harmonic2 = ctx.createOscillator();
  const harmonic3 = ctx.createOscillator();
  
  // Track these oscillators
  activeOscillators.push(fundamental, harmonic2, harmonic3);
  
  // Create gain nodes for mixing
  const fundamentalGain = ctx.createGain();
  const harmonic2Gain = ctx.createGain();
  const harmonic3Gain = ctx.createGain();
  const masterGain = ctx.createGain();
  
  // Create a filter to shape the tone
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  filter.Q.setValueAtTime(1, ctx.currentTime);
  
  // Set up frequencies - fundamental and harmonics
  fundamental.frequency.setValueAtTime(frequency, ctx.currentTime);
  harmonic2.frequency.setValueAtTime(frequency * 2, ctx.currentTime);
  harmonic3.frequency.setValueAtTime(frequency * 3, ctx.currentTime);
  
  // Use triangle wave for warmer sound
  fundamental.type = 'triangle';
  harmonic2.type = 'triangle';
  harmonic3.type = 'sine';
  
  // Connect oscillators to their gain nodes
  fundamental.connect(fundamentalGain);
  harmonic2.connect(harmonic2Gain);
  harmonic3.connect(harmonic3Gain);
  
  // Mix harmonics (fundamental is loudest, harmonics add color)
  fundamentalGain.gain.setValueAtTime(1.0, ctx.currentTime);
  harmonic2Gain.gain.setValueAtTime(0.3, ctx.currentTime);
  harmonic3Gain.gain.setValueAtTime(0.15, ctx.currentTime);
  
  // Connect to filter and master gain
  fundamentalGain.connect(filter);
  harmonic2Gain.connect(filter);
  harmonic3Gain.connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);
  
  // Guitar-like ADSR envelope
  const now = ctx.currentTime;
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.3, now + 0.005); // Very quick attack (pluck)
  masterGain.gain.exponentialRampToValueAtTime(0.15, now + 0.1); // Quick decay
  masterGain.gain.exponentialRampToValueAtTime(0.05, now + duration * 0.5); // Sustain
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release
  
  // Animate filter for more realistic sound
  filter.frequency.exponentialRampToValueAtTime(800, now + duration);
  
  // Start and stop all oscillators
  fundamental.start(now);
  harmonic2.start(now);
  harmonic3.start(now);
  
  fundamental.stop(now + duration);
  harmonic2.stop(now + duration);
  harmonic3.stop(now + duration);
  
  // Remove from active oscillators after they stop
  setTimeout(() => {
    activeOscillators = activeOscillators.filter(
      osc => osc !== fundamental && osc !== harmonic2 && osc !== harmonic3
    );
  }, duration * 1000);
};

/**
 * Calculate the musical note at any fret on a guitar string
 * 
 * How it works:
 * 1. Takes the open string note (e.g., "E4")
 * 2. Moves up the chromatic scale by the number of frets
 * 3. Handles octave changes when passing note 'B'
 * 
 * @param openNote - The note of the open string (e.g., "E4", "A2")
 * @param fret - The fret number (0 = open string, 1-16 = fretted)
 * @returns The resulting note (e.g., "F4", "C3")
 * 
 * Example: 
 * - getNoteAtFret("E4", 0) → "E4" (open string)
 * - getNoteAtFret("E4", 1) → "F4" (1 semitone up)
 * - getNoteAtFret("E4", 12) → "E5" (1 octave up)
 */
export const getNoteAtFret = (openNote: string, fret: number): string => {
  // All 12 notes in the chromatic scale (repeats every octave)
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Parse the input note
  // "E4" → noteName = "E", octave = 4
  const noteName = openNote.slice(0, -1);
  let octave = parseInt(openNote.slice(-1));
  
  // Find where this note sits in the chromatic scale
  // "E" is at index 4
  let noteIndex = notes.indexOf(noteName);
  
  // Move up the scale by the number of frets
  // Each fret = 1 semitone = 1 position in the array
  noteIndex += fret;
  
  // Handle octave wraparound
  // When we go past 'B' (index 11), start over at 'C' in the next octave
  while (noteIndex >= 12) {
    noteIndex -= 12;
    octave++;
  }
  
  // Return the new note with its octave
  return notes[noteIndex] + octave;
};
