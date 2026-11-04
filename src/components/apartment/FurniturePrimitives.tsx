import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { getApartmentMaterials } from '../../utils/materials';

/**
 * Showcase White Gaming & Workstation PC Case with Tempered Glass,
 * Detailed Internal Components, Braided Cable Management, AIO Tubes, Fans & RGB
 * Local orientation:
 * - Front Tempered Glass Panel at +Z (facing user / room)
 * - Left Tempered Glass Side Panel at -X (or +Z depending on rotation; let's put Panoramic Front at +Z and Full Tempered Glass Side at +X or -X!)
 * Wait: When desk faces -Z (toward North window) and user sits on +Z side facing -Z:
 * - PC sits on the right side of the desk (+X side of desk).
 * - User sitting at center of desk looks toward +X to see into the PC's LEFT Tempered Glass Side Panel (-X face of PC!), and looks at +Z to see the PC's FRONT Tempered Glass Panel (+Z face of PC!).
 * Let's make -X the Full Clear Tempered Glass Side Panel AND +Z the Panoramic Clear Tempered Glass Front Panel!
 */
export const WhiteGamingPCTower: React.FC<{
  rgbVariant?: 'ice' | 'violet';
  enablePointLight?: boolean;
}> = ({ rgbVariant = 'ice', enablePointLight = true }) => {
  const m = getApartmentMaterials();
  const rgbMat = rgbVariant === 'ice' ? m.coolRgbIceEmissive : m.softVioletRgbEmissive;
  const lightColor = rgbVariant === 'ice' ? '#7dd3fc' : '#c4b5fd';

  // Curved white braided AIO liquid cooler tubes from CPU block to top 360mm radiator
  const { aioTube1, aioTube2 } = useMemo(() => {
    const c1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.015, 0.305, -0.02),
      new THREE.Vector3(-0.045, 0.33, 0.04),
      new THREE.Vector3(-0.035, 0.385, 0.09),
      new THREE.Vector3(-0.02, 0.41, 0.11),
    ]);
    const c2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.015, 0.292, -0.035),
      new THREE.Vector3(-0.052, 0.318, 0.025),
      new THREE.Vector3(-0.042, 0.378, 0.075),
      new THREE.Vector3(-0.02, 0.41, 0.09),
    ]);
    return {
      aioTube1: new THREE.TubeGeometry(c1, 20, 0.0055, 10, false),
      aioTube2: new THREE.TubeGeometry(c2, 20, 0.0055, 10, false),
    };
  }, []);

  return (
    <group>
      {/* 4 Machined Silver Isolation Feet */}
      {[
        [-0.1, 0.012, -0.17],
        [0.1, 0.012, -0.17],
        [-0.1, 0.012, 0.17],
        [0.1, 0.012, 0.17],
      ].map(([fx, fy, fz], i) => (
        <mesh key={i} position={[fx, fy, fz]} material={m.brushedSteel} castShadow>
          <cylinderGeometry args={[0.02, 0.022, 0.024, 16]} />
        </mesh>
      ))}

      {/* Bottom White Chassis Base */}
      <RoundedBox
        args={[0.275, 0.052, 0.445]}
        radius={0.008}
        smoothness={3}
        position={[0, 0.048, 0]}
        material={m.satinWhiteAluminum}
        castShadow
        receiveShadow
      />

      {/* Top White Ventilated Radiator Roof Panel */}
      <RoundedBox
        args={[0.275, 0.032, 0.445]}
        radius={0.008}
        smoothness={3}
        position={[0, 0.446, 0]}
        material={m.satinWhiteAluminum}
        castShadow
      />

      {/* Rear White Aluminum Panel (-Z) */}
      <mesh position={[0, 0.248, -0.214]} material={m.satinWhiteAluminum} castShadow>
        <boxGeometry args={[0.27, 0.37, 0.016]} />
      </mesh>

      {/* Right Dual-Chamber PSU & Cable Management Compartment (+X) */}
      <mesh position={[0.09, 0.248, 0]} material={m.matteWhiteLacquer} castShadow>
        <boxGeometry args={[0.092, 0.37, 0.43]} />
      </mesh>

      {/* White ATX Motherboard PCB & Silver VRM/NVMe Armor */}
      <mesh position={[0.038, 0.26, -0.02]} material={m.satinWhiteAluminum}>
        <boxGeometry args={[0.012, 0.295, 0.265]} />
      </mesh>
      <mesh position={[0.024, 0.365, -0.04]} material={m.brushedSteel}>
        <boxGeometry args={[0.022, 0.045, 0.15]} />
      </mesh>
      <mesh position={[0.024, 0.315, -0.115]} material={m.brushedSteel}>
        <boxGeometry args={[0.024, 0.115, 0.038]} />
      </mesh>
      {/* M.2 NVMe White Heatsink Shield */}
      <mesh position={[0.026, 0.245, -0.02]} material={m.matteWhiteLacquer}>
        <boxGeometry args={[0.014, 0.032, 0.14]} />
      </mesh>

      {/* AIO CPU Liquid Cooler Block with Infinity-Mirror RGB Halo */}
      <group position={[0.012, 0.31, -0.025]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={m.matteWhiteLacquer}>
          <cylinderGeometry args={[0.035, 0.035, 0.032, 28]} />
        </mesh>
        <mesh position={[-0.017, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={rgbMat}>
          <ringGeometry args={[0.018, 0.029, 28]} />
        </mesh>
        <mesh position={[-0.0175, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={rgbMat}>
          <circleGeometry args={[0.009, 20]} />
        </mesh>
      </group>

      {/* Braided White AIO Liquid Cooling Tubes */}
      <mesh geometry={aioTube1} material={m.crispWhiteLinen} castShadow />
      <mesh geometry={aioTube2} material={m.crispWhiteLinen} castShadow />

      {/* 4 Sticks of Glowing White DDR5 RGB RAM */}
      {[0.02, 0.032, 0.044, 0.056].map((zOff, idx) => (
        <mesh key={idx} position={[0.018, 0.312, zOff]} material={rgbMat}>
          <boxGeometry args={[0.014, 0.118, 0.006]} />
        </mesh>
      ))}

      {/* Combed White Braided 24-Pin Motherboard & 12VHPWR GPU Cables (Clean Cable Management!) */}
      <group position={[0.026, 0.295, 0.105]}>
        {Array.from({ length: 6 }).map((_, ci) => (
          <mesh
            key={`atx-cable-${ci}`}
            position={[0, -0.022 + ci * 0.0085, 0]}
            rotation={[0, 0.35, Math.PI / 2]}
            material={m.crispWhiteLinen}
          >
            <cylinderGeometry args={[0.0028, 0.0028, 0.055, 8]} />
          </mesh>
        ))}
        {/* Black Cable Comb */}
        <mesh position={[-0.006, 0, 0]} material={m.matteBlackMetal}>
          <boxGeometry args={[0.006, 0.055, 0.01]} />
        </mesh>
      </group>

      {/* White Triple-Fan Flagship RTX Graphics Card + Braided 12VHPWR Power Drop */}
      <group position={[-0.024, 0.198, -0.01]}>
        <RoundedBox
          args={[0.118, 0.05, 0.305]}
          radius={0.007}
          smoothness={3}
          material={m.matteWhiteLacquer}
          castShadow
        />
        {/* White Aluminum Backplate */}
        <mesh position={[0, 0.026, 0]} material={m.satinWhiteAluminum}>
          <boxGeometry args={[0.114, 0.003, 0.3]} />
        </mesh>
        {/* Glowing ARGB Side Horizon Bar */}
        <mesh position={[-0.06, 0.006, 0.02]} material={rgbMat}>
          <boxGeometry args={[0.004, 0.012, 0.21]} />
        </mesh>
        {/* Combed White GPU Power Strands */}
        <RoundedBox
          args={[0.018, 0.075, 0.032]}
          radius={0.004}
          position={[-0.052, -0.045, 0.06]}
          material={m.crispWhiteLinen}
        />
      </group>

      {/* 3 Bottom Intake White ARGB 120mm Fans with Impeller Hubs */}
      {[-0.13, 0, 0.13].map((fz, i) => (
        <group key={`bfan-${i}`} position={[-0.024, 0.088, fz]}>
          <mesh material={m.matteWhiteLacquer}>
            <cylinderGeometry args={[0.054, 0.054, 0.018, 24]} />
          </mesh>
          <mesh position={[0, 0.01, 0]} material={m.satinWhiteAluminum}>
            <cylinderGeometry args={[0.018, 0.018, 0.006, 16]} />
          </mesh>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={rgbMat}>
            <ringGeometry args={[0.041, 0.051, 28]} />
          </mesh>
        </group>
      ))}

      {/* 3 Top 360mm Radiator Exhaust ARGB Fans */}
      {[-0.13, 0, 0.13].map((fz, i) => (
        <group key={`tfan-${i}`} position={[-0.024, 0.415, fz]}>
          <mesh material={m.matteWhiteLacquer}>
            <cylinderGeometry args={[0.054, 0.054, 0.024, 24]} />
          </mesh>
          <mesh position={[0, -0.013, 0]} rotation={[Math.PI / 2, 0, 0]} material={rgbMat}>
            <ringGeometry args={[0.04, 0.05, 28]} />
          </mesh>
        </group>
      ))}

      {/* Rear Exhaust White ARGB 120mm Fan */}
      <group position={[-0.024, 0.32, -0.194]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.matteWhiteLacquer}>
          <cylinderGeometry args={[0.05, 0.05, 0.018, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.01]} material={rgbMat}>
          <ringGeometry args={[0.038, 0.047, 24]} />
        </mesh>
      </group>

      {/* Internal ARGB Point Light */}
      {enablePointLight && (
        <pointLight
          position={[-0.03, 0.25, 0.0]}
          color={lightColor}
          intensity={0.5}
          distance={1.65}
          decay={2}
        />
      )}

      {/* Pillarless Clear Tempered Glass Left Side Panel (-X) & Front Panel (+Z) */}
      <mesh position={[-0.134, 0.248, 0]} material={m.temperedCaseGlass} renderOrder={4}>
        <boxGeometry args={[0.005, 0.368, 0.436]} />
      </mesh>
      <mesh position={[-0.022, 0.248, 0.218]} material={m.temperedCaseGlass} renderOrder={4}>
        <boxGeometry args={[0.224, 0.368, 0.005]} />
      </mesh>
      {/* Subtle White Top/Bottom Glass Silk-Screen Borders */}
      <mesh position={[-0.135, 0.426, 0]} material={m.matteWhiteLacquer}>
        <boxGeometry args={[0.006, 0.012, 0.438]} />
      </mesh>
      <mesh position={[-0.022, 0.426, 0.219]} material={m.matteWhiteLacquer}>
        <boxGeometry args={[0.226, 0.012, 0.006]} />
      </mesh>
    </group>
  );
};

/**
 * White Studio Workstation Desk + Dual White Monitors + White Mechanical Keyboard, Mouse & Headphones
 * Local orientation: User sits at +Z facing -Z (so front of monitors faces +Z!)
 * Width along X = 1.70m, Depth along Z = 0.76m, Height Y = 0.74m
 */
export const WhiteWorkstationDeskOnly: React.FC = () => {
  const m = getApartmentMaterials();

  return (
    <group>
      {/* Beveled Matte Pure-White Desktop (Width X = 1.70m, Depth Z = 0.76m) */}
      <RoundedBox
        args={[1.7, 0.032, 0.76]}
        radius={0.008}
        smoothness={3}
        position={[0, 0.735, 0]}
        material={m.matteWhiteLacquer}
        castShadow
        receiveShadow
      />

      {/* Motorized Dual-Column White Powder-Coated Legs */}
      {[-0.7, 0.7].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, -0.02]}>
          <RoundedBox
            args={[0.05, 0.7, 0.075]}
            radius={0.006}
            position={[0, 0.36, 0]}
            material={m.satinWhiteAluminum}
            castShadow
          />
          <RoundedBox
            args={[0.068, 0.026, 0.62]}
            radius={0.008}
            position={[0, 0.013, 0.02]}
            material={m.satinWhiteAluminum}
            castShadow
            receiveShadow
          />
        </group>
      ))}

      {/* Under-Desk White Cable Management Tray */}
      <mesh position={[0, 0.68, -0.22]} material={m.satinWhiteAluminum}>
        <boxGeometry args={[1.18, 0.05, 0.14]} />
      </mesh>

      {/* Light-Gray Architectural Wool Felt Desk Mat */}
      <RoundedBox
        args={[0.92, 0.004, 0.4]}
        radius={0.002}
        position={[-0.16, 0.753, 0.12]}
        material={m.lightGrayFelt}
        receiveShadow
      />

      {/* Articulated White Dual Monitor Arm Post */}
      <mesh position={[-0.16, 0.92, -0.31]} material={m.satinWhiteAluminum} castShadow>
        <cylinderGeometry args={[0.018, 0.022, 0.36, 16]} />
      </mesh>
      <mesh position={[-0.16, 1.05, -0.22]} material={m.satinWhiteAluminum} castShadow>
        <boxGeometry args={[0.035, 0.024, 0.18]} />
      </mesh>

      {/* Primary 34" White Ultrawide Studio Monitor (Screen faces +Z toward user) */}
      <group position={[-0.18, 1.09, -0.14]}>
        <RoundedBox
          args={[0.82, 0.36, 0.024]}
          radius={0.008}
          smoothness={3}
          material={m.matteWhiteLacquer}
          castShadow
        />
        <mesh position={[0, -0.172, 0.013]} material={m.satinWhiteAluminum}>
          <boxGeometry args={[0.816, 0.014, 0.004]} />
        </mesh>
        <mesh position={[0, 0.004, 0.013]} material={m.pcScreenPrimary}>
          <planeGeometry args={[0.795, 0.335]} />
        </mesh>
      </group>

      {/* Secondary 27" Angled White Reference Monitor (Left side, angled inward) */}
      <group position={[-0.69, 1.08, -0.04]} rotation={[0, 0.38, 0]}>
        <RoundedBox
          args={[0.58, 0.34, 0.022]}
          radius={0.007}
          smoothness={3}
          material={m.matteWhiteLacquer}
          castShadow
        />
        <mesh position={[0, 0, 0.012]} material={m.pcScreenSecondary}>
          <planeGeometry args={[0.556, 0.318]} />
        </mesh>
      </group>

      {/* Custom 75% White Aluminum Mechanical Keyboard */}
      <group position={[-0.22, 0.764, 0.14]} rotation={[0.05, 0, 0]}>
        <RoundedBox
          args={[0.325, 0.018, 0.135]}
          radius={0.004}
          material={m.matteWhiteLacquer}
          castShadow
        />
        {[-0.042, -0.018, 0.006, 0.03].map((kz, rIdx) => (
          <mesh key={rIdx} position={[0, 0.012, kz]} material={m.crispWhiteLinen} castShadow>
            <boxGeometry args={[0.295, 0.009, 0.019]} />
          </mesh>
        ))}
        <mesh position={[0.142, 0.015, -0.042]} material={m.champagneBrass}>
          <cylinderGeometry args={[0.008, 0.008, 0.012, 16]} />
        </mesh>
      </group>

      {/* White Ultralight Wireless Gaming Mouse */}
      <group position={[0.11, 0.766, 0.14]}>
        <RoundedBox
          args={[0.062, 0.032, 0.118]}
          radius={0.015}
          smoothness={4}
          material={m.matteWhiteLacquer}
          castShadow
        />
        <mesh position={[0, 0.017, -0.03]} rotation={[0, 0, Math.PI / 2]} material={m.brushedSteel}>
          <cylinderGeometry args={[0.006, 0.006, 0.005, 12]} />
        </mesh>
      </group>

      {/* Compact White Studio Speakers */}
      {[-0.54, 0.16].map((sx, i) => (
        <group key={`spk-${i}`} position={[sx, 0.825, -0.16]} rotation={[0, i === 0 ? 0.18 : -0.18, 0]}>
          <RoundedBox
            args={[0.095, 0.145, 0.11]}
            radius={0.012}
            material={m.matteWhiteLacquer}
            castShadow
          />
          <mesh position={[0, -0.015, 0.056]} material={m.satinWhiteAluminum}>
            <circleGeometry args={[0.032, 20]} />
          </mesh>
        </group>
      ))}

      {/* Brushed Aluminum Headphone Stand + White Over-Ear Studio Headphones */}
      <group position={[0.31, 0.752, -0.14]}>
        <mesh position={[0, 0.006, 0]} material={m.brushedSteel} castShadow>
          <cylinderGeometry args={[0.052, 0.056, 0.012, 24]} />
        </mesh>
        <mesh position={[0, 0.125, 0]} material={m.brushedSteel} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.24, 12]} />
        </mesh>
        <mesh position={[0, 0.185, 0]} material={m.matteWhiteLacquer} castShadow>
          <torusGeometry args={[0.068, 0.01, 12, 24, Math.PI]} />
        </mesh>
        {[-0.066, 0.066].map((ex, idx) => (
          <mesh
            key={idx}
            position={[ex, 0.145, 0]}
            rotation={[0, 0, Math.PI / 2]}
            material={m.ivoryBoucle}
            castShadow
          >
            <cylinderGeometry args={[0.042, 0.042, 0.032, 20]} />
          </mesh>
        ))}
      </group>

      {/* Minimalist Matte White Ceramic Cup & Oak Coaster */}
      <group position={[-0.56, 0.754, 0.18]}>
        <mesh position={[0, 0.003, 0]} material={m.oakVeneer}>
          <cylinderGeometry args={[0.046, 0.046, 0.006, 20]} />
        </mesh>
        <mesh position={[0, 0.044, 0]} material={m.matteWhiteLacquer} castShadow>
          <cylinderGeometry args={[0.036, 0.032, 0.078, 20]} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Ergonomic White Gaming / Studio Chair
 * Oriented facing -Z by default (backrest at +Z, user faces -Z toward desk)
 */
