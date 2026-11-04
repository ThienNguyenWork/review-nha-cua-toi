import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { FurnitureItemInfo, QualityLevel } from '../../types/apartment';
import { getApartmentMaterials } from '../../utils/materials';
import {
  ArchitecturalWardrobe,
  FeatureMediaWallWithTV,
  FramedWallArt,
  HaloCeilingFixture,
  LuxuryBedAssembly,
  NightstandWithLamp,
  SheerWindowCurtains,
  WhiteErgonomicStudioChair,
  WhiteGamingPCTower,
  WhiteWorkstationDeskOnly,
} from './FurniturePrimitives';
import { InteractiveObject } from './InteractiveObject';

interface StudioRoomProps {
  selectedId: string | null;
  onSelect: (item: FurnitureItemInfo) => void;
  onFocusObject: (item: FurnitureItemInfo) => void;
  quality: QualityLevel;
}

/**
 * 3.1 BEDROOM 1 – STUDIO (UPPER LEFT: X -9.0..-2.6, Z -6.5..0.0)
 * Main personal studio & master bedroom with two detailed pure-white PC setups,
 * king platform bed, 85-inch wall-mounted OLED TV, and illuminated glass wardrobe.
 */
export const StudioRoom: React.FC<StudioRoomProps> = ({
  selectedId,
  onSelect,
  onFocusObject,
  quality,
}) => {
  const m = getApartmentMaterials();
  const enableCaseLights = quality !== QualityLevel.Low;

  return (
    <group name="area-3-1-studio-bedroom-upper-left">
      {/* 1. Fluted Light-Oak & Warm White Headboard Feature Wall (West Wall X = -8.88, Z = -2.15) */}
      <group position={[-8.88, 1.52, -2.15]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={m.warmWhiteWall} receiveShadow>
          <boxGeometry args={[3.35, 2.96, 0.04]} />
        </mesh>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={`hb-slat-l-${i}`}
            position={[-1.58 + i * 0.06, 0, 0.025]}
            material={m.oakVeneer}
            castShadow
          >
            <boxGeometry args={[0.032, 2.94, 0.025]} />
          </mesh>
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={`hb-slat-r-${i}`}
            position={[1.58 - i * 0.06, 0, 0.025]}
            material={m.oakVeneer}
            castShadow
          >
            <boxGeometry args={[0.032, 2.94, 0.025]} />
          </mesh>
        ))}
        <mesh position={[0, 1.46, 0.03]} material={m.warmLedEmissive}>
          <boxGeometry args={[3.15, 0.018, 0.02]} />
        </mesh>
      </group>

      <group position={[-8.84, 1.88, -2.15]} rotation={[0, Math.PI / 2, 0]}>
        <FramedWallArt width={1.05} height={0.76} variant={1} />
      </group>

      {/* Plush Area Rug Under Studio Bed */}
      <RoundedBox
        args={[2.9, 0.014, 3.05]}
        radius={0.006}
        position={[-7.5, 0.008, -2.15]}
        material={m.bedroomRug}
        receiveShadow
      />

      {/* 2. Large Modern King Platform Bed (Facing East toward the 85" Studio TV) */}
      <InteractiveObject
        furnitureId="studio-bed"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-7.75, 0, -2.15]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <LuxuryBedAssembly variant="studio-king" />
      </InteractiveObject>

      {/* Twin Studio Bedside Tables + Warm Designer Lamps */}
      <group position={[-8.55, 0, -3.52]} rotation={[0, Math.PI / 2, 0]}>
        <NightstandWithLamp variant="studio" />
      </group>
      <group position={[-8.55, 0, -0.78]} rotation={[0, Math.PI / 2, 0]}>
        <NightstandWithLamp variant="studio" />
      </group>

      {/* 3. Large 85-Inch Wall-Mounted Television & Media Wall (East Studio Wall X = -2.69, Facing Bed) */}
      <InteractiveObject
        furnitureId="studio-tv"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-2.69, 0, -2.42]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <FeatureMediaWallWithTV
          screenVariant="studio"
          consoleWidth={2.25}
          backdropStone="marble"
        />
      </InteractiveObject>

      {/* 4. Bespoke White & Illuminated Smoked-Glass Wardrobe (South Partition Wall Z = 0.0) */}
      <InteractiveObject
        furnitureId="studio-wardrobe"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-5.35, 0, -0.38]}
        rotation={[0, Math.PI, 0]}
      >
        <ArchitecturalWardrobe width={2.2} height={2.84} depth={0.6} variant="studio-showcase" />
      </InteractiveObject>

      {/* 5. DUAL WHITE PC GAMING / WORKSTATION SETUPS (Along North Daylight Wall Z = -5.95) */}
      {/* Sheer Linen Curtains Framing North Studio Window */}
      <group position={[-6.05, 0, -6.32]}>
        <SheerWindowCurtains openingWidth={3.9} />
      </group>

      {/* --- WORKSTATION ALPHA (Left White PC Setup, X = -7.05) --- */}
      <InteractiveObject
        furnitureId="studio-desk-1"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-7.05, 0, -5.95]}
      >
        <WhiteWorkstationDeskOnly />
      </InteractiveObject>

      <InteractiveObject
        furnitureId="studio-pc-1"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-6.45, 0.752, -5.88]}
      >
        <WhiteGamingPCTower rgbVariant="ice" enablePointLight={enableCaseLights} />
      </InteractiveObject>

      <InteractiveObject
        furnitureId="studio-chair-1"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-7.15, 0, -5.18]}
        rotation={[0, 0.08, 0]}
      >
        <WhiteErgonomicStudioChair />
      </InteractiveObject>

      {/* --- WORKSTATION BETA (Right White PC Setup, X = -5.05) --- */}
      <InteractiveObject
        furnitureId="studio-desk-2"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-5.05, 0, -5.95]}
      >
        <WhiteWorkstationDeskOnly />
      </InteractiveObject>

      <InteractiveObject
        furnitureId="studio-pc-2"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-4.45, 0.752, -5.88]}
      >
        <WhiteGamingPCTower rgbVariant="violet" enablePointLight={enableCaseLights} />
      </InteractiveObject>

      <InteractiveObject
        furnitureId="studio-chair-2"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-5.15, 0, -5.18]}
        rotation={[0, -0.08, 0]}
      >
        <WhiteErgonomicStudioChair />
      </InteractiveObject>

      {/* 6. Modern Concentric Halo Ceiling Fixture */}
      <group position={[-5.75, 0, -3.2]}>
        <HaloCeilingFixture outerRadius={0.65} dropHeight={2.78} />
      </group>
    </group>
  );
};
