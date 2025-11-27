import Fret from "./Fret";
import { getNoteAtFret, playNote } from "@/utils/audioUtils";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GuitarStringProps {
  openNote: string;
  stringNumber: number;
  totalFrets: number;
}

const GuitarString = ({ openNote, stringNumber, totalFrets }: GuitarStringProps) => {
  const [checkedFrets, setCheckedFrets] = useState<Set<number>>(new Set());
  const [isVibrating, setIsVibrating] = useState(false);

  // String thickness varies by string number
  const stringThickness = stringNumber <= 2 ? 1 : stringNumber <= 4 ? 2 : 3;

  const handleFretHover = (fretNumber: number) => {
    const note = getNoteAtFret(openNote, fretNumber);
    playNote(note, 0.3);
    
    // Trigger string vibration animation
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 300);
  };

  const handleCheckChange = (fretNumber: number, checked: boolean) => {
    const newChecked = new Set(checkedFrets);
    if (checked) {
      newChecked.add(fretNumber);
    } else {
      newChecked.delete(fretNumber);
    }
    setCheckedFrets(newChecked);
  };

  return (
    <div className="relative flex items-center mb-4">
      {/* String line that runs across all frets */}
      <div
        className={cn(
          "absolute left-0 right-0 bg-fretboard-string opacity-50 transition-all duration-100",
          isVibrating && "animate-string-vibrate"
        )}
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
              isChecked={checkedFrets.has(i)}
              onCheckChange={(checked) => handleCheckChange(i, checked)}
              onHover={() => handleFretHover(i)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GuitarString;
