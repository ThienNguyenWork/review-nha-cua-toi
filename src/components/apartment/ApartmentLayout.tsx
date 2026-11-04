import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { CutawayConfig, RoomId, ViewExperience } from '../../types/apartment';
import { ROOM_DESTINATIONS } from '../../data/rooms';
import { getApartmentMaterials } from '../../utils/materials';

const FULL_WALL_H = 3.1;
const CUT_WALL_H = 0.24;

interface OpeningSpec {
  start: number;
  end: number;
  bottomY: number;
  topY: number;
  type: 'window' | 'door' | 'entry-door';
  doorSwingDir?: 1 | -1;
}

const WallAlongX: React.FC<{
  xStart: number;
  xEnd: number;
  z: number;
  thickness?: number;
  openings?: OpeningSpec[];
  isExterior?: boolean;
  isCutaway?: boolean;
}> = ({
  xStart,
  xEnd,
  z,
  thickness = 0.16,
  openings = [],
  isExterior = false,
  isCutaway = false,
}) => {
  const m = getApartmentMaterials();
  const sorted = [...openings].sort((a, b) => a.start - b.start);

  if (isCutaway) {
    // Render crisp architectural section-cut low wall preserving door gaps
    const cutSegments: React.ReactNode[] = [];
    let c = xStart;
    sorted.forEach((op, idx) => {
      if (op.bottomY <= 0.05) {
        if (op.start > c + 0.005) {
          const w = op.start - c;
          const cx = c + w / 2;
          cutSegments.push(
            <group key={`cut-${idx}`} position={[cx, 0, z]}>
              <mesh position={[0, CUT_WALL_H / 2, 0]} material={m.pureWhiteWall}>
                <boxGeometry args={[w, CUT_WALL_H, thickness]} />
              </mesh>
              <mesh position={[0, CUT_WALL_H + 0.006, 0]} material={m.matteBlackMetal}>
                <boxGeometry args={[w, 0.012, thickness + 0.004]} />
              </mesh>
            </group>,
          );
        }
        c = op.end;
      }
    });
    if (xEnd > c + 0.005) {
      const w = xEnd - c;
      const cx = c + w / 2;
      cutSegments.push(
        <group key="cut-end" position={[cx, 0, z]}>
          <mesh position={[0, CUT_WALL_H / 2, 0]} material={m.pureWhiteWall}>
            <boxGeometry args={[w, CUT_WALL_H, thickness]} />
          </mesh>
          <mesh position={[0, CUT_WALL_H + 0.006, 0]} material={m.matteBlackMetal}>
            <boxGeometry args={[w, 0.012, thickness + 0.004]} />
          </mesh>
        </group>,
      );
    }
    return <group>{cutSegments}</group>;
  }

  const segments: React.ReactNode[] = [];
  let cursor = xStart;

  sorted.forEach((op, idx) => {
    if (op.start > cursor + 0.005) {
      const w = op.start - cursor;
      const cx = cursor + w / 2;
      segments.push(
        <mesh
          key={`pier-${idx}`}
          position={[cx, FULL_WALL_H / 2, z]}
          material={m.pureWhiteWall}
          castShadow={isExterior}
          receiveShadow
        >
          <boxGeometry args={[w, FULL_WALL_H, thickness]} />
        </mesh>,
      );
      segments.push(
        <mesh key={`base-${idx}`} position={[cx, 0.04, z]} material={m.matteWhiteLacquer}>
          <boxGeometry args={[w, 0.08, thickness + 0.014]} />
        </mesh>,
      );
    }

    const opW = op.end - op.start;
    const opCx = op.start + opW / 2;

    if (op.bottomY > 0.01) {
      segments.push(
        <mesh
          key={`sill-${idx}`}
          position={[opCx, op.bottomY / 2, z]}
          material={m.pureWhiteWall}
          castShadow={isExterior}
          receiveShadow
        >
          <boxGeometry args={[opW, op.bottomY, thickness]} />
        </mesh>,
      );
      segments.push(
        <mesh key={`sill-cap-${idx}`} position={[opCx, op.bottomY, z]} material={m.calacattaMarble}>
          <boxGeometry args={[opW + 0.02, 0.024, thickness + 0.04]} />
        </mesh>,
      );
    }

    if (op.topY < FULL_WALL_H - 0.01) {
      const lintelH = FULL_WALL_H - op.topY;
      segments.push(
        <mesh
          key={`lintel-${idx}`}
          position={[opCx, op.topY + lintelH / 2, z]}
          material={m.pureWhiteWall}
          castShadow={isExterior}
          receiveShadow
        >
          <boxGeometry args={[opW, lintelH, thickness]} />
        </mesh>,
      );
    }

    if (op.type === 'window') {
      const winH = op.topY - op.bottomY;
      const winCy = op.bottomY + winH / 2;
      segments.push(
        <group key={`win-${idx}`} position={[opCx, winCy, z]}>
          <mesh position={[0, winH / 2 - 0.02, 0]} material={m.satinWhiteAluminum}>
            <boxGeometry args={[opW, 0.04, 0.08]} />
          </mesh>
          <mesh position={[0, -winH / 2 + 0.02, 0]} material={m.satinWhiteAluminum}>
            <boxGeometry args={[opW, 0.04, 0.08]} />
          </mesh>
          <mesh position={[-opW / 2 + 0.02, 0, 0]} material={m.satinWhiteAluminum}>
            <boxGeometry args={[0.04, winH, 0.08]} />
          </mesh>
          <mesh position={[opW / 2 - 0.02, 0, 0]} material={m.satinWhiteAluminum}>
            <boxGeometry args={[0.04, winH, 0.08]} />
          </mesh>
          <mesh position={[0, 0, 0]} material={m.satinWhiteAluminum}>
            <boxGeometry args={[0.032, winH, 0.07]} />
          </mesh>
          <mesh material={m.architecturalGlass} renderOrder={2}>
            <boxGeometry args={[opW - 0.06, winH - 0.06, 0.016]} />
          </mesh>
        </group>,
      );
    }

    if (op.type === 'door') {
      const doorH = op.topY;
      segments.push(
        <group key={`door-${idx}`} position={[opCx, 0, z]}>
          <mesh position={[-opW / 2 + 0.018, doorH / 2, 0]} material={m.oakVeneer}>
            <boxGeometry args={[0.036, doorH, thickness + 0.024]} />
          </mesh>
          <mesh position={[opW / 2 - 0.018, doorH / 2, 0]} material={m.oakVeneer}>
            <boxGeometry args={[0.036, doorH, thickness + 0.024]} />
          </mesh>
          <mesh position={[0, doorH - 0.018, 0]} material={m.oakVeneer}>
            <boxGeometry args={[opW, 0.036, thickness + 0.024]} />
          </mesh>

          <group
            position={[
              op.doorSwingDir === -1 ? -opW / 2 + 0.04 : opW / 2 - 0.04,
              0,
              -thickness / 2,
            ]}
            rotation={[0, op.doorSwingDir === -1 ? 1.46 : -1.46, 0]}
          >
            <mesh
              position={[
                op.doorSwingDir === -1 ? (opW - 0.08) / 2 : -(opW - 0.08) / 2,
                (doorH - 0.04) / 2,
                0,
              ]}
              material={m.matteWhiteLacquer}
              castShadow
            >
              <boxGeometry args={[opW - 0.08, doorH - 0.04, 0.042]} />
            </mesh>
            <mesh
              position={[op.doorSwingDir === -1 ? opW - 0.16 : -(opW - 0.16), 1.02, 0]}
              material={m.champagneBrass}
            >
              <boxGeometry args={[0.11, 0.018, 0.09]} />
            </mesh>
          </group>
        </group>,
      );
    }

    if (op.type === 'entry-door') {
      const doorH = op.topY;
      segments.push(
        <group key={`entry-${idx}`} position={[opCx, 0, z]}>
          <mesh position={[0, doorH / 2, 0]} material={m.oakVeneer} castShadow receiveShadow>
            <boxGeometry args={[opW - 0.02, doorH, 0.07]} />
          </mesh>
          <mesh position={[opW * 0.32, 1.15, -0.055]} material={m.champagneBrass}>
            <cylinderGeometry args={[0.012, 0.012, 0.95, 16]} />
          </mesh>
        </group>,
      );
    }

    cursor = op.end;
  });

  if (xEnd > cursor + 0.005) {
    const w = xEnd - cursor;
    const cx = cursor + w / 2;
    segments.push(
      <mesh
        key="pier-end"
        position={[cx, FULL_WALL_H / 2, z]}
        material={m.pureWhiteWall}
        castShadow={isExterior}
        receiveShadow
      >
        <boxGeometry args={[w, FULL_WALL_H, thickness]} />
      </mesh>,
    );
    segments.push(
      <mesh key="base-end" position={[cx, 0.04, z]} material={m.matteWhiteLacquer}>
        <boxGeometry args={[w, 0.08, thickness + 0.014]} />
      </mesh>,
    );
  }

  return <group>{segments}</group>;
};