export const WhiteErgonomicStudioChair: React.FC = () => {
  const m = getApartmentMaterials();

  return (
    <group>
      {/* Central Gas-Lift Cylinder */}
      <mesh position={[0, 0.24, 0]} material={m.chromeMetal} castShadow>
        <cylinderGeometry args={[0.024, 0.028, 0.32, 16]} />
      </mesh>

      {/* 5-Star Cast White Aluminum Base + Casters */}
      {[0, 1, 2, 3, 4].map((idx) => {
        const angle = (idx * Math.PI * 2) / 5;
        return (
          <group key={idx} rotation={[0, angle, 0]}>
            <RoundedBox
              args={[0.31, 0.024, 0.038]}
              radius={0.008}
              position={[0.15, 0.075, 0]}
              rotation={[0, 0, -0.12]}
              material={m.satinWhiteAluminum}
              castShadow
            />
            <mesh position={[0.29, 0.028, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.matteWhiteLacquer}>
              <cylinderGeometry args={[0.026, 0.026, 0.024, 14]} />
            </mesh>
          </group>
        );
      })}

      {/* Contoured Seat Cushion */}
      <RoundedBox
        args={[0.52, 0.085, 0.52]}
        radius={0.028}
        smoothness={4}
        position={[0, 0.44, -0.02]}
        material={m.matteWhiteLacquer}
        castShadow
        receiveShadow
      />
      {[-0.24, 0.24].map((bx, idx) => (
        <RoundedBox
          key={idx}
          args={[0.065, 0.055, 0.48]}
          radius={0.02}
          position={[bx, 0.48, -0.02]}
          material={m.ivoryBoucle}
          castShadow
        />
      ))}

      {/* Sculpted High Backrest (+Z side) */}
      <group position={[0, 0.84, 0.21]} rotation={[0.1, 0, 0]}>
        <RoundedBox
          args={[0.46, 0.76, 0.075]}
          radius={0.03}
          smoothness={4}
          material={m.matteWhiteLacquer}
          castShadow
        />
        <RoundedBox
          args={[0.31, 0.16, 0.05]}
          radius={0.02}
          position={[0, -0.18, -0.042]}
          material={m.ivoryBoucle}
          castShadow
        />
        <RoundedBox
          args={[0.26, 0.14, 0.055]}
          radius={0.022}
          position={[0, 0.26, -0.042]}
          material={m.ivoryBoucle}
          castShadow
        />
        <mesh position={[0, 0.15, -0.04]} material={m.brushedSteel}>
          <boxGeometry args={[0.22, 0.022, 0.008]} />
        </mesh>
      </group>

      {/* Dual 4D White & Silver Armrests */}
      {[-0.275, 0.275].map((ax, idx) => (
        <group key={idx} position={[ax, 0.56, -0.02]}>
          <mesh position={[0, -0.05, 0]} material={m.brushedSteel} castShadow>
            <boxGeometry args={[0.025, 0.18, 0.035]} />
          </mesh>
          <RoundedBox
            args={[0.078, 0.028, 0.25]}
            radius={0.01}
            position={[0, 0.05, -0.02]}
            material={m.matteWhiteLacquer}
            castShadow
          />
        </group>
      ))}
    </group>
  );
};

/**
 * Architectural Luxury Bed Builder (3 Distinct Styles)
 * Local orientation: Headboard at -Z, Foot toward +Z
 */
export const LuxuryBedAssembly: React.FC<{
  variant: 'studio-king' | 'queen-upholstered' | 'japandi-oak';
}> = ({ variant }) => {
  const m = getApartmentMaterials();
  const isKing = variant === 'studio-king';
  const isJapandi = variant === 'japandi-oak';

  const bedW = isKing ? 2.1 : 1.76;
  const bedL = isKing ? 2.22 : 2.12;
  const frameMat = isJapandi ? m.oakVeneer : m.ivoryBoucle;
  const throwMat = isJapandi ? m.ivoryBoucle : m.warmBeigeFabric;

  return (
    <group>
      <mesh position={[0, 0.06, 0]} material={m.darkWalnutAccent} castShadow receiveShadow>
        <boxGeometry args={[bedW - 0.18, 0.12, bedL - 0.18]} />
      </mesh>

      {isKing && (
        <mesh position={[0, 0.11, 0]} material={m.warmLedEmissive}>
          <boxGeometry args={[bedW - 0.12, 0.015, bedL - 0.12]} />
        </mesh>
      )}

      <RoundedBox
        args={[bedW + (isJapandi ? 0.14 : 0.04), 0.18, bedL + (isJapandi ? 0.1 : 0.04)]}
        radius={0.025}
        smoothness={4}
        position={[0, 0.2, 0]}
        material={frameMat}
        castShadow
        receiveShadow
      />

      {isJapandi ? (
        <group position={[0, 0.56, -bedL / 2 + 0.06]}>
          <RoundedBox
            args={[bedW + 0.95, 0.78, 0.08]}
            radius={0.015}
            material={m.oakVeneer}
            castShadow
          />
          <RoundedBox
            args={[bedW - 0.08, 0.44, 0.06]}
            radius={0.02}
            position={[0, 0.02, 0.045]}
            material={m.ivoryBoucle}
            castShadow
          />
        </group>
      ) : (
        <group position={[0, 0.62, -bedL / 2 + 0.08]}>
          <RoundedBox
            args={[bedW + 0.08, 0.95, 0.13]}
            radius={0.035}
            smoothness={4}
            material={m.ivoryBoucle}
            castShadow
          />
          {isKing && (
            <mesh position={[0, 0.49, -0.02]} material={m.champagneBrass}>
              <boxGeometry args={[bedW + 0.06, 0.014, 0.08]} />
            </mesh>
          )}
        </group>
      )}

      <RoundedBox
        args={[bedW - 0.08, 0.24, bedL - 0.16]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.38, 0.04]}
        material={m.crispWhiteLinen}
        castShadow
        receiveShadow
      />

      <RoundedBox
        args={[bedW - 0.02, 0.16, bedL * 0.68]}
        radius={0.045}
        smoothness={4}
        position={[0, 0.46, 0.28]}
        material={m.crispWhiteLinen}
        castShadow
        receiveShadow
      />

      <RoundedBox
        args={[bedW + 0.01, 0.18, 0.48]}
        radius={0.03}
        smoothness={4}
        position={[0, 0.465, bedL / 2 - 0.3]}
        material={throwMat}
        castShadow
        receiveShadow
      />

      {[-bedW * 0.24, bedW * 0.24].map((px, i) => (
        <group key={i} position={[px, 0.56, -bedL / 2 + 0.36]}>
          <RoundedBox
            args={[bedW * 0.4, 0.16, 0.36]}
            radius={0.05}
            smoothness={4}
            rotation={[0.24, 0, 0]}
            material={m.crispWhiteLinen}
            castShadow
          />
          <RoundedBox
            args={[bedW * 0.32, 0.14, 0.24]}
            radius={0.04}
            smoothness={4}
            position={[0, -0.02, 0.2]}
            rotation={[0.15, 0, 0]}
            material={throwMat}
            castShadow
          />
        </group>
      ))}
    </group>
  );
};

