import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Layers, RotateCcw, X } from 'lucide-react';
import { CutawayConfig } from '../../types/apartment';

interface CutawayPanelProps {
  open: boolean;
  cutaway: CutawayConfig;
  onChangeCutaway: (next: CutawayConfig) => void;
  onRestoreFull: () => void;
  onClose: () => void;
}

export const CutawayPanel: React.FC<CutawayPanelProps> = ({
  open,
  cutaway,
  onChangeCutaway,
  onRestoreFull,
  onClose,
}) => {
  const allRestored =
    cutaway.showCeiling && cutaway.showExteriorWalls && cutaway.showInteriorWalls;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-38 left-1/2 -translate-x-1/2 z-30 w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-zinc-950/95 border border-white/14 shadow-2xl p-4 text-zinc-100 pointer-events-auto"
          aria-label="Cutaway Architectural Controls"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-200" />
              <h3 className="font-display text-xs font-semibold text-white tracking-wide">
                Cutaway Architecture
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
              aria-label="Close cutaway controls"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-zinc-200">Show Ceiling Slab</span>
              <input
                type="checkbox"
                checked={cutaway.showCeiling}
                onChange={() =>
                  onChangeCutaway({
                    ...cutaway,
                    showCeiling: !cutaway.showCeiling,
                  })
                }
                className="w-4 h-4 accent-amber-200 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-zinc-200">Show Exterior Facade Walls</span>
              <input
                type="checkbox"
                checked={cutaway.showExteriorWalls}
                onChange={() =>
                  onChangeCutaway({
                    ...cutaway,
                    showExteriorWalls: !cutaway.showExteriorWalls,
                  })
                }
                className="w-4 h-4 accent-amber-200 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-zinc-200">Show Interior Partition Walls</span>
              <input
                type="checkbox"
                checked={cutaway.showInteriorWalls}
                onChange={() =>
                  onChangeCutaway({
                    ...cutaway,
                    showInteriorWalls: !cutaway.showInteriorWalls,
                  })
                }
                className="w-4 h-4 accent-amber-200 rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="mt-3.5 pt-3 border-t border-white/10">
            <button
              type="button"
              disabled={allRestored}
              onClick={onRestoreFull}
              className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                allRestored
                  ? 'bg-zinc-900/60 text-zinc-500 border border-white/5 cursor-default'
                  : 'bg-amber-200 hover:bg-amber-100 text-zinc-950 font-semibold'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Full Architecture</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
