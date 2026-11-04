import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { CameraMode } from '../../types/apartment';

interface KeyboardGuideProps {
  open: boolean;
  mode: CameraMode;
  onClose: () => void;
}

export const KeyboardGuide: React.FC<KeyboardGuideProps> = ({
  open,
  mode,
  onClose,
}) => {
  const bindings = (() => {
    if (mode === CameraMode.FreeFly) {
      return [
        { keys: 'Right / Left Drag', action: 'Rotate camera look' },
        { keys: 'Middle Drag', action: 'Pan camera laterally' },
        { keys: 'Mouse Wheel', action: 'Zoom in / out' },
        { keys: 'W A S D', action: 'Move horizontally / forward' },
        { keys: 'Q / E', action: 'Move down / up' },
        { keys: 'Shift', action: 'Increase flight speed' },
        { keys: 'F', action: 'Toggle free mouse look' },
        { keys: '1 – 7 / H', action: 'Jump to room / Hide UI' },
      ];
    }
    if (mode === CameraMode.Walk) {
      return [
        { keys: 'W A S D', action: 'Walk through rooms & doors' },
        { keys: 'Drag / L', action: 'Look around (or Lock Mouse)' },
        { keys: 'Shift', action: 'Faster walking speed' },
        { keys: 'Click Object', action: 'Focus & inspect furniture' },
        { keys: '1 – 7 / H', action: 'Jump to room / Hide UI' },
      ];
    }
    return [
      { keys: 'Left Drag', action: 'Orbit 360° around object' },
      { keys: 'Middle / Right Drag', action: 'Pan inspection pivot' },
      { keys: 'Mouse Wheel', action: 'Zoom close (PC glass & PBR)' },
      { keys: 'Click Object', action: 'Focus camera on object' },
      { keys: '1 – 7 / H', action: 'Jump to room / Hide UI' },
    ];
  })();

  const modeTitle =
    mode === CameraMode.FreeFly
      ? 'Free Fly Controls'
      : mode === CameraMode.Walk
        ? 'First-Person Walk Controls'
        : 'Orbit Inspection Controls';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-38 left-5 z-30 w-78 max-w-[calc(100vw-2.5rem)] rounded-xl bg-zinc-950/95 border border-white/14 shadow-2xl p-4 text-zinc-100 pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-xs font-semibold text-white tracking-wide">
              {modeTitle}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
              aria-label="Close controls guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            {bindings.map((row) => (
              <div key={row.keys} className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-amber-200/95 shrink-0">
                  {row.keys}
                </span>
                <span className="text-zinc-300 text-right">{row.action}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
