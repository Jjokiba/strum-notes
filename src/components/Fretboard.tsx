import GuitarString from "./GuitarString";
import { Music } from "lucide-react";

const TOTAL_FRETS = 16;
const OPEN_STRINGS = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']; // Standard tuning (high to low)

const Fretboard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Guitar Fretboard</h1>
        </div>
        <p className="text-muted-foreground">Select one note per string • Slide over strings to play selected notes • Standard tuning (EADGBE)</p>
      </div>

      <div className="w-full max-w-7xl overflow-x-auto">
        <div className="bg-fretboard-wood rounded-lg p-6 shadow-2xl min-w-max">
          {/* Fret numbers */}
          <div className="flex mb-4 pl-16">
            {Array.from({ length: TOTAL_FRETS + 1 }, (_, i) => (
              <div
                key={i}
                className="flex-shrink-0 text-center text-xs text-muted-foreground font-semibold"
                style={{ width: i === 0 ? '60px' : '80px' }}
              >
                {i}
              </div>
            ))}
          </div>

          {/* Nut (left edge of fretboard) */}
          <div className="absolute left-6 top-20 bottom-6 w-1 bg-foreground rounded-full opacity-70" />

          {/* Strings */}
          <div className="space-y-2">
            {OPEN_STRINGS.map((openNote, index) => (
              <GuitarString
                key={openNote}
                openNote={openNote}
                stringNumber={index + 1}
                totalFrets={TOTAL_FRETS}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p className="mb-2">
          Select one note per string by checking a fret. Slide your mouse over any string to play its selected note.
        </p>
        <p className="text-xs opacity-75">
          Open strings (fret 0) are selected by default. Fret markers appear at positions 3, 5, 7, 9, 12, and 15.
        </p>
      </div>
    </div>
  );
};

export default Fretboard;
