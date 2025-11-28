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
  const [selectedFret, setSelectedFret] = useState<number>(0); // Default to open string
  const [isVibrating, setIsVibrating] = useState(false);

  // String thickness varies by string number
  const stringThickness = stringNumber <= 2 ? 1 : stringNumber <= 4 ? 2 : 3;

  const playCurrentNote = () => {
    const note = getNoteAtFret(openNote, selectedFret);
    playNote(note, 0.3);
    
    // Trigger string vibration animation
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 300);
  };

  const handleStringHover = () => {
    playCurrentNote();
  };

  const handleCheckChange = (fretNumber: number, checked: boolean) => {
    if (checked) {
      setSelectedFret(fretNumber);
    }
  };

  return (
    <div className="relative flex items-center mb-4" onMouseEnter={handleStringHover}>
      {/* String line that runs across all frets */}
      <div
        className={cn(
          "absolute left-0 right-0 bg-fretboard-string opacity-50 transition-all duration-100 cursor-pointer",
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
              isChecked={selectedFret === i}
              onCheckChange={(checked) => handleCheckChange(i, checked)}
              onHover={handleStringHover}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GuitarString;