export const NightstandWithLamp: React.FC<{
  variant: 'studio' | 'cylinder' | 'travertine';
}> = ({ variant }) => {
  const m = getApartmentMaterials();

  return (
    <group>
      {variant === 'studio' && (
        <>
          <RoundedBox
            args={[0.52, 0.44, 0.44]}
            radius={0.018}
            position={[0, 0.25, 0]}
            material={m.matteWhiteLacquer}
            castShadow
            receiveShadow
          />
          <mesh position={[0, 0.472, 0]} material={m.oakVeneer} castShadow>
            <boxGeometry args={[0.53, 0.02, 0.45]} />
          </mesh>
          <mesh position={[0, 0.32, 0.225]} material={m.champagneBrass}>
            <boxGeometry args={[0.18, 0.01, 0.014]} />
          </mesh>
        </>
      )}

      {variant === 'cylinder' && (
        <>
          <mesh position={[0, 0.24, 0]} material={m.matteWhiteLacquer} castShadow receiveShadow>
            <cylinderGeometry args={[0.23, 0.23, 0.48, 28]} />
          </mesh>
          <mesh position={[0, 0.485, 0]} material={m.oakVeneer} castShadow>
            <cylinderGeometry args={[0.235, 0.235, 0.018, 28]} />
          </mesh>
        </>
      )}

      {variant === 'travertine' && (
        <RoundedBox
          args={[0.48, 0.44, 0.42]}
          radius={0.014}
          position={[0, 0.22, 0]}
          material={m.travertineStone}
          castShadow
          receiveShadow
        />
      )}

      <group position={[0, variant === 'travertine' ? 0.44 : 0.49, 0]}>
        <mesh position={[0, 0.07, 0]} material={m.champagneBrass} castShadow>
          <cylinderGeometry args={[0.042, 0.062, 0.14, 20]} />
        </mesh>
        {variant === 'cylinder' ? (
          <mesh position={[0, 0.2, 0]} material={m.warmLedEmissive}>
            <sphereGeometry args={[0.095, 24, 24]} />
          </mesh>
        ) : (
          <mesh position={[0, 0.22, 0]} material={m.warmLedEmissive} castShadow>
            <cylinderGeometry args={[0.09, 0.135, 0.17, 24]} />
          </mesh>
        )}
      </group>
    </group>
  );
};

