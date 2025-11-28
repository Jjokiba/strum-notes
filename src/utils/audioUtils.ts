// Web Audio API utility for generating guitar note tones

let audioContext: AudioContext | null = null;

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
export const playNote = (note: string, duration: number = 0.5): void => {
  const ctx = getAudioContext();
  const frequency = getFrequency(note);
  
  // Create multiple oscillators for harmonics (makes it sound more guitar-like)
  const fundamental = ctx.createOscillator();
  const harmonic2 = ctx.createOscillator();
  const harmonic3 = ctx.createOscillator();
  
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
};

// Calculate note at a given string and fret
export const getNoteAtFret = (openNote: string, fret: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Extract note name and octave
  const noteName = openNote.slice(0, -1);
  let octave = parseInt(openNote.slice(-1));
  
  // Find index in chromatic scale
  let noteIndex = notes.indexOf(noteName);
  
  // Add fret number to get new note
  noteIndex += fret;
  
  // Handle octave changes
  while (noteIndex >= 12) {
    noteIndex -= 12;
    octave++;
  }
  
  return notes[noteIndex] + octave;
};
