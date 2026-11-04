import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { FurnitureItemInfo } from '../../types/apartment';
import { getApartmentMaterials } from '../../utils/materials';
import { InteractiveObject } from './InteractiveObject';

interface KitchenProps {
  selectedId: string | null;
  onSelect: (item: FurnitureItemInfo) => void;
  onFocusObject: (item: FurnitureItemInfo) => void;
}

const DiningChair: React.FC = () => {
  const m = getApartmentMaterials();
  return (
    <group>
      {[
        [-0.2, 0.22, -0.2],
        [0.2, 0.22, -0.2],
        [-0.2, 0.22, 0.2],
        [0.2, 0.22, 0.2],
      ].map(([lx, ly, lz], i) => (
        <mesh
          key={i}
          position={[lx, ly, lz]}
          rotation={[lz < 0 ? -0.06 : 0.06, 0, lx < 0 ? 0.06 : -0.06]}
          material={m.oakVeneer}
          castShadow
        >
          <cylinderGeometry args={[0.016, 0.012, 0.44, 14]} />
        </mesh>
      ))}
      <RoundedBox
        args={[0.48, 0.075, 0.46]}
        radius={0.028}
        smoothness={3}
        position={[0, 0.45, 0]}
        material={m.ivoryBoucle}
        castShadow
        receiveShadow
      />
      <mesh
        position={[0, 0.67, 0]}
        rotation={[0, Math.PI, 0]}
        material={m.ivoryBoucle}
        castShadow
      >
        <cylinderGeometry args={[0.24, 0.23, 0.26, 24, 1, true, -Math.PI * 0.58, Math.PI * 1.16]} />
      </mesh>
    </group>
  );
};

const IslandBarstool: React.FC = () => {
  const m = getApartmentMaterials();
  return (
    <group>
      {[
        [-0.17, 0.32, -0.17],
        [0.17, 0.32, -0.17],
        [-0.17, 0.32, 0.17],
        [0.17, 0.32, 0.17],
      ].map(([lx, ly, lz], i) => (
        <mesh key={i} position={[lx, ly, lz]} material={m.oakVeneer} castShadow>
          <cylinderGeometry args={[0.015, 0.012, 0.64, 12]} />
        </mesh>
      ))}
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.champagneBrass}>
        <torusGeometry args={[0.18, 0.008, 10, 28]} />
      </mesh>
      <mesh position={[0, 0.65, 0]} material={m.ivoryBoucle} castShadow>
        <cylinderGeometry args={[0.2, 0.19, 0.07, 24]} />
      </mesh>
      <RoundedBox
        args={[0.34, 0.12, 0.05]}
        radius={0.02}
        position={[0, 0.73, 0.17]}
        material={m.ivoryBoucle}
        castShadow
      />
    </group>
  );
};

/**
 * 3.6 KITCHEN AND DINING AREA – LOWER RIGHT (X: +2.6..+9.0, Z: -1.0..+6.5)
 * Spacious lower-right culinary & dining hall with L-shaped white & oak cabinetry,
 * Calacatta marble waterfall island, integrated appliances, and 6-seater dining table.
 */