export const ArchitecturalWardrobe: React.FC<{
  width?: number;
  height?: number;
  depth?: number;
  variant: 'studio-showcase' | 'flush-white' | 'fluted-glass';
}> = ({ width = 2.2, height = 2.82, depth = 0.6, variant }) => {
  const m = getApartmentMaterials();
  const doorCount = 4;
  const doorW = (width - 0.06) / doorCount;

  return (
    <group>
      <mesh position={[0, height / 2, 0]} material={m.matteWhiteLacquer} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth - 0.04]} />
      </mesh>

      {Array.from({ length: doorCount }).map((_, idx) => {
        const xPos = -width / 2 + 0.03 + doorW / 2 + idx * doorW;
        const isGlassShowcase =
          (variant === 'studio-showcase' && idx === 3) ||
          (variant === 'fluted-glass' && (idx === 1 || idx === 2));

        return (
          <group key={idx} position={[xPos, height / 2, depth / 2 - 0.015]}>
            {isGlassShowcase ? (
              <>
                <mesh position={[0, 0, -0.14]} material={m.oakVeneer}>
                  <boxGeometry args={[doorW - 0.02, height - 0.12, 0.26]} />
                </mesh>
                <mesh position={[0, height / 2 - 0.1, -0.06]} material={m.warmLedEmissive}>
                  <boxGeometry args={[doorW - 0.06, 0.016, 0.02]} />
                </mesh>
                <mesh
                  position={[0, 0.55, -0.12]}
                  rotation={[0, 0, Math.PI / 2]}
                  material={m.champagneBrass}
                >
                  <cylinderGeometry args={[0.008, 0.008, doorW - 0.04, 12]} />
                </mesh>
                {[-0.1, 0.02, 0.13].map((gx, gi) => (
                  <RoundedBox
                    key={gi}
                    args={[0.075, 0.72, 0.22]}
                    radius={0.02}
                    position={[gx, 0.14, -0.12]}
                    material={gi % 2 === 0 ? m.crispWhiteLinen : m.warmBeigeFabric}
                  />
                ))}
                <mesh
                  material={
                    variant === 'fluted-glass' ? m.frostedFlutedGlass : m.temperedCaseGlass
                  }
                  renderOrder={3}
                >
                  <boxGeometry args={[doorW - 0.012, height - 0.06, 0.016]} />
                </mesh>
              </>
            ) : (
              <RoundedBox
                args={[doorW - 0.012, height - 0.05, 0.026]}
                radius={0.005}
                material={m.matteWhiteLacquer}
                castShadow
                receiveShadow
              />
            )}

            <mesh
              position={[idx % 2 === 0 ? doorW * 0.4 : -doorW * 0.4, -0.15, 0.022]}
              material={variant === 'flush-white' ? m.oakVeneer : m.champagneBrass}
            >
              <boxGeometry args={[0.016, 0.75, 0.018]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const FeatureMediaWallWithTV: React.FC<{
  screenVariant: 'studio' | 'living';
  consoleWidth?: number;
  backdropStone?: 'marble' | 'travertine';
}> = ({ screenVariant, consoleWidth = 2.5, backdropStone = 'marble' }) => {
  const m = getApartmentMaterials();
  const stoneMat = backdropStone === 'marble' ? m.calacattaMarble : m.travertineStone;
  const tvMat = screenVariant === 'studio' ? m.tvScreenStudio : m.tvScreenLiving;

  return (
    <group>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`slat-l-${i}`}
          position={[-consoleWidth / 2 + 0.06 + i * 0.048, 1.5, 0.025]}
          material={m.oakVeneer}
          castShadow
        >
          <boxGeometry args={[0.028, 2.92, 0.035]} />
        </mesh>
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={`slat-r-${i}`}
          position={[consoleWidth / 2 - 0.06 - i * 0.048, 1.5, 0.025]}
          material={m.oakVeneer}
          castShadow
        >
          <boxGeometry args={[0.028, 2.92, 0.035]} />
        </mesh>
      ))}

      <mesh position={[0, 1.5, 0.035]} material={stoneMat} receiveShadow>
        <boxGeometry args={[consoleWidth - 0.85, 2.92, 0.04]} />
      </mesh>

      <mesh position={[0, 1.52, 0.06]} material={m.warmLedEmissive}>
        <boxGeometry args={[1.72, 0.92, 0.01]} />
      </mesh>

      <group position={[0, 1.52, 0.088]}>
        <RoundedBox
          args={[1.92, 1.09, 0.026]}
          radius={0.006}
          material={m.matteBlackMetal}
          castShadow
        />
        <mesh position={[0, 0, 0.015]} material={tvMat}>
          <planeGeometry args={[1.88, 1.05]} />
        </mesh>
      </group>

      <group position={[0, 0.36, 0.24]}>
        <RoundedBox
          args={[consoleWidth, 0.34, 0.44]}
          radius={0.014}
          smoothness={3}
          material={m.matteWhiteLacquer}
          castShadow
          receiveShadow
        />
        <mesh position={[0, 0.175, 0]} material={stoneMat} castShadow>
          <boxGeometry args={[consoleWidth + 0.01, 0.02, 0.45]} />
        </mesh>
        {[-consoleWidth * 0.17, consoleWidth * 0.17].map((dx, idx) => (
          <mesh key={idx} position={[dx, 0, 0.222]} material={m.oakVeneer}>
            <boxGeometry args={[0.008, 0.3, 0.005]} />
          </mesh>
        ))}

        <mesh position={[-consoleWidth * 0.34, 0.28, 0]} material={m.travertineStone} castShadow>
          <cylinderGeometry args={[0.055, 0.075, 0.2, 20]} />
        </mesh>
        <RoundedBox
          args={[0.28, 0.032, 0.21]}
          radius={0.004}
          position={[consoleWidth * 0.32, 0.2, 0.02]}
          material={m.warmBeigeFabric}
          castShadow
        />
      </group>
    </group>
  );
};

export const SheerWindowCurtains: React.FC<{
  openingWidth: number;
  height?: number;
}> = ({ openingWidth, height = 2.85 }) => {
  const m = getApartmentMaterials();
  const panelWidth = 0.54;

  return (
    <group>
      <mesh position={[0, height + 0.04, 0]} material={m.satinWhiteAluminum}>
        <boxGeometry args={[openingWidth + 0.78, 0.028, 0.06]} />
      </mesh>

      {[-1, 1].map((dir) => {
        const baseCenter = dir * (openingWidth / 2 + 0.1);
        return (
          <group key={dir} position={[baseCenter, height / 2, 0]}>
            {Array.from({ length: 6 }).map((_, foldIdx) => {
              const offset = (foldIdx - 2.5) * (panelWidth / 6);
              return (
                <mesh
                  key={foldIdx}
                  position={[offset, 0, (foldIdx % 2 === 0 ? 1 : -1) * 0.02]}
                  material={m.sheerCurtain}
                >
                  <cylinderGeometry args={[0.046, 0.052, height, 14, 1, true, 0, Math.PI]} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

export const FramedWallArt: React.FC<{
  width?: number;
  height?: number;
  variant: 1 | 2 | 3;
}> = ({ width = 0.95, height = 1.25, variant }) => {
  const m = getApartmentMaterials();
  const canvasMat =
    variant === 1 ? m.artCanvas1 : variant === 2 ? m.artCanvas2 : m.artCanvas3;

  return (
    <group>
      <RoundedBox
        args={[width + 0.05, height + 0.05, 0.036]}
        radius={0.005}
        material={m.oakVeneer}
        castShadow
      />
      <mesh position={[0, 0, 0.02]} material={canvasMat}>
        <planeGeometry args={[width, height]} />
      </mesh>
    </group>
  );
};

export const IndoorDesignerPlant: React.FC<{
  scale?: number;
}> = ({ scale = 1 }) => {
  const m = getApartmentMaterials();

  const leafClusters: Array<[number, number, number, number]> = [
    [0, 1.35, 0, 0.28],
    [-0.18, 1.18, 0.14, 0.24],
    [0.2, 1.24, -0.12, 0.25],
    [0.14, 1.48, 0.15, 0.22],
    [-0.15, 1.52, -0.14, 0.21],
    [0, 1.66, 0.04, 0.2],
  ];

  return (
    <group scale={scale}>
      <mesh position={[0, 0.24, 0]} material={m.matteWhiteLacquer} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.19, 0.48, 28]} />
      </mesh>
      <mesh position={[0, 0.46, 0]} material={m.soilDark}>
        <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
      </mesh>
      <mesh position={[0, 0.88, 0]} rotation={[0.04, 0, -0.03]} material={m.darkWalnutAccent} castShadow>
        <cylinderGeometry args={[0.018, 0.032, 0.92, 12]} />
      </mesh>
      <mesh
        position={[-0.08, 1.1, 0.06]}
        rotation={[0.25, 0, 0.35]}
        material={m.darkWalnutAccent}
        castShadow
      >
        <cylinderGeometry args={[0.01, 0.016, 0.38, 10]} />
      </mesh>
      <mesh
        position={[0.09, 1.16, -0.05]}
        rotation={[-0.22, 0, -0.32]}
        material={m.darkWalnutAccent}
        castShadow
      >
        <cylinderGeometry args={[0.01, 0.016, 0.38, 10]} />
      </mesh>

      {leafClusters.map(([lx, ly, lz, rad], idx) => (
        <mesh
          key={idx}
          position={[lx, ly, lz]}
          scale={[1.15, 0.72, 1.15]}
          material={idx % 2 === 0 ? m.foliageOlive : m.foliageDeepGreen}
          castShadow
        >
          <icosahedronGeometry args={[rad, 2]} />
        </mesh>
      ))}
    </group>
  );
};

export const HaloCeilingFixture: React.FC<{
  outerRadius?: number;
  dropHeight?: number;
}> = ({ outerRadius = 0.58, dropHeight = 2.75 }) => {
  const m = getApartmentMaterials();

  return (
    <group position={[0, dropHeight, 0]}>
      <mesh position={[0, 0.32, 0]} material={m.matteWhiteLacquer}>
        <cylinderGeometry args={[0.11, 0.11, 0.04, 24]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={m.satinWhiteAluminum} castShadow>
        <torusGeometry args={[outerRadius, 0.022, 16, 48]} />
      </mesh>
      <mesh position={[0, -0.016, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.warmLedEmissive}>
        <torusGeometry args={[outerRadius, 0.014, 12, 48]} />
      </mesh>
      <mesh
        position={[0.06, -0.08, 0.04]}
        rotation={[Math.PI / 2 + 0.08, 0.06, 0]}
        material={m.warmLedEmissive}
      >
        <torusGeometry args={[outerRadius * 0.62, 0.015, 12, 40]} />
      </mesh>
    </group>
  );
};
