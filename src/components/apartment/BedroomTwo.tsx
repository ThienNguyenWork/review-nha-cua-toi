import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { FurnitureItemInfo } from '../../types/apartment';
import { getApartmentMaterials } from '../../utils/materials';
import {
  ArchitecturalWardrobe,
  FramedWallArt,
  HaloCeilingFixture,
  LuxuryBedAssembly,
  NightstandWithLamp,
  SheerWindowCurtains,
} from './FurniturePrimitives';
import { InteractiveObject } from './InteractiveObject';

interface BedroomTwoProps {
  selectedId: string | null;
  onSelect: (item: FurnitureItemInfo) => void;
  onFocusObject: (item: FurnitureItemInfo) => void;
}

/**
 * 3.3 BEDROOM 2 – UPPER RIGHT (X: +3.0..+9.0, Z: -6.5..-1.0)
 * Modern minimalist white bedroom with soft indirect lighting.
 * Strictly contains NO desktop computers, NO gaming equipment, and NO television.
 */
export const BedroomTwo: React.FC<BedroomTwoProps> = ({
  selectedId,
  onSelect,
  onFocusObject,
}) => {
  const m = getApartmentMaterials();

  return (
    <group name="area-3-3-bedroom-two-upper-right">
      {/* Plush Woven Area Rug */}
      <RoundedBox
        args={[2.75, 0.014, 2.75]}
        radius={0.006}
        position={[7.5, 0.008, -3.7]}
        material={m.bedroomRug}
        receiveShadow
      />

      {/* Soft Indirect Linear Cove Light Along East Headboard Wall */}
      <mesh position={[8.86, 2.86, -3.7]} material={m.warmLedEmissive}>
        <boxGeometry args={[0.025, 0.02, 3.6]} />
      </mesh>

      {/* 1. Minimalist White Upholstered Queen Bed (Headboard at East Wall X = +8.88) */}
      <InteractiveObject
        furnitureId="bed2-bed"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[7.78, 0, -3.7]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <LuxuryBedAssembly variant="queen-upholstered" />
      </InteractiveObject>

      {/* 2. Cylindrical Pedestal Bedside Tables + Soft Alabaster Globe Lamps */}
      <group position={[8.55, 0, -4.9]}>
        <NightstandWithLamp variant="cylinder" />
      </group>
      <group position={[8.55, 0, -2.5]}>
        <NightstandWithLamp variant="cylinder" />
      </group>

      {/* 3. Sculpted Plaster Relief Triptych Wall Decorations Above Headboard */}
      <group position={[8.88, 1.74, -3.7]} rotation={[0, -Math.PI / 2, 0]}>
        {[-0.56, 0, 0.56].map((ox, i) => (
          <group key={i} position={[ox, 0, 0]}>
            <RoundedBox
              args={[0.46, 0.68, 0.028]}
              radius={0.006}
              material={m.warmWhiteWall}
              castShadow
            />
            <mesh position={[0, -0.04, 0.018]} material={m.ivoryBoucle}>
              <torusGeometry args={[0.13, 0.024, 12, 32, Math.PI]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Additional Minimalist Wall Print on South Wall */}
      <group position={[6.5, 1.56, -1.09]} rotation={[0, Math.PI, 0]}>
        <FramedWallArt width={0.85} height={1.1} variant={2} />
      </group>

      {/* 4. Handleless Matte-White Wardrobe (West Partition Wall X = +3.0) */}
      <InteractiveObject
        furnitureId="bed2-wardrobe"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[3.4, 0, -4.75]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <ArchitecturalWardrobe width={2.2} height={2.82} depth={0.58} variant="flush-white" />
      </InteractiveObject>

      {/* 5. Low Light-Oak Window Bench + Ceramic Vase & Books */}
      <group position={[6.1, 0, -5.82]}>
        <RoundedBox
          args={[1.25, 0.042, 0.42]}
          radius={0.01}
          position={[0, 0.42, 0]}
          material={m.oakVeneer}
          castShadow
          receiveShadow
        />
        {[-0.48, 0.48].map((lx, idx) => (
          <RoundedBox
            key={idx}
            args={[0.05, 0.4, 0.36]}
            radius={0.008}
            position={[lx, 0.2, 0]}
            material={m.oakVeneer}
            castShadow
          />
        ))}
        <mesh position={[-0.28, 0.56, 0]} material={m.matteWhiteLacquer} castShadow>
          <cylinderGeometry args={[0.05, 0.082, 0.24, 24]} />
        </mesh>
        <RoundedBox
          args={[0.26, 0.035, 0.19]}
          radius={0.004}
          position={[0.25, 0.46, 0]}
          material={m.ivoryBoucle}
          castShadow
        />
      </group>

      {/* 6. Sheer Linen Curtains on North Panoramic Window */}
      <group position={[6.1, 0, -6.32]}>
        <SheerWindowCurtains openingWidth={3.6} />
      </group>

      {/* 7. Soft Halo Ceiling Lighting */}
      <group position={[6.0, 0, -3.7]}>
        <HaloCeilingFixture outerRadius={0.52} dropHeight={2.8} />
      </group>
    </group>
  );
};
