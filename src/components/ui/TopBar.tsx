import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { RoomId } from '../../types/apartment';

interface TopBarProps {
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
  uiHidden: boolean;
  onToggleUiHidden: () => void;
}

const TOP_LINKS: Array<{ id: RoomId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'studio', label: 'Studio' },
  { id: 'living', label: 'Living Room' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'balcony', label: 'Balcony' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeRoom,
  onSelectRoom,
  uiHidden,
  onToggleUiHidden,
}) => {
  if (uiHidden) {
    return (
      <div className="fixed top-4 right-5 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={onToggleUiHidden}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-950/90 hover:bg-zinc-900 border border-white/15 text-xs font-medium text-zinc-100 shadow-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Restore Interface (Press H)"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Show Interface</span>
        </button>
      </div>
    );
  }

  return (
    <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-zinc-950/90 border-b border-white/10 pointer-events-auto">
      {/* Zone 1: Single-Element Brand Wordmark */}
      <button
        type="button"
        onClick={() => onSelectRoom('overview')}
        className="font-display text-base sm:text-lg font-semibold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer text-left"
      >
        Lumière Residence
      </button>

      {/* Zone 2: 5 Clean Single-Line Text Navigation Links */}
      <nav
        className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300"
        aria-label="Primary Room Shortcuts"
      >
        {TOP_LINKS.map((link) => {
          const isActive = activeRoom === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelectRoom(link.id)}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer py-0.5 border-b ${
                isActive
                  ? 'text-white border-amber-200'
                  : 'text-zinc-400 border-transparent hover:text-white hover:border-white/40'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onToggleUiHidden}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Hide All Interface Elements (Press H)"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Hide UI</span>
        </button>
      </div>
    </header>
  );
};
