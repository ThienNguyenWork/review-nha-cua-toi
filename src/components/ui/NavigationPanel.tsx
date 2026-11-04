import React from 'react';
import {
  Box,
  ChevronDown,
  ChevronUp,
  Home,
  Keyboard,
  Layers,
  Map,
  Maximize2,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ROOM_DESTINATIONS } from '../../data/rooms';
import { CameraMode, RoomId, ViewExperience } from '../../types/apartment';
import { CameraModeSelector } from './CameraModeSelector';

interface NavigationPanelProps {
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
  cameraMode: CameraMode;
  onChangeCameraMode: (mode: CameraMode) => void;
  viewExperience: ViewExperience;
  onChangeViewExperience: (view: ViewExperience) => void;
  onResetCamera: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  showGuide: boolean;
  onToggleGuide: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  dockCollapsed: boolean;
  onToggleDockCollapsed: () => void;
}

const VIEW_MODES: Array<{
  id: ViewExperience;
  label: string;
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'interior',
    label: 'Interior',
    title: 'Interior View — Explore inside rooms with full architecture',
    Icon: Home,
  },
  {
    id: 'dollhouse',
    label: 'Dollhouse',
    title: 'Dollhouse View — Elevated 3D floor-plan inspection with clickable room pins',
    Icon: Box,
  },
  {
    id: 'cutaway',
    label: 'Cutaway',
    title: 'Cutaway View — Toggle ceiling & walls to inspect interiors from outside',
    Icon: Layers,
  },
];

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  activeRoom,
  onSelectRoom,
  cameraMode,
  onChangeCameraMode,
  viewExperience,
  onChangeViewExperience,
  onResetCamera,
  isFullscreen,
  onToggleFullscreen,
  showGuide,
  onToggleGuide,
  showMinimap,
  onToggleMinimap,
  showSettings,
  onToggleSettings,
  dockCollapsed,
  onToggleDockCollapsed,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center max-w-[96vw] pointer-events-none">
      {/* Collapse / Expand Handle */}
      <button
        type="button"
        onClick={onToggleDockCollapsed}
        className="pointer-events-auto mb-1.5 flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-950/92 border border-white/12 text-[11px] font-medium text-zinc-300 hover:text-white hover:border-white/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-lg"
        title="Collapse or expand navigation dock"
      >
        {dockCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Show Controls</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Minimize Dock</span>
          </>
        )}
      </button>

      {/* Main Unified Architectural Control Dock */}
      <motion.div
        initial={false}
        animate={{
          opacity: dockCollapsed ? 0 : 1,
          y: dockCollapsed ? 28 : 0,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full rounded-xl bg-zinc-950/95 border border-white/12 shadow-2xl px-3.5 py-2.5 flex flex-col gap-2.5 ${
          dockCollapsed
            ? 'pointer-events-none h-0 overflow-hidden py-0 border-0'
            : 'pointer-events-auto'
        }`}
      >
        {/* Row 1: All 7 Room Destinations */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {ROOM_DESTINATIONS.map((room, index) => {
            const active =
              activeRoom === room.id && viewExperience !== 'dollhouse';
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelectRoom(room.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 ${
                  active
                    ? 'bg-amber-200 text-zinc-950 font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/8'
                }`}
              >
                <span className="font-mono text-[10px] opacity-60 mr-1.5 tabular-nums">
                  0{index + 1}
                </span>
                <span>{room.label}</span>
              </button>
            );
          })}
        </div>

        {/* Hairline Divider */}
        <div className="h-px w-full bg-white/8" />

        {/* Row 2: Camera Modes + Special Viewing Modes + Utility Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <CameraModeSelector mode={cameraMode} onChange={onChangeCameraMode} />

            {/* Special Viewing Modes: Interior | Dollhouse | Cutaway */}
            <div
              className="flex items-center bg-zinc-900/90 rounded-lg p-1 border border-white/10"
              role="group"
              aria-label="Special Viewing Modes"
            >
              {VIEW_MODES.map(({ id, label, title, Icon }) => {
                const active = viewExperience === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onChangeViewExperience(id)}
                    title={title}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 ${
                      active
                        ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                        : 'text-zinc-300 hover:text-white hover:bg-white/6'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onResetCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Reset Camera to Current Room View (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Reset View</span>
            </button>

            <button
              type="button"
              onClick={onToggleMinimap}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showMinimap
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-white/10'
              }`}
              title="Toggle Interactive Floor Plan Radar (M)"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Floor Plan</span>
            </button>

            <button
              type="button"
              onClick={onToggleGuide}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showGuide
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-white/10'
              }`}
              title="Toggle Keyboard & Mouse Controls Guide"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Controls</span>
            </button>

            <button
              type="button"
              onClick={onToggleSettings}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showSettings
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-white/10'
              }`}
              title="Graphics Quality & Walkthrough Settings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quality</span>
            </button>

            <button
              type="button"
              onClick={onToggleFullscreen}
              className="flex items-center justify-center p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 transition-colors shrink-0 cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
