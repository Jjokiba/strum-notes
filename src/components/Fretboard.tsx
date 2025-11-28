import GuitarString from "./GuitarString";
import { Music, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const TOTAL_FRETS = 16;
const OPEN_STRINGS = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']; // Standard tuning (high to low)

const Fretboard = () => {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-background relative">
      {/* Collapsible Info Menu */}
      <div className="fixed top-4 right-4 z-50 w-80">
        <Collapsible open={infoOpen} onOpenChange={setInfoOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 bg-card text-card-foreground px-4 py-2 rounded-lg shadow-lg border border-border hover:bg-accent transition-colors w-full">
            <ChevronRight className={`w-4 h-4 transition-transform ${infoOpen ? 'rotate-90' : ''}`} />
            <span className="font-semibold">Info & Concepts</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 bg-card text-card-foreground rounded-lg shadow-lg border border-border p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Understanding the Fretboard</h3>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Musical Notes</h3>
                <p className="text-sm text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">String Interaction</h3>
                <p className="text-sm text-muted-foreground">
                  Click on the string line to disable/enable it. Select one note per string by clicking the checkbox. 
                  Hover over any string to play the selected note with realistic guitar sound.
                </p>
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
          Select one note per string by checking a fret. Slide your mouse over any string to play its selected note with realistic guitar sound.
        </p>
        <p className="text-xs opacity-75">
          Click on the string line to disable/enable it (disabled strings appear grey). Open strings (fret 0) are selected by default.
        </p>
      </div>
    </div>
  );
};

export default Fretboard;
