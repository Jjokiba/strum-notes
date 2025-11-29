import Fret from "./Fret";
import { getNoteAtFret, playNote } from "@/utils/audioUtils";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GuitarStringProps {
  openNote: string;
  stringNumber: number;
  totalFrets: number;
  isPolyphonic: boolean;
  isMenuOpen: boolean;
  isCtrlPressed: boolean;
}

const GuitarString = ({ openNote, stringNumber, totalFrets, isPolyphonic, isMenuOpen, isCtrlPressed }: GuitarStringProps) => {
  const [selectedFret, setSelectedFret] = useState<number>(0); // Default to open string
  const [isVibrating, setIsVibrating] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // String thickness varies by string number
  const stringThickness = stringNumber <= 2 ? 1 : stringNumber <= 4 ? 2 : 3;

  const playCurrentNote = () => {
    if (isDisabled || isMenuOpen || !isCtrlPressed) return;
    
    const note = getNoteAtFret(openNote, selectedFret);
    playNote(note, 0.8, !isPolyphonic); // Stop previous notes if not in polyphonic mode
    
    // Trigger string vibration animation
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 300);
  };

  const handleStringHover = () => {
    playCurrentNote();
  };

  const handleStringClick = (e: React.MouseEvent) => {
    // Only toggle disabled if clicking on the string line itself, not on frets
    if (e.target === e.currentTarget) {
      setIsDisabled(!isDisabled);
    }
  };

  const handleCheckChange = (fretNumber: number, checked: boolean) => {
    if (isDisabled) return;
    if (checked) {
      setSelectedFret(fretNumber);
    }
  };

  return (
    <div className="relative flex items-center mb-4" onMouseEnter={handleStringHover}>
      {/* String line that runs across all frets */}
      <div
        className={cn(
          "absolute left-0 right-0 transition-all duration-200 cursor-pointer hover:opacity-80",
          isDisabled ? "bg-muted opacity-40" : "bg-fretboard-string opacity-50",
          !isDisabled && isVibrating && "animate-string-vibrate"
        )}
        style={{ height: `${stringThickness}px` }}
        onClick={handleStringClick}
        title={isDisabled ? "Click to enable string" : "Click to disable string"}
      />
      
      {/* String label */}
      <div className={cn(
        "absolute left-2 z-10 text-xs font-bold bg-background px-1 rounded transition-colors",
        isDisabled ? "text-muted-foreground" : "text-foreground"
      )}>
        {openNote}
      </div>

      {/* Frets */}
      <div className={cn("flex", isDisabled && "opacity-50 pointer-events-none")}>
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
