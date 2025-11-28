import GuitarString from "./GuitarString";
import { Music, ChevronRight, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetPortal, SheetOverlay } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const TOTAL_FRETS = 16;
const OPEN_STRINGS = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']; // Standard tuning (high to low)

const Fretboard = () => {
  const [noteLegendOpen, setNoteLegendOpen] = useState(false);
  const [isPolyphonic, setIsPolyphonic] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <p className="text-muted-foreground">Select one note per string • Slide over strings to play selected notes • Click strings to disable • Standard tuning (EADGBE)</p>
        
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
                isPolyphonic={isPolyphonic}
                isMenuOpen={isMenuOpen}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
        <p className="mb-2">
          Select one note per string by checking a fret. Slide your mouse over any string to play its selected note with realistic guitar sound.
        </p>
        <p className="text-xs opacity-75">
          <strong>To disable a string:</strong> Click directly on the colored string line (disabled strings appear grey). Open strings (fret 0) are selected by default.
        </p>
      </div>
    </div>
  );
};

export default Fretboard;
