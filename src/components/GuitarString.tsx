import Fret from "./Fret";
import { getNoteAtFret, playNote } from "@/utils/audioUtils";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { STRING_THICKNESS } from "@/constants/guitarConfig";

/**
 * GuitarString Component
 * 
 * Represents a single string on the guitar fretboard.
 * Manages note selection, audio playback, and string state.
 * 
 * KEY RESPONSIBILITIES:
 * 1. Render all frets (0-16) for this string
 * 2. Track which fret is currently selected (only one per string)
 * 3. Play the selected note when conditions are met (Ctrl + hover)
 * 4. Handle string enable/disable state
 * 5. Display string vibration animation during playback
 */

interface GuitarStringProps {
  /** The note this string plays when open (e.g., "E4") */
  openNote: string;
  /** String number 1-6 (determines visual thickness) */
  stringNumber: number;
  /** Total number of frets to render (0-16 = 17 frets) */
  totalFrets: number;
  /** If true, allows multiple strings to sound simultaneously */
  isPolyphonic: boolean;
  /** If true, prevents string interaction */
  isMenuOpen: boolean;
  /** If true, allows string playback on hover */
  isCtrlPressed: boolean;
}

const GuitarString = ({ openNote, stringNumber, totalFrets, isPolyphonic, isMenuOpen, isCtrlPressed }: GuitarStringProps) => {
  
  // ============= COMPONENT STATE =============
  
  /** 
   * Currently selected fret on this string (0-16)
   * Default: 0 (open string)
   * Only one fret can be selected at a time per string
   */
  const [selectedFret, setSelectedFret] = useState<number>(0);
  
  /** 
   * Visual state: shows vibration animation during playback
   * Triggers for 300ms when note is played
   */
  const [isVibrating, setIsVibrating] = useState(false);
  
  /** 
   * String enable/disable state
   * When disabled: string appears grey and cannot be played or selected
   */
  const [isDisabled, setIsDisabled] = useState(false);

  // ============= VISUAL CONFIGURATION =============
  
  /**
   * Calculate string thickness based on string number
   * Higher strings (1-2) = thinner = 1px
   * Middle strings (3-4) = medium = 2px
   * Lower strings (5-6) = thicker = 3px
   */
  const stringThickness = stringNumber <= 2 
    ? STRING_THICKNESS.HIGH_STRINGS 
    : stringNumber <= 4 
      ? STRING_THICKNESS.MID_STRINGS 
      : STRING_THICKNESS.LOW_STRINGS;

  // ============= EVENT HANDLERS =============
  
  /**
   * Play the currently selected note on this string
   * 
   * CONDITIONS REQUIRED TO PLAY:
   * 1. String must NOT be disabled
   * 2. Info menu must NOT be open
   * 3. Ctrl key MUST be pressed
   * 
   * AUDIO BEHAVIOR:
   * - Monophonic mode: stops all other notes before playing
   * - Polyphonic mode: plays alongside other strings
   * 
   * VISUAL FEEDBACK:
   * - Triggers string vibration animation for 300ms
   */
  const playCurrentNote = () => {
    // Safety checks: don't play if conditions aren't met
    if (isDisabled || isMenuOpen || !isCtrlPressed) return;
    
    // Calculate which note to play based on selected fret
    const note = getNoteAtFret(openNote, selectedFret);
    
    // Play the note (stopPrevious = true in monophonic mode)
    playNote(note, 0.8, !isPolyphonic);
    
    // Show visual feedback: string vibration animation
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 300);
  };

  /**
   * Mouse hover event handler
   * Triggered when mouse enters the string area
   */
  const handleStringHover = () => {
    playCurrentNote();
  };

  /**
   * String click handler - toggles string enable/disable
   * 
   * IMPORTANT: Only triggers when clicking the string LINE itself,
   * not when clicking on fret checkboxes or note labels
   * 
   * This is checked via: e.target === e.currentTarget
   */
  const handleStringClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDisabled(!isDisabled);
    }
  };

  /**
   * Checkbox change handler
   * 
   * BEHAVIOR:
   * - Only one checkbox can be selected at a time per string
   * - Checking a new checkbox automatically unchecks the previous one
   * - Disabled strings cannot change selection
   * 
   * @param fretNumber - The fret number (0-16) that was checked
   * @param checked - Whether the checkbox is now checked
   */
  const handleCheckChange = (fretNumber: number, checked: boolean) => {
    if (isDisabled) return;
    if (checked) {
      setSelectedFret(fretNumber);
    }
  };

  // ============= RENDER =============
  
  return (
    <div className="relative flex items-center mb-4" onMouseEnter={handleStringHover}>
      {/* 
        String visual line (runs horizontally across all frets)
        - Color: golden/brown when enabled, grey when disabled
        - Thickness: varies by string number (1-3px)
        - Clickable: toggles enable/disable state
        - Animated: vibrates when note is playing
      */}
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

      {/* 
        ============= FRET LOOP =============
        
        Generates all frets for this string (0-16 = 17 total)
        
        HOW IT WORKS:
        1. Array.from creates array [0, 1, 2, ... 16]
        2. For each fret number, calculate the note at that position
        3. Render a Fret component with that note
        
        FRET COMPONENT RECEIVES:
        - fretNumber: Position (0 = open, 1-16 = fretted)
        - note: Musical note at that position (e.g., "F4", "C3")
        - isChecked: Is this the currently selected fret?
        - onCheckChange: Callback when checkbox is clicked
        - onHover: Callback when mouse enters fret area
        
        DISABLED BEHAVIOR:
        When string is disabled, frets get opacity-50 and pointer-events-none
      */}
      <div className={cn("flex", isDisabled && "opacity-50 pointer-events-none")}>
        {Array.from({ length: totalFrets + 1 }, (_, i) => {
          // Calculate what note this fret produces on this string
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
