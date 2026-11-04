import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { FurnitureItemInfo } from '../../types/apartment';
import { getApartmentMaterials } from '../../utils/materials';
import {
  ArchitecturalWardrobe,
  FramedWallArt,
  IndoorDesignerPlant,
  LuxuryBedAssembly,
  NightstandWithLamp,
  SheerWindowCurtains,
} from './FurniturePrimitives';
import { InteractiveObject } from './InteractiveObject';

interface BedroomThreeProps {
  selectedId: string | null;
  onSelect: (item: FurnitureItemInfo) => void;
  onFocusObject: (item: FurnitureItemInfo) => void;
}

/**
 * 3.4 BEDROOM 3 – LOWER LEFT (X: -9.0..-2.6, Z: 0.0..+6.5)
 * Modern minimalist Japandi white & light-oak bedroom (distinct from Bedroom 2).
 * Strictly contains NO desktop computers, NO gaming equipment, and NO television.
 */
export const BedroomThree: React.FC<BedroomThreeProps> = ({
  selectedId,
  onSelect,
  onFocusObject,
}) => {
  const m = getApartmentMaterials();

  return (
    <group name="area-3-4-bedroom-three-lower-left">
      {/* Plush Woven Area Rug */}
      <RoundedBox
        args={[2.85, 0.014, 2.75]}
        radius={0.006}
        position={[-5.9, 0.008, 4.95]}
        material={m.livingRug}
        receiveShadow
      />

      {/* 1. Japandi Low Light-Oak & White Bouclé Bed (Headboard at South Wall Z = +6.38) */}
      <InteractiveObject
        furnitureId="bed3-bed"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-5.9, 0, 5.25]}
        rotation={[0, Math.PI, 0]}
      >
        <LuxuryBedAssembly variant="japandi-oak" />
      </InteractiveObject>

      {/* 2. Honed Travertine Monolith Nightstands + Warm Lamps */}
      <group position={[-7.35, 0, 5.98]} rotation={[0, Math.PI, 0]}>
        <NightstandWithLamp variant="travertine" />
      </group>
      <group position={[-4.45, 0, 5.98]} rotation={[0, Math.PI, 0]}>
        <NightstandWithLamp variant="travertine" />
      </group>

      {/* 3. Minimalist Diptych Framed Wall Art Above Headboard (South Wall) */}
      <group position={[-6.38, 1.76, 6.38]} rotation={[0, Math.PI, 0]}>
        <FramedWallArt width={0.68} height={0.92} variant={3} />
      </group>
      <group position={[-5.42, 1.76, 6.38]} rotation={[0, Math.PI, 0]}>
        <FramedWallArt width={0.68} height={0.92} variant={1} />
      </group>

      {/* Additional Minimalist Wall Art on North Partition Wall */}
      <group position={[-5.9, 1.58, 0.09]}>
        <FramedWallArt width={0.92} height={1.15} variant={2} />
      </group>

      {/* 4. Fluted Frosted-Glass & White Lacquer Wardrobe (West Wall North Section) */}
      <InteractiveObject
        furnitureId="bed3-wardrobe"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-8.6, 0, 2.1]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <ArchitecturalWardrobe width={2.15} height={2.82} depth={0.58} variant="fluted-glass" />
      </InteractiveObject>

      {/* 5. Curved Ivory Bouclé Reading Chair + Turned Oak Accent Table Near West Window */}
      <InteractiveObject
        furnitureId="bed3-lounge"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-7.85, 0, 4.55]}
        rotation={[0, 0.85, 0]}
      >
        <group>
          <mesh position={[0, 0.22, 0]} material={m.ivoryBoucle} castShadow receiveShadow>
            <cylinderGeometry args={[0.39, 0.36, 0.42, 28]} />
          </mesh>
          <mesh
            position={[0, 0.52, 0]}
            rotation={[0, Math.PI, 0]}
            material={m.ivoryBoucle}
            castShadow
          >
            <cylinderGeometry args={[0.41, 0.4, 0.38, 28, 1, true, -Math.PI * 0.65, Math.PI * 1.3]} />
          </mesh>
          <RoundedBox
            args={[0.32, 0.24, 0.12]}
            radius={0.04}
            position={[0, 0.48, -0.18]}
            rotation={[0.2, 0, 0]}
            material={m.warmBeigeFabric}
            castShadow
          />

          <group position={[0.68, 0, 0.12]}>
            <mesh position={[0, 0.24, 0]} material={m.oakVeneer} castShadow>
              <cylinderGeometry args={[0.1, 0.14, 0.48, 24]} />
            </mesh>
            <mesh position={[0, 0.49, 0]} material={m.oakVeneer} castShadow receiveShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.026, 28]} />
            </mesh>
            <mesh position={[0, 0.54, 0]} material={m.calacattaMarble} castShadow>
              <cylinderGeometry args={[0.09, 0.05, 0.07, 20]} />
            </mesh>
          </group>
        </group>
      </InteractiveObject>

      {/* Decorative Corner Botanical Plant */}
      <group position={[-3.3, 0, 5.75]}>
        <IndoorDesignerPlant scale={0.85} />
      </group>

      {/* 6. Sheer Linen Curtains on West Panoramic Window */}
      <group position={[-8.82, 0, 4.6]} rotation={[0, Math.PI / 2, 0]}>
        <SheerWindowCurtains openingWidth={2.4} />
      </group>

      {/* 7. Soft Architectural Linear Brass & Opal Ceiling Pendant */}
      <group position={[-5.85, 2.72, 3.25]}>
        <mesh position={[-0.45, 0.19, 0]} material={m.champagneBrass}>
          <cylinderGeometry args={[0.005, 0.005, 0.38, 8]} />
        </mesh>
        <mesh position={[0.45, 0.19, 0]} material={m.champagneBrass}>
          <cylinderGeometry args={[0.005, 0.005, 0.38, 8]} />
        </mesh>
        <RoundedBox
          args={[1.35, 0.036, 0.045]}
          radius={0.015}
          material={m.warmLedEmissive}
        />
        <mesh position={[0, 0.024, 0]} material={m.champagneBrass}>
          <boxGeometry args={[1.38, 0.014, 0.048]} />
        </mesh>
      </group>
    </group>
  );
};
