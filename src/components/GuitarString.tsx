import Fret from "./Fret";
import { getNoteAtFret, playNote } from "@/utils/audioUtils";
import { useState } from "react";

interface GuitarStringProps {
  openNote: string;
  stringNumber: number;
  totalFrets: number;
}

const GuitarString = ({ openNote, stringNumber, totalFrets }: GuitarStringProps) => {
  const [selectedFret, setSelectedFret] = useState<number | null>(null);

  // String thickness varies by string number
  const stringThickness = stringNumber <= 2 ? 1 : stringNumber <= 4 ? 2 : 3;

  const handleFretClick = (fretNumber: number) => {
    const note = getNoteAtFret(openNote, fretNumber);
    playNote(note);
    setSelectedFret(fretNumber);
    
    // Clear selection after a short time
    setTimeout(() => setSelectedFret(null), 500);
  };

  return (
    <div className="relative flex items-center mb-1">
      {/* String line that runs across all frets */}
      <div
        className="absolute left-0 right-0 bg-fretboard-string opacity-50"
        style={{ height: `${stringThickness}px` }}
      />
      
      {/* String label */}
      <div className="absolute left-2 z-10 text-xs font-bold text-foreground bg-background px-1 rounded">
        {openNote}
      </div>

      {/* Frets */}
      <div className="flex">
        {Array.from({ length: totalFrets + 1 }, (_, i) => {
          const note = getNoteAtFret(openNote, i);
          return (
            <Fret
              key={i}
              fretNumber={i}
              note={note}
              isSelected={selectedFret === i}
              onClick={() => handleFretClick(i)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GuitarString;
