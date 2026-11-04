import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { FurnitureItemInfo } from '../../types/apartment';
import { getApartmentMaterials } from '../../utils/materials';
import { IndoorDesignerPlant } from './FurniturePrimitives';
import { InteractiveObject } from './InteractiveObject';

interface BalconyProps {
  selectedId: string | null;
  onSelect: (item: FurnitureItemInfo) => void;
  onFocusObject: (item: FurnitureItemInfo) => void;
}

/**
 * 3.2 BALCONY – UPPER MIDDLE (X: -2.6..+3.0, Z: -6.5..-4.2)
 * Positioned along the upper edge of the apartment directly between Bedroom 1 (Upper-Left)
 * and Bedroom 2 (Upper-Right), connected to the Central Living Area via large glass doors.
 */
export const Balcony: React.FC<BalconyProps> = ({
  selectedId,
  onSelect,
  onFocusObject,
}) => {
  const m = getApartmentMaterials();

  return (
    <group name="area-3-2-balcony-upper-middle">
      {/* 1. Honed Travertine Outdoor Balcony Flooring (X: -2.6..+3.0, Z: -6.5..-4.2) */}
      <mesh position={[0.2, -0.115, -5.35]} material={m.balconyTravertine} receiveShadow>
        <boxGeometry args={[5.62, 0.2, 2.34]} />
      </mesh>

      {/* 2. Structural Laminated Glass Railing Along Upper Exterior Edge (Z = -6.46) */}
      <group position={[0.2, 0.54, -6.46]}>
        <mesh material={m.architecturalGlass} renderOrder={3}>
          <boxGeometry args={[5.48, 1.1, 0.022]} />
        </mesh>
        <mesh position={[0, 0.56, 0]} material={m.brushedSteel}>
          <boxGeometry args={[5.54, 0.032, 0.052]} />
        </mesh>
        {[-2.3, -1.15, 0, 1.15, 2.3].map((sx, idx) => (
          <mesh key={idx} position={[sx, -0.48, 0]} material={m.brushedSteel}>
            <boxGeometry args={[0.045, 0.16, 0.06]} />
          </mesh>
        ))}
      </group>

      {/* 3. Architectural Warm Outdoor Wall Sconces on Left & Right Balcony Side Walls */}
      {[-2.48, 2.88].map((wx, idx) => (
        <group key={idx} position={[wx, 1.92, -5.35]}>
          <RoundedBox
            args={[0.065, 0.28, 0.09]}
            radius={0.012}
            material={m.matteBlackMetal}
            castShadow
          />
          <mesh position={[0, 0.145, 0]} material={m.warmLedEmissive}>
            <boxGeometry args={[0.048, 0.015, 0.075]} />
          </mesh>
          <mesh position={[0, -0.145, 0]} material={m.warmLedEmissive}>
            <boxGeometry args={[0.048, 0.015, 0.075]} />
          </mesh>
        </group>
      ))}

      {/* 4. Outdoor Teak & Ivory Lounge Seating + Travertine Side Table (East Side of Balcony) */}
      <InteractiveObject
        furnitureId="balcony-lounge"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[1.9, -0.015, -5.42]}
        rotation={[0, -0.45, 0]}
      >
        <group>
          {/* Low-Slung Kiln-Dried Teak Lounge Chair */}
          <RoundedBox
            args={[0.78, 0.12, 0.82]}
            radius={0.02}
            position={[0, 0.2, 0]}
            material={m.oakVeneer}
            castShadow
            receiveShadow
          />
          <RoundedBox
            args={[0.72, 0.13, 0.74]}
            radius={0.035}
            position={[0, 0.31, 0.02]}
            material={m.ivoryBoucle}
            castShadow
          />
          <RoundedBox
            args={[0.72, 0.42, 0.14]}
            radius={0.035}
            position={[0, 0.52, 0.3]}
            rotation={[0.22, 0, 0]}
            material={m.ivoryBoucle}
            castShadow
          />

          {/* Travertine Drum Outdoor Side Table */}
          <mesh position={[-0.72, 0.22, -0.05]} material={m.travertineStone} castShadow receiveShadow>
            <cylinderGeometry args={[0.23, 0.2, 0.44, 28]} />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 5. Decorative Balcony Botanical Planters */}
      <group position={[-1.98, -0.015, -5.88]}>
        <IndoorDesignerPlant scale={0.95} />
      </group>

      <group position={[-0.75, -0.015, -6.12]}>
        <RoundedBox
          args={[1.15, 0.38, 0.34]}
          radius={0.015}
          position={[0, 0.19, 0]}
          material={m.matteWhiteLacquer}
          castShadow
          receiveShadow
        />
        {[-0.32, 0, 0.32].map((bx, bi) => (
          <mesh
            key={bi}
            position={[bx, 0.52, 0]}
            scale={[1.1, 0.82, 1.0]}
            material={bi % 2 === 0 ? m.foliageOlive : m.foliageDeepGreen}
            castShadow
          >
            <icosahedronGeometry args={[0.19, 2]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