export const Kitchen: React.FC<KitchenProps> = ({
  selectedId,
  onSelect,
  onFocusObject,
}) => {
  const m = getApartmentMaterials();

  return (
    <group name="area-3-6-kitchen-and-dining-lower-right">
      {/* 1. INTEGRATED FRENCH-DOOR REFRIGERATOR (East Wall North End: X = +8.54, Z = +0.15) */}
      <InteractiveObject
        furnitureId="kitchen-fridge"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[8.54, 0, 0.15]}
        rotation={[0, Math.PI, 0]}
      >
        <group>
          <mesh position={[-0.04, 1.42, 0]} material={m.matteWhiteLacquer} castShadow receiveShadow>
            <boxGeometry args={[0.68, 2.84, 1.04]} />
          </mesh>
          {[-0.24, 0.24].map((fz, i) => (
            <RoundedBox
              key={i}
              args={[0.04, 1.38, 0.47]}
              radius={0.008}
              position={[0.32, 1.48, fz]}
              material={m.brushedSteel}
              castShadow
            />
          ))}
          <RoundedBox
            args={[0.04, 0.68, 0.96]}
            radius={0.008}
            position={[0.32, 0.42, 0]}
            material={m.brushedSteel}
            castShadow
          />
          <mesh position={[0.335, 1.38, 0.24]} material={m.matteBlackMetal}>
            <boxGeometry args={[0.02, 0.24, 0.14]} />
          </mesh>
          {[-0.04, 0.04].map((hz, idx) => (
            <mesh key={idx} position={[0.36, 1.48, hz]} material={m.chromeMetal}>
              <cylinderGeometry args={[0.009, 0.009, 0.85, 12]} />
            </mesh>
          ))}
          <mesh
            position={[0.36, 0.68, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            material={m.chromeMetal}
          >
            <cylinderGeometry args={[0.009, 0.009, 0.72, 12]} />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 2. L-SHAPED CULINARY RUN: WALL OVEN, WHITE & OAK CABINETS, COOKTOP, RANGE HOOD & SINK */}
      <InteractiveObject
        furnitureId="kitchen-cookzone"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[8.56, 0, 3.45]}
        rotation={[0, Math.PI, 0]}
      >
        <group>
          {/* Tall Built-In Wall Oven Column (at local Z = +2.3 -> World Z = +1.15) */}
          <group position={[0, 0, 2.3]}>
            <mesh position={[0, 1.42, 0]} material={m.matteWhiteLacquer} castShadow receiveShadow>
              <boxGeometry args={[0.66, 2.84, 0.82]} />
            </mesh>
            <RoundedBox
              args={[0.035, 0.58, 0.68]}
              radius={0.006}
              position={[0.335, 1.12, 0]}
              material={m.blackCeramicGlass}
              castShadow
            />
            <mesh position={[0.35, 1.35, 0]} material={m.brushedSteel}>
              <boxGeometry args={[0.015, 0.075, 0.66]} />
            </mesh>
            <mesh position={[0.36, 1.35, 0]} material={m.coolRgbIceEmissive}>
              <boxGeometry args={[0.008, 0.022, 0.1]} />
            </mesh>
            <mesh
              position={[0.375, 1.27, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              material={m.brushedSteel}
            >
              <cylinderGeometry args={[0.009, 0.009, 0.58, 12]} />
            </mesh>
          </group>

          {/* East Wall Lower Base Cabinets (local Z = -2.85 .. +1.85 -> World Z = +1.60 .. +6.30) */}
          <RoundedBox
            args={[0.64, 0.86, 4.7]}
            radius={0.008}
            position={[0, 0.44, -0.5]}
            material={m.matteWhiteLacquer}
            castShadow
            receiveShadow
          />
          <mesh position={[0.02, 0.89, -0.5]} material={m.calacattaMarble} castShadow receiveShadow>
            <boxGeometry args={[0.68, 0.04, 4.72]} />
          </mesh>

          {/* Calacatta Marble Backsplash (Split around East Kitchen Window Z = 4.15..5.65 -> local Z = -0.7..-2.2) */}
          <mesh position={[-0.31, 1.52, 0.65]} material={m.calacattaMarble} receiveShadow>
            <boxGeometry args={[0.025, 1.24, 2.45]} />
          </mesh>

          {/* Upper Fluted Light-Oak Wall Cabinets + Warm LED Strip */}
          {[1.32, -2.52].map((uz, idx) => (
            <group key={idx} position={[-0.1, 2.42, uz]}>
              <RoundedBox
                args={[0.42, 0.84, 1.05]}
                radius={0.008}
                material={m.oakVeneer}
                castShadow
              />
              <mesh position={[0.1, -0.43, 0]} material={m.warmLedEmissive}>
                <boxGeometry args={[0.03, 0.012, 0.96]} />
              </mesh>
            </group>
          ))}

          {/* Flush 4-Zone Induction Cooktop + Overhead Range Hood (local Z = +0.4 -> World Z = +3.05) */}
          <group position={[0.04, 0.914, 0.4]}>
            <RoundedBox
              args={[0.52, 0.008, 0.8]}
              radius={0.004}
              material={m.blackCeramicGlass}
            />
            {[
              [-0.12, -0.2],
              [0.12, -0.2],
              [-0.12, 0.2],
              [0.12, 0.2],
            ].map(([bx, bz], i) => (
              <mesh
                key={i}
                position={[bx, 0.006, bz]}
                rotation={[-Math.PI / 2, 0, 0]}
                material={m.satinWhiteAluminum}
              >
                <ringGeometry args={[0.068, 0.074, 24]} />
              </mesh>
            ))}
            <group position={[0.12, 0.07, -0.2]}>
              <mesh material={m.brushedSteel} castShadow>
                <cylinderGeometry args={[0.095, 0.09, 0.13, 24]} />
              </mesh>
              <mesh position={[0, 0.07, 0]} material={m.brushedSteel}>
                <cylinderGeometry args={[0.098, 0.098, 0.012, 24]} />
              </mesh>
            </group>
          </group>

          <group position={[-0.02, 2.24, 0.4]}>
            <RoundedBox
              args={[0.52, 0.09, 0.88]}
              radius={0.012}
              position={[0, -0.34, 0]}
              material={m.matteWhiteLacquer}
              castShadow
            />
            <mesh position={[0, -0.388, 0]} material={m.brushedSteel}>
              <boxGeometry args={[0.46, 0.01, 0.8]} />
            </mesh>
            <mesh position={[-0.08, 0.18, 0]} material={m.satinWhiteAluminum} castShadow>
              <boxGeometry args={[0.32, 0.96, 0.36]} />
            </mesh>
            <mesh position={[0.12, -0.385, 0]} material={m.warmLedEmissive}>
              <boxGeometry args={[0.04, 0.01, 0.7]} />
            </mesh>
          </group>

          {/* Undermount Stainless Steel Sink & Chrome Gooseneck Faucet Below East Window (local Z = -1.45 -> World Z = +4.90) */}
          <group position={[0.04, 0.9, -1.45]}>
            <mesh position={[0, 0.012, 0]} material={m.brushedSteel}>
              <boxGeometry args={[0.46, 0.012, 0.72]} />
            </mesh>
            <mesh position={[0, 0.015, 0]} material={m.matteBlackMetal}>
              <boxGeometry args={[0.41, 0.01, 0.65]} />
            </mesh>
            <group position={[-0.24, 0.02, 0]}>
              <mesh position={[0, 0.14, 0]} material={m.chromeMetal} castShadow>
                <cylinderGeometry args={[0.014, 0.018, 0.28, 16]} />
              </mesh>
              <mesh position={[0.1, 0.27, 0]} material={m.chromeMetal} castShadow>
                <torusGeometry args={[0.1, 0.012, 12, 24, Math.PI]} />
              </mesh>
            </group>
          </group>

          {/* South L-Return Cabinets & Countertop (World X = +4.8..+8.25, World Z = +6.08) */}
          <group position={[2.05, 0, -2.63]}>
            <RoundedBox
              args={[3.4, 0.86, 0.64]}
              radius={0.008}
              position={[0, 0.44, 0]}
              material={m.matteWhiteLacquer}
              castShadow
              receiveShadow
            />
            <mesh position={[0, 0.89, 0.02]} material={m.calacattaMarble} castShadow receiveShadow>
              <boxGeometry args={[3.42, 0.04, 0.68]} />
            </mesh>
            <mesh position={[0, 1.48, -0.31]} material={m.calacattaMarble} receiveShadow>
              <boxGeometry args={[3.4, 1.15, 0.025]} />
            </mesh>
            {/* Fluted Oak Upper Cabinet on South Wall */}
            <RoundedBox
              args={[2.4, 0.82, 0.4]}
              radius={0.008}
              position={[0.2, 2.42, -0.11]}
              material={m.oakVeneer}
              castShadow
            />
            {/* Ceramic Canisters & Cutting Board */}
            {[-0.6, -0.4, -0.2].map((cx, ci) => (
              <mesh key={ci} position={[cx, 0.98, -0.12]} material={m.matteWhiteLacquer} castShadow>
                <cylinderGeometry args={[0.048, 0.048, 0.14, 20]} />
              </mesh>
            ))}
            <RoundedBox
              args={[0.44, 0.022, 0.32]}
              radius={0.008}
              position={[0.65, 0.922, 0.04]}
              material={m.oakVeneer}
              castShadow
            />
          </group>
        </group>
      </InteractiveObject>

      {/* 3. CALACATTA MARBLE WATERFALL KITCHEN ISLAND + 3 BARSTOOLS */}
      <InteractiveObject
        furnitureId="kitchen-island"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[6.4, 0, 3.0]}
        rotation={[0, Math.PI, 0]}
      >
        <group>
          <RoundedBox
            args={[0.78, 0.86, 2.48]}
            radius={0.01}
            position={[-0.08, 0.43, 0]}
            material={m.oakVeneer}
            castShadow
            receiveShadow
          />
          <mesh position={[0.32, 0.85, 0]} material={m.warmLedEmissive}>
            <boxGeometry args={[0.02, 0.015, 2.42]} />
          </mesh>

          <mesh position={[0, 0.895, 0]} material={m.calacattaMarble} castShadow receiveShadow>
            <boxGeometry args={[1.06, 0.05, 2.6]} />
          </mesh>
          <mesh position={[0, 0.46, -1.275]} material={m.calacattaMarble} castShadow receiveShadow>
            <boxGeometry args={[1.06, 0.92, 0.05]} />
          </mesh>
          <mesh position={[0, 0.46, 1.275]} material={m.calacattaMarble} castShadow receiveShadow>
            <boxGeometry args={[1.06, 0.92, 0.05]} />
          </mesh>

          {/* 3 Barstools on Dining-Facing Side */}
          {[-0.78, 0, 0.78].map((sz, i) => (
            <group key={i} position={[0.52, 0, sz]} rotation={[0, -Math.PI / 2, 0]}>
              <IslandBarstool />
            </group>
          ))}

          {/* Espresso Machine & Fruit Bowl */}
          <group position={[-0.18, 0.92, 0.72]}>
            <RoundedBox
              args={[0.28, 0.3, 0.24]}
              radius={0.015}
              position={[0, 0.15, 0]}
              material={m.brushedSteel}
              castShadow
            />
            <mesh position={[0.14, 0.16, 0]} material={m.chromeMetal}>
              <cylinderGeometry args={[0.028, 0.024, 0.08, 16]} />
            </mesh>
          </group>
          <mesh position={[0.02, 0.96, -0.42]} material={m.travertineStone} castShadow>
            <cylinderGeometry args={[0.18, 0.09, 0.08, 28]} />
          </mesh>
        </group>
      </InteractiveObject>

      {/* Dual Suspended Opal Glass Pendant Lights Over Island */}
      {[2.25, 3.75].map((iz, idx) => (
        <group key={idx} position={[6.4, 2.18, iz]}>
          <mesh position={[0, 0.46, 0]} material={m.champagneBrass}>
            <cylinderGeometry args={[0.005, 0.005, 0.92, 8]} />
          </mesh>
          <mesh material={m.warmLedEmissive}>
            <sphereGeometry args={[0.11, 24, 24]} />
          </mesh>
          <mesh position={[0, 0.11, 0]} material={m.champagneBrass}>
            <cylinderGeometry args={[0.032, 0.045, 0.04, 16]} />
          </mesh>
        </group>
      ))}

      {/* 4. SIX-SEATER SCULPTURAL OAK & MARBLE DINING TABLE + CHAIRS */}
      <InteractiveObject
        furnitureId="dining-table"
        selectedId={selectedId}
        onSelect={onSelect}
        onDoubleClickFocus={onFocusObject}
        position={[3.55, 0, 3.0]}
      >
        <group>
          {[-0.62, 0.62].map((pz, idx) => (
            <mesh key={idx} position={[0, 0.36, pz]} material={m.oakVeneer} castShadow receiveShadow>
              <cylinderGeometry args={[0.17, 0.21, 0.72, 28]} />
            </mesh>
          ))}
          <RoundedBox
            args={[1.06, 0.042, 2.22]}
            radius={0.02}
            smoothness={4}
            position={[0, 0.74, 0]}
            material={m.calacattaMarble}
            castShadow
            receiveShadow
          />

          <mesh position={[0, 0.77, 0]} material={m.oakVeneer} castShadow>
            <cylinderGeometry args={[0.2, 0.18, 0.018, 24]} />
          </mesh>
          <mesh position={[0, 0.88, 0]} material={m.matteWhiteLacquer} castShadow>
            <cylinderGeometry args={[0.045, 0.072, 0.21, 20]} />
          </mesh>

          {[-0.68, 0, 0.68].map((cz, idx) => (
            <React.Fragment key={idx}>
              <group position={[-0.68, 0, cz]} rotation={[0, Math.PI / 2, 0]}>
                <DiningChair />
              </group>
              <group position={[0.68, 0, cz]} rotation={[0, -Math.PI / 2, 0]}>
                <DiningChair />
              </group>
            </React.Fragment>
          ))}
        </group>
      </InteractiveObject>

      {/* Suspended Linear Chandelier Above Dining Table */}
      <group position={[3.55, 2.22, 3.0]}>
        {[-0.6, 0.6].map((cz, i) => (
          <mesh key={i} position={[0, 0.44, cz]} material={m.champagneBrass}>
            <cylinderGeometry args={[0.005, 0.005, 0.88, 8]} />
          </mesh>
        ))}
        <RoundedBox
          args={[0.045, 0.036, 1.65]}
          radius={0.016}
          material={m.warmLedEmissive}
        />
        <mesh position={[0, 0.024, 0]} material={m.champagneBrass}>
          <boxGeometry args={[0.05, 0.014, 1.68]} />
        </mesh>
      </group>
    </group>
  );
};
