import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface FretProps {
  fretNumber: number;
  note: string;
  isChecked: boolean;
  onCheckChange: (checked: boolean) => void;
  onHover: () => void;
}

const Fret = ({ fretNumber, note, isChecked, onCheckChange, onHover }: FretProps) => {
  // Fret markers appear at 3, 5, 7, 9, 12, 15
  const hasDot = [3, 5, 7, 9, 15].includes(fretNumber);
  const hasDoubleDot = fretNumber === 12;

  return (
    <div
      className="relative flex-shrink-0 flex flex-col items-center justify-center group"
      style={{ width: fretNumber === 0 ? '60px' : '80px' }}
      onMouseEnter={onHover}
    >
      {/* Fret wire (vertical line) */}
      {fretNumber > 0 && (
        <div className="absolute left-0 w-[3px] h-full bg-fretboard-marker shadow-md" />
      )}
      
      {/* Clickable area */}
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-1 py-2">
        {/* Checkbox */}
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheckChange}
          className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        
        {/* Note label */}
        <div
          className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-md transition-all duration-200",
            isChecked
              ? "bg-primary text-primary-foreground"
              : "bg-fretboard-notebg text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:bg-secondary"
          )}
        >
          {note}
        </div>

        {/* Fret marker dots */}
        {hasDot && (
          <div className="absolute bottom-1 w-2 h-2 rounded-full bg-fretboard-dot opacity-40" />
        )}
        {hasDoubleDot && (
          <>
            <div className="absolute top-1 w-2 h-2 rounded-full bg-fretboard-dot opacity-40" />
            <div className="absolute bottom-1 w-2 h-2 rounded-full bg-fretboard-dot opacity-40" />
          </>
        )}
      </div>
    </div>
  );
};

export default Fret;
