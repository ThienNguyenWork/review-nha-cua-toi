import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CornerUpLeft, Orbit, X } from 'lucide-react';
import { FurnitureItemInfo } from '../../types/apartment';

export type InspectionAngle = 'default' | 'front' | 'side' | 'top';

interface ObjectInformationProps {
  item: FurnitureItemInfo | null;
  onClose: () => void;
  onReturnToRoom: () => void;
  onInspectAngle: (item: FurnitureItemInfo, angle: InspectionAngle) => void;
}

export const ObjectInformation: React.FC<ObjectInformationProps> = ({
  item,
  onClose,
  onReturnToRoom,
  onInspectAngle,
}) => {
  return (
    <AnimatePresence>
      {item && (
        <motion.aside
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-38 right-5 z-30 w-86 max-w-[calc(100vw-2.5rem)] rounded-xl bg-zinc-950/95 border border-white/14 shadow-2xl p-5 text-zinc-100 pointer-events-auto"
          aria-label="Selected Furniture Specification"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              {/* Clean unboxed metadata kicker */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <span>{item.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{item.dimensions}</span>
              </div>
              <h2 className="font-display text-base font-semibold tracking-tight text-white leading-snug">
                {item.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer shrink-0"
              aria-label="Close object specification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-3 h-px bg-white/10" />

          <dl className="space-y-2 text-xs">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-zinc-400 shrink-0">Room</dt>
              <dd className="text-zinc-100 font-medium text-right">{item.roomLabel}</dd>
            </div>
            <div>
              <dt className="text-zinc-400 mb-0.5">Material</dt>
              <dd className="text-zinc-100 font-medium">{item.material}</dd>
            </div>
            <div>
              <dt className="text-zinc-400 mb-0.5">Description</dt>
              <dd className="text-zinc-300 leading-relaxed">{item.description}</dd>
            </div>
          </dl>

          {/* Quick Blender-Style Inspection Angles (3/4, Front, Side, Above) */}
          <div className="mt-3.5 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Orbit className="w-3.5 h-3.5 text-amber-200" />
                <span>Inspect Angle</span>
              </span>
              <span>Drag to orbit · Scroll to zoom</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(
                [
                  { id: 'default', label: '3/4 View' },
                  { id: 'front', label: 'Front' },
                  { id: 'side', label: 'Side' },
                  { id: 'top', label: 'Above' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onInspectAngle(item, preset.id)}
                  className="px-2 py-1.5 rounded-md bg-zinc-900 hover:bg-amber-200 text-zinc-200 hover:text-zinc-950 border border-white/10 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onReturnToRoom}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <CornerUpLeft className="w-3.5 h-3.5" />
              <span>Return to Room View</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
