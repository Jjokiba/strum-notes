import GuitarString from "./GuitarString";
import { Music, ChevronRight, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetPortal, SheetOverlay } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { TOTAL_FRETS, OPEN_STRINGS } from "@/constants/guitarConfig";

/**
 * Fretboard Component
 * 
 * Main component that renders an interactive guitar fretboard.
 * 
 * COMPONENT STRUCTURE:
 * - Info Sheet (right side): Educational content about guitar concepts
 * - Note Legend (left side): Shows note names in different notations
 * - Fretboard Grid: Renders 6 strings × 17 frets (0-16)
 * 
 * KEY INTERACTIONS:
 * 1. Hold Ctrl key + hover over strings → plays the selected note on that string
 * 2. Click checkboxes → select which note to play on each string
 * 3. Click string line → disable/enable entire string
 * 4. Polyphonic mode toggle → play multiple strings simultaneously or one at a time
 */

const Fretboard = () => {
  // ============= COMPONENT STATE =============
  
  /** Controls visibility of the note legend panel (left side) */
  const [noteLegendOpen, setNoteLegendOpen] = useState(false);
  
  /** Toggle between monophonic (one string) and polyphonic (multiple strings) playback */
  const [isPolyphonic, setIsPolyphonic] = useState(false);
  
  /** Tracks if the info/concepts menu is open (prevents string interaction when true) */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  /** Tracks if Ctrl/Cmd key is currently pressed (required to play strings) */
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  // ============= KEYBOARD EVENT HANDLERS =============
  
  /**
   * Track Ctrl/Cmd key state for string interaction
   * 
   * Why: Strings only play sound when Ctrl is held + mouse hovers
   * This prevents accidental sound playback while navigating the UI
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', () => setIsCtrlPressed(false));

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', () => setIsCtrlPressed(false));
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-background relative">
      {/* Info & Concepts Sheet - Right Side */}
      <div className="fixed top-4 right-4 z-50">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-lg">
              <Info className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetPortal>
            <SheetOverlay className="bg-transparent" />
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Info & Concepts</SheetTitle>
            </SheetHeader>
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="fretboard">
                <AccordionTrigger>Understanding the Fretboard</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="notes">
                <AccordionTrigger>Musical Notes</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="interaction">
                <AccordionTrigger>String Interaction</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Click on the string line to disable/enable it. Select one note per string by clicking the checkbox. 
                    Hover over any string to play the selected note with realistic guitar sound.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            </SheetContent>
          </SheetPortal>
        </Sheet>
      </div>

      {/* Note Legend - Left Side */}
      <div className="fixed top-4 left-4 z-50 w-64">
        <Collapsible open={noteLegendOpen} onOpenChange={setNoteLegendOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-lg border border-border hover:bg-accent transition-colors w-full">
            <ChevronRight className={`w-4 h-4 transition-transform ${noteLegendOpen ? 'rotate-90' : ''}`} />
            <span className="font-semibold">Note Names</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 bg-card text-card-foreground rounded-lg shadow-lg border border-border p-4">
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold mb-2 text-foreground">Solfège (Latin):</p>
                <div className="grid grid-cols-7 gap-2 text-center">
                  <div className="font-medium">DO</div>
                  <div className="font-medium">RE</div>
                  <div className="font-medium">MI</div>
                  <div className="font-medium">FA</div>
                  <div className="font-medium">SOL</div>
                  <div className="font-medium">LA</div>
                  <div className="font-medium">SI</div>
                </div>
              </div>
              <div className="text-sm border-t border-border pt-3">
                <p className="font-semibold mb-2 text-foreground">English Notation:</p>
                <div className="grid grid-cols-7 gap-2 text-center">
                  <div className="font-medium">C</div>
                  <div className="font-medium">D</div>
                  <div className="font-medium">E</div>
                  <div className="font-medium">F</div>
                  <div className="font-medium">G</div>
                  <div className="font-medium">A</div>
                  <div className="font-medium">B</div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Guitar Fretboard</h1>
        </div>
        <p className="text-muted-foreground">Select one note per string • Hold Ctrl and slide over strings to play • Click strings to disable • Standard tuning (EADGBE)</p>
        
        {/* Polyphonic Mode Toggle */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Switch 
            id="polyphonic-mode" 
            checked={isPolyphonic}
            onCheckedChange={setIsPolyphonic}
          />
          <Label htmlFor="polyphonic-mode" className="cursor-pointer">
            Polyphonic Mode {isPolyphonic ? "(Multiple strings at once)" : "(One string at a time)"}
          </Label>
        </div>
      </div>

      <div className="w-full max-w-7xl overflow-x-auto">
        <div className="bg-fretboard-wood rounded-lg p-6 shadow-2xl min-w-max">
          {/* Fret numbers */}
          <div className="flex mb-2 pl-12">
            {Array.from({ length: TOTAL_FRETS + 1 }, (_, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground font-semibold"
                style={{ width: i === 0 ? '60px' : '80px' }}
              >
                {i}
              </div>
            ))}
          </div>

          {/* Nut (left edge of fretboard) */}
          <div className="absolute left-6 top-20 bottom-6 w-1 bg-foreground rounded-full opacity-70" />

          {/* 
            ============= STRING RENDERING LOOP =============
            
            Iterates through each guitar string and renders a GuitarString component.
            
            ARRAY STRUCTURE (OPEN_STRINGS):
            Index 0: 'E4' → High E (thinnest string, highest pitch)
            Index 1: 'B3' → B string
            Index 2: 'G3' → G string
            Index 3: 'D3' → D string
            Index 4: 'A2' → A string
            Index 5: 'E2' → Low E (thickest string, lowest pitch)
            
            EVENTS FLOW:
            1. User holds Ctrl key → isCtrlPressed becomes true
            2. User hovers over string → GuitarString.onMouseEnter fires
            3. GuitarString checks: !isDisabled && !isMenuOpen && isCtrlPressed
            4. If all conditions met → playNote() is called
            5. String vibration animation triggers
            
            PROPS PASSED TO EACH STRING:
            - openNote: Starting note for that string (e.g., "E4")
            - stringNumber: 1-6, used for visual thickness
            - totalFrets: Number of frets to render (16)
            - isPolyphonic: Play multiple strings or stop previous note
            - isMenuOpen: Disable playback when menu is open
            - isCtrlPressed: Only play when Ctrl is held
          */}
          <div className="space-y-2">
            {OPEN_STRINGS.map((openNote, index) => (
              <GuitarString
                key={openNote}
                openNote={openNote}
                stringNumber={index + 1}
                totalFrets={TOTAL_FRETS}
                isPolyphonic={isPolyphonic}
                isMenuOpen={isMenuOpen}
                isCtrlPressed={isCtrlPressed}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p className="mb-2">
          Select one note per string by checking a fret. <strong>Hold Ctrl key</strong> and slide your mouse over strings to play the selected notes with realistic guitar sound.
        </p>
        <p className="text-xs opacity-75">
          <strong>To disable a string:</strong> Click directly on the colored string line (disabled strings appear grey). Open strings (fret 0) are selected by default.
        </p>
      </div>
    </div>
  );
};

export default Fretboard;
