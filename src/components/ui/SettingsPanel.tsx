import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sun, Sunrise, Moon, X } from 'lucide-react';
import { LightingMood, QualityLevel } from '../../types/apartment';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  quality: QualityLevel;
  onChangeQuality: (q: QualityLevel) => void;
  lightingMood: LightingMood;
  onChangeLightingMood: (m: LightingMood) => void;
  collisionEnabled: boolean;
  onToggleCollision: () => void;
  allowSpaceFlyUp: boolean;
  onToggleAllowSpaceFlyUp: () => void;
}

const QUALITIES: QualityLevel[] = [
  QualityLevel.Low,
  QualityLevel.Medium,
  QualityLevel.High,
  QualityLevel.Ultra,
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  open,
  onClose,
  quality,
  onChangeQuality,
  lightingMood,
  onChangeLightingMood,
  collisionEnabled,
  onToggleCollision,
  allowSpaceFlyUp,
  onToggleAllowSpaceFlyUp,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-36 left-1/2 -translate-x-1/2 z-30 w-92 max-w-[calc(100vw-2rem)] rounded-xl bg-zinc-950/96 border border-white/14 shadow-2xl p-5 text-zinc-100 pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold text-white">
              Rendering & Walkthrough Settings
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quality Selector */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span>Graphics Quality</span>
              <span className="font-mono text-zinc-300">{quality}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-lg border border-white/10">
              {QUALITIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onChangeQuality(q)}
                  className={`py-1.5 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    quality === q
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Natural Daylight / Atmosphere Selector */}
          <div className="mb-4">
            <div className="text-xs text-zinc-400 mb-2">Lighting Atmosphere</div>
            <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg border border-white/10">
              {[
                { id: 'daylight' as const, label: 'Daylight', Icon: Sun },
                { id: 'golden-hour' as const, label: 'Sunset', Icon: Sunrise },
                { id: 'evening' as const, label: 'Evening', Icon: Moon },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangeLightingMood(id)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    lightingMood === id
                      ? 'bg-amber-200 text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Walkthrough Physics Options */}
          <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-zinc-300">Walk Mode Wall & Furniture Collisions</span>
              <input
                type="checkbox"
                checked={collisionEnabled}
                onChange={onToggleCollision}
                className="w-4 h-4 accent-amber-300 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-zinc-300">Walk Mode Spacebar Vertical Lift</span>
              <input
                type="checkbox"
                checked={allowSpaceFlyUp}
                onChange={onToggleAllowSpaceFlyUp}
                className="w-4 h-4 accent-amber-300 rounded cursor-pointer"
              />
            </label>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
