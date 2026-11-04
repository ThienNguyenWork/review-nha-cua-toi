import React, { MutableRefObject, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { CameraTelemetry } from '../camera/CameraController';
import { RoomId } from '../../types/apartment';

interface FloorPlanMinimapProps {
  open: boolean;
  activeRoom: RoomId;
  telemetryRef: MutableRefObject<CameraTelemetry>;
  onSelectRoom: (room: RoomId) => void;
  onClose: () => void;
}

/**
 * Exact 2D radar mapping of the 18.0m × 13.0m apartment:
 * World X: [-9.0 .. +9.0] -> SVG X: [6 .. 222] (scale = 12 px/m)
 * World Z: [-6.5 .. +6.5] -> SVG Y: [6 .. 162] (scale = 12 px/m)
 */
function worldToSvg(x: number, z: number): [number, number] {
  const sx = 6 + (x + 9.0) * 12;
  const sz = 6 + (z + 6.5) * 12;
  return [sx, sz];
}

export const FloorPlanMinimap: React.FC<FloorPlanMinimapProps> = ({
  open,
  activeRoom,
  telemetryRef,
  onSelectRoom,
  onClose,
}) => {
  const markerRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!open) return;
    let rafId = 0;
    const updateMarker = () => {
      if (markerRef.current) {
        const { x, z, yaw } = telemetryRef.current;
        const [sx, sz] = worldToSvg(
          Math.max(-9.0, Math.min(9.0, x)),
          Math.max(-6.5, Math.min(6.5, z)),
        );
        const deg = (-yaw * 180) / Math.PI + 180;
        markerRef.current.setAttribute(
          'transform',
          `translate(${sx.toFixed(1)}, ${sz.toFixed(1)}) rotate(${deg.toFixed(1)})`,
        );
      }
      rafId = requestAnimationFrame(updateMarker);
    };
    rafId = requestAnimationFrame(updateMarker);
    return () => cancelAnimationFrame(rafId);
  }, [open, telemetryRef]);

  // Exact spatial zones matching the user's floor plan:
  // Upper-Left: Bedroom 1 – Studio (X: -9.0..-2.6 => x:6..82.8, Z: -6.5..0.0 => y:6..84)
  // Upper-Middle: Balcony (X: -2.6..+3.0 => x:82.8..150, Z: -6.5..-4.2 => y:6..33.6)
  // Upper-Right: Bedroom 2 (X: +3.0..+9.0 => x:150..222, Z: -6.5..-1.0 => y:6..72)
  // Lower-Left: Bedroom 3 (X: -9.0..-2.6 => x:6..82.8, Z: 0.0..+6.5 => y:84..162)
  // Central: Living Room (X: -2.6..+3.0 => x:82.8..150, Z: -4.2..+6.5 => y:33.6..162)
  // Lower-Right: Kitchen & Dining (X: +3.0..+9.0 => x:150..222, Z: -1.0..+6.5 => y:72..162)
  const rooms: Array<{
    id: RoomId;
    label: string;
    sub?: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }> = [
    { id: 'studio', label: 'Bedroom 1', sub: 'Studio', x: 6, y: 6, w: 76.8, h: 78 },
    { id: 'balcony', label: 'Balcony', x: 82.8, y: 6, w: 67.2, h: 27.6 },
    { id: 'bedroom2', label: 'Bedroom 2', x: 150, y: 6, w: 72, h: 66 },
    { id: 'bedroom3', label: 'Bedroom 3', x: 6, y: 84, w: 76.8, h: 78 },
    { id: 'living', label: 'Living Room', x: 82.8, y: 33.6, w: 67.2, h: 128.4 },
    { id: 'kitchen', label: 'Kitchen', sub: '& Dining', x: 150, y: 72, w: 72, h: 90 },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-18 left-5 z-30 w-68 rounded-xl bg-zinc-950/95 border border-white/14 shadow-2xl p-3.5 text-zinc-100 pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-xs font-semibold text-white">
              Interactive Floor Plan
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
              aria-label="Close floor plan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <svg
            viewBox="0 0 228 168"
            className="w-full h-auto rounded-lg bg-zinc-900/90 border border-white/8"
          >
            {rooms.map((r) => {
              const isSelected = activeRoom === r.id;
              return (
                <g
                  key={r.id}
                  onClick={() => onSelectRoom(r.id)}
                  className="cursor-pointer group"
                >
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    fill={
                      isSelected
                        ? 'rgba(253, 230, 138, 0.22)'
                        : r.id === 'balcony'
                          ? 'rgba(56, 189, 248, 0.12)'
                          : 'rgba(39, 39, 42, 0.68)'
                    }
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="1.2"
                  />
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + (r.sub ? -2 : 3)}
                    textAnchor="middle"
                    fill={isSelected ? '#fde68a' : '#e4e4e7'}
                    fontSize="8.2"
                    fontWeight="600"
                  >
                    {r.label}
                  </text>
                  {r.sub && (
                    <text
                      x={r.x + r.w / 2}
                      y={r.y + r.h / 2 + 8}
                      textAnchor="middle"
                      fill={isSelected ? '#fde68a' : '#a1a1aa'}
                      fontSize="7.4"
                      fontWeight="500"
                    >
                      {r.sub}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Open Connection Between Central Living Room & Kitchen/Dining */}
            <line x1="150" y1="73" x2="150" y2="161" stroke="#27272a" strokeWidth="2.4" />

            {/* Walkable Doorway Gaps */}
            {/* Studio Door (X = -2.6 => 82.8, Z = -1.45..-0.25 => 66.6..81) */}
            <line x1="82.8" y1="66.6" x2="82.8" y2="81" stroke="#18181b" strokeWidth="2.8" />
            {/* Bedroom 3 Door (X = -2.6 => 82.8, Z = +0.4..+1.55 => 88.8..102.6) */}
            <line x1="82.8" y1="88.8" x2="82.8" y2="102.6" stroke="#18181b" strokeWidth="2.8" />
            {/* Balcony Sliding Glass Doors (Z = -4.2 => 33.6, X = -1.3..+1.7 => 98.4..134.4) */}
            <line x1="98.4" y1="33.6" x2="134.4" y2="33.6" stroke="#38bdf8" strokeWidth="2.2" />
            {/* Bedroom 2 Door (Z = -1.0 => 72, X = +3.3..+4.45 => 153.6..167.4) */}
            <line x1="153.6" y1="72" x2="167.4" y2="72" stroke="#18181b" strokeWidth="2.8" />

            {/* Live Camera Position & View Cone */}
            <g ref={markerRef} transform="translate(116, 96)">
              <polygon points="0,0 -10,-20 10,-20" fill="rgba(251, 191, 36, 0.3)" />
              <circle cx="0" cy="0" r="3.8" fill="#fbbf24" stroke="#09090b" strokeWidth="1.2" />
            </g>
          </svg>

          <p className="mt-2 text-[11px] text-zinc-400">
            Click any room on the floor plan to smoothly transition.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
