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

// Play a tone for a given note
export const playNote = (note: string, duration: number = 0.5): void => {
  const ctx = getAudioContext();
  
  // Create oscillator for the note
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Set frequency
  const frequency = getFrequency(note);
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  // Use a more guitar-like waveform (triangle wave)
  oscillator.type = 'triangle';
  
  // Envelope: quick attack, gradual decay
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01); // Quick attack
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration); // Decay
  
  // Start and stop
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
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