const WallAlongZ: React.FC<{
  zStart: number;
  zEnd: number;
  x: number;
  thickness?: number;
  openings?: OpeningSpec[];
  isExterior?: boolean;
  isCutaway?: boolean;
}> = ({
  zStart,
  zEnd,
  x,
  thickness = 0.16,
  openings = [],
  isExterior = false,
  isCutaway = false,
}) => {
  const m = getApartmentMaterials();
  const sorted = [...openings].sort((a, b) => a.start - b.start);

  if (isCutaway) {
    const cutSegments: React.ReactNode[] = [];
    let c = zStart;
    sorted.forEach((op, idx) => {
      if (op.bottomY <= 0.05) {
        if (op.start > c + 0.005) {
          const len = op.start - c;
          const cz = c + len / 2;
          cutSegments.push(
            <group key={`zcut-${idx}`} position={[x, 0, cz]}>
              <mesh position={[0, CUT_WALL_H / 2, 0]} material={m.pureWhiteWall}>
                <boxGeometry args={[thickness, CUT_WALL_H, len]} />
              </mesh>
              <mesh position={[0, CUT_WALL_H + 0.006, 0]} material={m.matteBlackMetal}>
                <boxGeometry args={[thickness + 0.004, 0.012, len]} />
              </mesh>
            </group>,
          );
        }
        c = op.end;
      }
    });
    if (zEnd > c + 0.005) {
      const len = zEnd - c;
      const cz = c + len / 2;
      cutSegments.push(
        <group key="zcut-end" position={[x, 0, cz]}>
          <mesh position={[0, CUT_WALL_H / 2, 0]} material={m.pureWhiteWall}>
            <boxGeometry args={[thickness, CUT_WALL_H, len]} />
          </mesh>
          <mesh position={[0, CUT_WALL_H + 0.006, 0]} material={m.matteBlackMetal}>
            <boxGeometry args={[thickness + 0.004, 0.012, len]} />
          </mesh>
        </group>,
      );
    }
    return <group>{cutSegments}</group>;
  }

  const segments: React.ReactNode[] = [];
  let cursor = zStart;

  sorted.forEach((op, idx) => {
    if (op.start > cursor + 0.005) {
      const len = op.start - cursor;
      const cz = cursor + len / 2;
      segments.push(
        <mesh
          key={`zpier-${idx}`}
          position={[x, FULL_WALL_H / 2, cz]}
          material={m.pureWhiteWall}
          castShadow={isExterior}
          receiveShadow
        >
          <boxGeometry args={[thickness, FULL_WALL_H, len]} />
        </mesh>,
      );
      segments.push(
        <mesh key={`zbase-${idx}`} position={[x, 0.04, cz]} material={m.matteWhiteLacquer}>
          <boxGeometry args={[thickness + 0.014, 0.08, len]} />
        </mesh>,
      );
    }

    const opLen = op.end - op.start;
    const opCz = op.start + opLen / 2;

    if (op.bottomY > 0.01) {
      segments.push(
        <mesh
          key={`zsill-${idx}`}
          position={[x, op.bottomY / 2, opCz]}
          material={m.pureWhiteWall}
          castShadow={isExterior}
          receiveShadow
        >
          <boxGeometry args={[thickness, op.bottomY, opLen]} />
        </mesh>,
      );
      segments.push(
        <mesh key={`zsill-cap-${idx}`} position={[x, op.bottomY, opCz]} material={m.calacattaMarble}>
          <boxGeometry args={[thickness + 0.04, 0.024, opLen + 0.02]} />
        </mesh>,
      );
    }

    if (op.topY < FULL_WALL_H - 0.01) {
      const lintelH = FULL_WALL_H - op.topY;
      segments.push(
        <mesh
          key={`zlintel-${idx}`}
          position={[x, op.topY + lintelH / 2, opCz]}
          material={m.pureWhiteWall}
          castShadow={isExterior}
          receiveShadow
        >
          <boxGeometry args={[thickness, lintelH, opLen]} />
        </mesh>,
      );
    }

    if (op.type === 'window') {
      const winH = op.topY - op.bottomY;
      const winCy = op.bottomY + winH / 2;
      segments.push(
        <group key={`zwin-${idx}`} position={[x, winCy, opCz]}>
          <mesh position={[0, winH / 2 - 0.02, 0]} material={m.satinWhiteAluminum}>
            <boxGeometry args={[0.08, 0.04, opLen]} />
          </mesh>
          <mesh position={[0, -winH / 2 + 0.02, 0]} material={m.satinWhiteAluminum}>
            <boxGeometry args={[0.08, 0.04, opLen]} />
          </mesh>
          <mesh position={[0, 0, 0]} material={m.satinWhiteAluminum}>
            <boxGeometry args={[0.07, winH, 0.032]} />
          </mesh>
          <mesh material={m.architecturalGlass} renderOrder={2}>
            <boxGeometry args={[0.016, winH - 0.06, opLen - 0.06]} />
          </mesh>
        </group>,
      );
    }

    if (op.type === 'door') {
      const doorH = op.topY;
      segments.push(
        <group key={`zdoor-${idx}`} position={[x, 0, opCz]}>
          <mesh position={[0, doorH / 2, -opLen / 2 + 0.018]} material={m.oakVeneer}>
            <boxGeometry args={[thickness + 0.024, doorH, 0.036]} />
          </mesh>
          <mesh position={[0, doorH / 2, opLen / 2 - 0.018]} material={m.oakVeneer}>
            <boxGeometry args={[thickness + 0.024, doorH, 0.036]} />
          </mesh>
          <mesh position={[0, doorH - 0.018, 0]} material={m.oakVeneer}>
            <boxGeometry args={[thickness + 0.024, 0.036, opLen]} />
          </mesh>

          {/* Open Flush White Door Swung 85° into Bedroom (-X) */}
          <group
            position={[
              -thickness / 2,
              0,
              op.doorSwingDir === -1 ? -opLen / 2 + 0.04 : opLen / 2 - 0.04,
            ]}
            rotation={[0, op.doorSwingDir === -1 ? -1.46 : 1.46, 0]}
          >
            <mesh
              position={[
                0,
                (doorH - 0.04) / 2,
                op.doorSwingDir === -1 ? (opLen - 0.08) / 2 : -(opLen - 0.08) / 2,
              ]}
              material={m.matteWhiteLacquer}
              castShadow
            >
              <boxGeometry args={[0.042, doorH - 0.04, opLen - 0.08]} />
            </mesh>
            <mesh
              position={[
                0,
                1.02,
                op.doorSwingDir === -1 ? opLen - 0.16 : -(opLen - 0.16),
              ]}
              material={m.champagneBrass}
            >
              <boxGeometry args={[0.09, 0.018, 0.11]} />
            </mesh>
          </group>
        </group>,
      );
    }

    cursor = op.end;
  });

  if (zEnd > cursor + 0.005) {
    const len = zEnd - cursor;
    const cz = cursor + len / 2;
    segments.push(
      <mesh
        key="zpier-end"
        position={[x, FULL_WALL_H / 2, cz]}
        material={m.pureWhiteWall}
        castShadow={isExterior}
        receiveShadow
      >
        <boxGeometry args={[thickness, FULL_WALL_H, len]} />
      </mesh>,
    );
    segments.push(
      <mesh key="zbase-end" position={[x, 0.04, cz]} material={m.matteWhiteLacquer}>
        <boxGeometry args={[thickness + 0.014, 0.08, len]} />
      </mesh>,
    );
  }

  return <group>{segments}</group>;
};

