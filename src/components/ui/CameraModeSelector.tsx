import React from 'react';
import { Compass, Footprints, Orbit } from 'lucide-react';
import { CameraMode } from '../../types/apartment';

interface CameraModeSelectorProps {
  mode: CameraMode;
  onChange: (mode: CameraMode) => void;
}

const MODES: Array<{
  id: CameraMode;
  label: string;
  shortcut: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { id: CameraMode.FreeFly, label: 'Free Fly', shortcut: 'M', icon: Compass },
  { id: CameraMode.Walk, label: 'Walk', shortcut: 'M', icon: Footprints },
  { id: CameraMode.Orbit, label: 'Orbit', shortcut: 'M', icon: Orbit },
];

export const CameraModeSelector: React.FC<CameraModeSelectorProps> = ({
  mode,
  onChange,
}) => {
  return (
    <div
      className="flex items-center gap-0.5 rounded-lg bg-zinc-900 p-1 border border-white/10"
      role="group"
      aria-label="Camera Navigation Mode"
    >
      {MODES.map((item) => {
        const Icon = item.icon;
        const active = mode === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 ${
              active
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
