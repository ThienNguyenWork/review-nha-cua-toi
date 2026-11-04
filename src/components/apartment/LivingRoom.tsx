import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { FurnitureItemInfo } from '../../types/apartment';
import { getApartmentMaterials } from '../../utils/materials';
import {
  FeatureMediaWallWithTV,
  FramedWallArt,
  HaloCeilingFixture,
  IndoorDesignerPlant,
} from './FurniturePrimitives';
import { InteractiveObject } from './InteractiveObject';

interface LivingRoomProps {
  selectedId: string | null;
  onSelect: (item: FurnitureItemInfo) => void;
  onFocusObject: (item: FurnitureItemInfo) => void;
}

/**
 * 3.5 LIVING ROOM – CENTRAL AREA (X: -2.6..+3.0, Z: -4.2..+6.5)
 * Shared central salon connecting naturally with the Upper-Middle Balcony (Z = -4.2),
 * Lower-Right Kitchen & Dining Area, and all three bedroom circulation paths.
 */
export const LivingRoom: React.FC<LivingRoomProps> = ({
  selectedId,
  onSelect,
  onFocusObject,
}) => {
  const m = getApartmentMaterials();

  return (
    <group name="area-3-5-living-room-central">
      {/* 1. Plush Textured Beige-Ivory Area Rug */}
      <RoundedBox
        args={[3.35, 0.015, 3.2]}
        radius={0.008}
        position={[0.82, 0.008, -2.35]}
        material={m.livingRug}
        receiveShadow
      />

      {/* 2. Large Modern Modular Luxury Sofa (Central Salon, Facing East toward TV) */}
      <InteractiveObject
        furnitureId="living-sofa"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[-0.72, 0, -2.35]}
      >
        <group>
          {/* Main 3-Seat Deep Sofa Base */}
          <RoundedBox
            args={[1.02, 0.24, 2.75]}
            radius={0.035}
            smoothness={4}
            position={[0, 0.16, 0]}
            material={m.ivoryBoucle}
            castShadow
            receiveShadow
          />
          {/* Chaise Longue Extension on Balcony Side (-Z, extending East +X) */}
          <RoundedBox
            args={[1.28, 0.24, 0.96]}
            radius={0.035}
            smoothness={4}
            position={[0.64, 0.16, -0.89]}
            material={m.ivoryBoucle}
            castShadow
            receiveShadow
          />

          {/* 3 Deep Seat Cushions */}
          {[-0.88, 0, 0.88].map((cz, i) => (
            <RoundedBox
              key={`seat-${i}`}
              args={[0.86, 0.16, 0.88]}
              radius={0.04}
              smoothness={4}
              position={[i === 0 ? 0.42 : 0.06, 0.34, cz]}
              scale={[i === 0 ? 1.74 : 1, 1, 1]}
              material={m.ivoryBoucle}
              castShadow
              receiveShadow
            />
          ))}

          {/* Low Architectural Backrest (-X side) */}
          <RoundedBox
            args={[0.22, 0.68, 2.78]}
            radius={0.045}
            smoothness={4}
            position={[-0.4, 0.38, 0]}
            material={m.ivoryBoucle}
            castShadow
          />
          {/* North & South Track Armrests */}
          <RoundedBox
            args={[1.42, 0.54, 0.22]}
            radius={0.04}
            smoothness={4}
            position={[0.2, 0.32, -1.28]}
            material={m.ivoryBoucle}
            castShadow
          />
          <RoundedBox
            args={[1.02, 0.54, 0.22]}
            radius={0.04}
            smoothness={4}
            position={[0, 0.32, 1.28]}
            material={m.ivoryBoucle}
            castShadow
          />

          {/* Tailored Backrest Pillows & Warm Beige Accent Cushions */}
          {[-0.86, 0, 0.86].map((pz, idx) => (
            <group key={`back-${idx}`} position={[-0.2, 0.56, pz]}>
              <RoundedBox
                args={[0.18, 0.35, 0.78]}
                radius={0.045}
                smoothness={4}
                rotation={[0, 0, 0.18]}
                material={m.crispWhiteLinen}
                castShadow
              />
              <RoundedBox
                args={[0.14, 0.26, 0.36]}
                radius={0.04}
                smoothness={4}
                position={[0.12, -0.04, idx === 0 ? 0.12 : -0.12]}
                rotation={[0.08, 0.2, 0.22]}
                material={m.warmBeigeFabric}
                castShadow
              />
            </group>
          ))}
        </group>
      </InteractiveObject>

      {/* Brushed Brass Arc Floor Lamp Beside Sofa */}
      <group position={[-1.08, 0, -0.78]}>
        <mesh position={[0, 0.025, 0]} material={m.travertineStone} castShadow>
          <cylinderGeometry args={[0.17, 0.18, 0.05, 24]} />
        </mesh>
        <mesh position={[0, 0.95, 0]} material={m.champagneBrass} castShadow>
          <cylinderGeometry args={[0.012, 0.014, 1.85, 16]} />
        </mesh>
        <mesh position={[0.22, 1.84, -0.1]} rotation={[0, 0, -0.45]} material={m.champagneBrass}>
          <cylinderGeometry args={[0.01, 0.012, 0.52, 12]} />
        </mesh>
        <mesh position={[0.38, 1.72, -0.14]} material={m.warmLedEmissive}>
          <sphereGeometry args={[0.125, 24, 24]} />
        </mesh>
      </group>

      {/* 3. Dual-Tier Travertine & Light-Oak Coffee Table */}
      <InteractiveObject
        furnitureId="living-coffee-table"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[0.92, 0, -2.35]}
      >
        <group>
          <RoundedBox
            args={[0.78, 0.22, 1.24]}
            radius={0.02}
            smoothness={3}
            position={[-0.05, 0.12, 0.05]}
            material={m.travertineStone}
            castShadow
            receiveShadow
          />
          <RoundedBox
            args={[0.84, 0.045, 1.28]}
            radius={0.018}
            smoothness={3}
            position={[0.07, 0.31, -0.07]}
            material={m.oakVeneer}
            castShadow
            receiveShadow
          />
          <RoundedBox
            args={[0.26, 0.036, 0.34]}
            radius={0.005}
            position={[0.05, 0.352, -0.24]}
            rotation={[0, 0.12, 0]}
            material={m.crispWhiteLinen}
            castShadow
          />
          <mesh position={[0.09, 0.41, 0.22]} material={m.calacattaMarble} castShadow>
            <cylinderGeometry args={[0.1, 0.065, 0.14, 24]} />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 4. Flagship 85-Inch Television & Modern Floating TV Cabinet (East Salon Wall X = +2.91) */}
      <InteractiveObject
        furnitureId="living-tv"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[2.91, 0, -2.52]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <FeatureMediaWallWithTV
          screenVariant="living"
          consoleWidth={2.65}
          backdropStone="travertine"
        />
      </InteractiveObject>

      {/* 5. Decorative Indoor Olive Plants Flanking Balcony Glass Doors & Foyer */}
      <group position={[-2.08, 0, -3.76]}>
        <IndoorDesignerPlant scale={1.0} />
      </group>
      <group position={[2.38, 0, -3.8]}>
        <IndoorDesignerPlant scale={1.05} />
      </group>
      <group position={[1.35, 0, 5.85]}>
        <IndoorDesignerPlant scale={0.95} />
      </group>

      {/* 6. Central Entry Gallery Console & Minimalist Wall Decorations (Z = +3.8) */}
      <group position={[-2.18, 0, 3.85]}>
        {/* Sculptural Travertine Console Table */}
        <RoundedBox
          args={[0.42, 0.045, 1.55]}
          radius={0.012}
          position={[0, 0.8, 0]}
          material={m.travertineStone}
          castShadow
          receiveShadow
        />
        {[-0.52, 0.52].map((cz, i) => (
          <RoundedBox
            key={i}
            args={[0.34, 0.78, 0.14]}
            radius={0.01}
            position={[0, 0.39, cz]}
            material={m.travertineStone}
            castShadow
          />
        ))}
        <mesh position={[0, 0.94, -0.38]} material={m.matteWhiteLacquer} castShadow>
          <cylinderGeometry args={[0.065, 0.095, 0.24, 22]} />
        </mesh>
      </group>

      <group position={[-2.5, 1.72, 3.25]} rotation={[0, Math.PI / 2, 0]}>
        <FramedWallArt width={0.98} height={1.28} variant={1} />
      </group>
      <group position={[-2.5, 1.72, 4.45]} rotation={[0, Math.PI / 2, 0]}>
        <FramedWallArt width={0.98} height={1.28} variant={3} />
      </group>

      {/* 7. Realistic Ceiling Lighting Across Central Salon & Gallery */}
      <group position={[0.45, 0, -2.35]}>
        <HaloCeilingFixture outerRadius={0.72} dropHeight={2.75} />
      </group>
      <group position={[-0.2, 0, 3.5]}>
        <HaloCeilingFixture outerRadius={0.54} dropHeight={2.8} />
      </group>
    </group>
  );
};
