import { cn } from "@/lib/utils";

interface FretProps {
  fretNumber: number;
  note: string;
  isSelected: boolean;
  onClick: () => void;
}

const Fret = ({ fretNumber, note, isSelected, onClick }: FretProps) => {
  // Fret markers appear at 3, 5, 7, 9, 12, 15
  const hasDot = [3, 5, 7, 9, 15].includes(fretNumber);
  const hasDoubleDot = fretNumber === 12;

  return (
    <div
      className="relative flex-shrink-0 flex items-center justify-center cursor-pointer group"
      style={{ width: fretNumber === 0 ? '60px' : '80px' }}
      onClick={onClick}
    >
      {/* Fret wire (vertical line) */}
      {fretNumber > 0 && (
        <div className="absolute left-0 w-[3px] h-full bg-fretboard-marker shadow-md" />
      )}
      
      {/* Clickable area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Note label */}
        <div
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-md transition-all duration-200",
            isSelected
              ? "bg-primary text-primary-foreground scale-110 animate-note-pulse"
              : "bg-fretboard-notebg text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:bg-secondary"
          )}
        >
          {note}
        </div>

        {/* Fret marker dots */}
        {hasDot && (
          <div className="absolute bottom-2 w-2 h-2 rounded-full bg-fretboard-dot opacity-40" />
        )}
        {hasDoubleDot && (
          <>
            <div className="absolute top-2 w-2 h-2 rounded-full bg-fretboard-dot opacity-40" />
            <div className="absolute bottom-2 w-2 h-2 rounded-full bg-fretboard-dot opacity-40" />
          </>
        )}
      </div>
    </div>
  );
};

export default Fret;