interface ApartmentLayoutProps {
  viewExperience: ViewExperience;
  cutaway: CutawayConfig;
  onSelectRoom?: (roomId: RoomId) => void;
}

export const ApartmentLayout: React.FC<ApartmentLayoutProps> = ({
  viewExperience,
  cutaway,
  onSelectRoom,
}) => {
  const m = getApartmentMaterials();
  const hideCeiling = viewExperience === 'dollhouse' || !cutaway.showCeiling;
  const cutExterior = viewExperience === 'cutaway' && !cutaway.showExteriorWalls;
  const cutInterior = viewExperience === 'cutaway' && !cutaway.showInteriorWalls;

  return (
    <group name="apartment-architectural-shell">
      {/* 1. Wide-Plank European Light Oak Interior Flooring */}
      {/* Left Wing (Studio Upper-Left + Bedroom 3 Lower-Left: X -9.0..-2.6, Z -6.5..+6.5) */}
      <mesh position={[-5.85, -0.1, 0]} material={m.oakFloor} receiveShadow>
        <boxGeometry args={[6.5, 0.2, 13.18]} />
      </mesh>
      {/* Central Living + Lower-Right Dining/Kitchen (X -2.6..+9.0, Z -4.2..+6.5) */}
      <mesh position={[3.25, -0.1, 1.18]} material={m.oakFloor} receiveShadow>
        <boxGeometry args={[11.7, 0.2, 10.84]} />
      </mesh>
      {/* Upper-Right Bedroom 2 North Portion (X +3.0..+9.0, Z -6.5..-4.2) */}
      <mesh position={[6.05, -0.1, -5.35]} material={m.oakFloor} receiveShadow>
        <boxGeometry args={[6.1, 0.2, 2.35]} />
      </mesh>

      {/* 2. Lower-Right Kitchen Calacatta Porcelain Floor Inlay + Brass Transition Strip */}
      <mesh position={[6.78, 0.003, 2.75]} material={m.calacattaMarble} receiveShadow>
        <boxGeometry args={[4.35, 0.006, 7.38]} />
      </mesh>
      <mesh position={[4.6, 0.006, 2.75]} material={m.champagneBrass}>
        <boxGeometry args={[0.02, 0.004, 7.38]} />
      </mesh>

      {/* 3. Architectural Ceiling (Solid indoors; automatic cutaway from above or when ceiling hidden) */}
      {!hideCeiling && (
        <mesh position={[0, FULL_WALL_H, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.ceilingMatte}>
          <planeGeometry args={[18.18, 13.18]} />
        </mesh>
      )}

      {/* 4. EXTERIOR WALLS */}
      {/* North Wall Left: Bedroom 1 Studio (X: -9.09..-2.6, Z = -6.5) */}
      <WallAlongX
        xStart={-9.09}
        xEnd={-2.6}
        z={-6.5}
        thickness={0.18}
        isExterior
        isCutaway={cutExterior}
        openings={[{ start: -8.0, end: -4.1, bottomY: 0.88, topY: 2.78, type: 'window' }]}
      />

      {/* North Wall Right: Bedroom 2 (X: +3.0..+9.09, Z = -6.5) */}
      <WallAlongX
        xStart={3.0}
        xEnd={9.09}
        z={-6.5}
        thickness={0.18}
        isExterior
        isCutaway={cutExterior}
        openings={[{ start: 4.3, end: 7.9, bottomY: 0.38, topY: 2.78, type: 'window' }]}
      />

      {/* Upper-Middle Balcony Side Framing Walls (Z: -6.5..-4.2 at X = -2.6 and X = +3.0) */}
      <WallAlongZ
        zStart={-6.5}
        zEnd={-4.2}
        x={-2.6}
        thickness={0.18}
        isExterior
        isCutaway={cutExterior}
        openings={[{ start: -5.9, end: -4.65, bottomY: 0.4, topY: 2.76, type: 'window' }]}
      />
      <WallAlongZ
        zStart={-6.5}
        zEnd={-4.2}
        x={3.0}
        thickness={0.18}
        isExterior
        isCutaway={cutExterior}
      />

      {/* Upper-Middle Balcony Large Floor-to-Ceiling Glass Doors Connecting to Central Living Area (Z = -4.2, X: -2.6..+3.0) */}
      {!cutExterior && (
        <group position={[0.2, 0, -4.2]}>
          {/* Header Lintel Above Balcony Sliding Doors */}
          <mesh position={[0, 2.95, 0]} material={m.pureWhiteWall} castShadow receiveShadow>
            <boxGeometry args={[5.6, 0.3, 0.18]} />
          </mesh>
          {/* Fixed Left & Right Glass Sidelights (leaving central 3.0m X = -1.3..+1.7 wide open!) */}
          {[-2.15, 2.15].map((gx, idx) => (
            <group key={idx} position={[gx, 1.4, 0]}>
              <mesh material={m.architecturalGlass} renderOrder={2}>
                <boxGeometry args={[1.28, 2.78, 0.018]} />
              </mesh>
              <mesh position={[idx === 0 ? 0.64 : -0.64, 0, 0]} material={m.satinWhiteAluminum}>
                <boxGeometry args={[0.042, 2.8, 0.075]} />
              </mesh>
            </group>
          ))}
          {/* Slid-Open Glass Door Leaf Parked Behind West Sidelight */}
          <group position={[-1.95, 1.4, 0.05]}>
            <mesh material={m.architecturalGlass} renderOrder={2}>
              <boxGeometry args={[1.38, 2.76, 0.02]} />
            </mesh>
            <mesh position={[0.68, 0, 0]} material={m.satinWhiteAluminum}>
              <boxGeometry args={[0.04, 2.78, 0.06]} />
            </mesh>
          </group>
          {/* Recessed Floor Track */}
          <mesh position={[0, 0.008, 0]} material={m.brushedSteel}>
            <boxGeometry args={[5.55, 0.014, 0.14]} />
          </mesh>
        </group>
      )}

      {/* West Exterior Wall (X = -9.0, Z: -6.5..+6.5) */}
      <WallAlongZ
        zStart={-6.5}
        zEnd={6.5}
        x={-9.0}
        thickness={0.18}
        isExterior
        isCutaway={cutExterior}
        openings={[{ start: 3.4, end: 5.8, bottomY: 0.38, topY: 2.76, type: 'window' }]}
      />

      {/* East Exterior Wall (X = +9.0, Z: -6.5..+6.5) with Kitchen Window */}
      <WallAlongZ
        zStart={-6.5}
        zEnd={6.5}
        x={9.0}
        thickness={0.18}
        isExterior
        isCutaway={cutExterior}
        openings={[{ start: 4.15, end: 5.65, bottomY: 1.05, topY: 2.74, type: 'window' }]}
      />

      {/* South Exterior Wall (Z = +6.5, X: -9.09..+9.09) with Central Residence Main Entry Door */}
      <WallAlongX
        xStart={-9.09}
        xEnd={9.09}
        z={6.5}
        thickness={0.18}
        isExterior
        isCutaway={cutExterior}
        openings={[{ start: -0.65, end: 0.55, bottomY: 0, topY: 2.48, type: 'entry-door' }]}
      />

      {/* 5. INTERIOR PARTITION WALLS */}
      {/* West Wing Spine Wall (X = -2.6, Z: -4.2..+6.5) with Studio Door & Bedroom 3 Door */}
      <WallAlongZ
        zStart={-4.2}
        zEnd={6.5}
        x={-2.6}
        thickness={0.14}
        isCutaway={cutInterior}
        openings={[
          { start: -1.45, end: -0.25, bottomY: 0, topY: 2.42, type: 'door', doorSwingDir: 1 },
          { start: 0.4, end: 1.55, bottomY: 0, topY: 2.42, type: 'door', doorSwingDir: -1 },
        ]}
      />

      {/* Partition Between Bedroom 1 (Upper-Left) & Bedroom 3 (Lower-Left) at Z = 0.0 */}
      <WallAlongX
        xStart={-9.0}
        xEnd={-2.6}
        z={0.0}
        thickness={0.14}
        isCutaway={cutInterior}
      />

      {/* Partition Between Central Living Room & Bedroom 2 (X = +3.0, Z: -4.2..-1.0) */}
      <WallAlongZ
        zStart={-4.2}
        zEnd={-1.0}
        x={3.0}
        thickness={0.14}
        isCutaway={cutInterior}
      />

      {/* Partition Between Bedroom 2 & Kitchen/Dining (Z = -1.0, X: +3.0..+9.0) with Bedroom 2 Door */}
      <WallAlongX
        xStart={3.0}
        xEnd={9.0}
        z={-1.0}
        thickness={0.14}
        isCutaway={cutInterior}
        openings={[
          { start: 3.3, end: 4.45, bottomY: 0, topY: 2.42, type: 'door', doorSwingDir: -1 },
        ]}
      />

      {/* 6. Interactive Dollhouse Floating Room Pins (Visible in Dollhouse Mode to Inspect & Dive Into Rooms) */}
      {viewExperience === 'dollhouse' &&
        onSelectRoom &&
        ROOM_DESTINATIONS.filter((r) => r.id !== 'overview').map((room) => (
          <Html
            key={room.id}
            position={room.labelCenter}
            center
            distanceFactor={15}
            zIndexRange={[10, 0]}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectRoom(room.id);
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-950/92 hover:bg-amber-200 text-zinc-100 hover:text-zinc-950 border border-white/20 text-xs font-semibold whitespace-nowrap shadow-xl transition-colors cursor-pointer"
            >
              {room.shortLabel}
            </button>
          </Html>
        ))}

      {/* 7. Exterior Architectural Plinth & Subtle Distant Skyline Context */}
      <mesh position={[0, -0.32, 0]} receiveShadow>
        <boxGeometry args={[19.2, 0.24, 14.2]} />
        <meshStandardMaterial color="#e5e2dc" roughness={0.85} />
      </mesh>

      <group position={[0, -8, 0]}>
        {[
          [-26, -12, 7, 18, 7, -28],
          [-12, -8, 6, 24, 6, -32],
          [8, -10, 8, 22, 8, -30],
          [24, -14, 7, 17, 7, -26],
          [-22, -12, 8, 19, 8, 30],
          [-6, -9, 9, 25, 7, 34],
          [14, -11, 8, 21, 8, 32],
          [28, -13, 7, 18, 7, 26],
        ].map(([bx, by, bw, bh, bd, bz], idx) => (
          <mesh key={idx} position={[bx, by + bh / 2, bz]}>
            <boxGeometry args={[bw, bh, bd]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#dbe2ea' : '#cfd8e3'}
              roughness={0.9}
              side={THREE.FrontSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
