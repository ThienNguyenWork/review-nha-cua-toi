import React, { Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {
  CutawayConfig,
  FurnitureItemInfo,
  LightingMood,
  QualityLevel,
  RoomId,
  ViewExperience,
} from '../../types/apartment';
import { getQualityConfig } from '../../utils/webglDetect';
import { ApartmentLayout } from './ApartmentLayout';
import { StudioRoom } from './StudioRoom';
import { BedroomTwo } from './BedroomTwo';
import { BedroomThree } from './BedroomThree';
import { LivingRoom } from './LivingRoom';
import { Kitchen } from './Kitchen';
import { Balcony } from './Balcony';

interface ApartmentSceneProps {
  quality: QualityLevel;
  lightingMood: LightingMood;
  viewExperience: ViewExperience;
  cutaway: CutawayConfig;
  selectedId: string | null;
  onSelectFurniture: (item: FurnitureItemInfo | null) => void;
  onFocusFurniture: (item: FurnitureItemInfo) => void;
  onSelectRoomFromDollhouse: (roomId: RoomId) => void;
}

const StudioEnvironmentRig: React.FC<{
  quality: QualityLevel;
  lightingMood: LightingMood;
}> = ({ quality, lightingMood }) => {
  const { gl, scene } = useThree();
  const qConfig = getQualityConfig(quality);

  useEffect(() => {
    RectAreaLightUniformsLib.init();
    const pmrem = new THREE.PMREMGenerator(gl);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmrem.dispose();

    return () => {
      envRT.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    const moodIntensity =
      lightingMood === 'daylight'
        ? 0.64
        : lightingMood === 'golden-hour'
          ? 0.54
          : 0.35;
    scene.environmentIntensity = moodIntensity * qConfig.envIntensityMultiplier;
  }, [scene, lightingMood, qConfig.envIntensityMultiplier]);

  const sunConfig = (() => {
    if (lightingMood === 'golden-hour') {
      return {
        sunColor: '#ffd29d',
        sunIntensity: 2.35,
        sunPos: [-12, 10.5, -18] as [number, number, number],
        hemiSky: '#ffe8cc',
        hemiGround: '#d8c5b0',
        hemiIntensity: 0.66,
        bg: '#f2e4d4',
        skySunPos: [-35, 9, -55] as [number, number, number],
      };
    }
    if (lightingMood === 'evening') {
      return {
        sunColor: '#93c5fd',
        sunIntensity: 0.45,
        sunPos: [-8, 14, -16] as [number, number, number],
        hemiSky: '#334155',
        hemiGround: '#1e293b',
        hemiIntensity: 0.38,
        bg: '#0f172a',
        skySunPos: [-20, -6, -50] as [number, number, number],
      };
    }
    return {
      sunColor: '#fffaf0',
      sunIntensity: 2.45,
      // Sunlight streaming diagonally from the Upper-Middle Balcony & North windows into Living Room & Bedrooms!
      sunPos: [-9, 16, -18] as [number, number, number],
      hemiSky: '#e8f3ff',
      hemiGround: '#dfd3c3',
      hemiIntensity: 0.8,
      bg: '#e6eff7',
      skySunPos: [-28, 28, -48] as [number, number, number],
    };
  })();

  const interiorPointIntensity = lightingMood === 'evening' ? 1.4 : 0.52;

  return (
    <>
      <color attach="background" args={[sunConfig.bg]} />
      <fog attach="fog" args={[sunConfig.bg, 28, 76]} />

      {lightingMood !== 'evening' && (
        <Sky
          distance={450}
          sunPosition={sunConfig.skySunPos}
          turbidity={lightingMood === 'golden-hour' ? 6.5 : 2.5}
          rayleigh={lightingMood === 'golden-hour' ? 2.2 : 0.8}
        />
      )}

      {/* 1. Primary Natural Daylight Sun Streaming from Upper Balcony & Windows */}
      <directionalLight
        position={sunConfig.sunPos}
        color={sunConfig.sunColor}
        intensity={sunConfig.sunIntensity}
        castShadow={qConfig.shadows}
        shadow-mapSize-width={qConfig.shadowMapSize}
        shadow-mapSize-height={qConfig.shadowMapSize}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-12.5}
        shadow-camera-right={12.5}
        shadow-camera-top={11.5}
        shadow-camera-bottom={-11.5}
        shadow-bias={-0.0004}
        shadow-normalBias={0.022}
      />

      {/* 2. Balanced Opposite Architectural Fill Light */}
      <directionalLight
        position={[12, 13, 15]}
        color="#dbeafe"
        intensity={lightingMood === 'evening' ? 0.22 : 0.72}
      />

      {/* 3. Sky-to-Oak Global Illumination Approximation */}
      <hemisphereLight
        args={[sunConfig.hemiSky, sunConfig.hemiGround, sunConfig.hemiIntensity]}
      />

      {/* 4. Upper-Middle Balcony & Studio Window Softbox Bounce Panels */}
      {qConfig.enableAreaLights && lightingMood !== 'evening' && (
        <>
          <rectAreaLight
            position={[0.2, 1.65, -4.3]}
            rotation={[0, Math.PI, 0]}
            width={5.2}
            height={2.5}
            color="#fff9f0"
            intensity={1.9}
          />
          <rectAreaLight
            position={[-6.05, 1.75, -6.4]}
            rotation={[0, Math.PI, 0]}
            width={3.8}
            height={1.9}
            color="#eff6ff"
            intensity={1.55}
          />
        </>
      )}

      {/* 5. Warm Interior Room Lighting */}
      {/* Studio (Upper-Left) */}
      <pointLight
        position={[-5.75, 2.65, -3.2]}
        color="#ffe8c2"
        intensity={interiorPointIntensity * 2.3}
        distance={9}
        decay={2}
      />
      {/* Bedroom 2 (Upper-Right) */}
      <pointLight
        position={[6.0, 2.65, -3.7]}
        color="#ffe8c2"
        intensity={interiorPointIntensity * 2.0}
        distance={8.5}
        decay={2}
      />
      {/* Bedroom 3 (Lower-Left) */}
      <pointLight
        position={[-5.85, 2.65, 3.25]}
        color="#ffe8c2"
        intensity={interiorPointIntensity * 2.0}
        distance={8.5}
        decay={2}
      />
      {/* Central Living Room */}
      <pointLight
        position={[0.45, 2.65, -2.1]}
        color="#ffe7bf"
        intensity={interiorPointIntensity * 2.4}
        distance={10}
        decay={2}
      />
      {/* Lower-Right Kitchen & Dining */}
      <pointLight
        position={[5.4, 2.6, 3.0]}
        color="#ffe8c4"
        intensity={interiorPointIntensity * 2.4}
        distance={10.5}
        decay={2}
      />
    </>
  );
};

export const ApartmentScene: React.FC<ApartmentSceneProps> = ({
  quality,
  lightingMood,
  viewExperience,
  cutaway,
  selectedId,
  onSelectFurniture,
  onFocusFurniture,
  onSelectRoomFromDollhouse,
}) => {
  return (
    <group
      onPointerMissed={(e) => {
        if (e.type === 'click') {
          onSelectFurniture(null);
        }
      }}
    >
      <StudioEnvironmentRig quality={quality} lightingMood={lightingMood} />

      <ApartmentLayout
        viewExperience={viewExperience}
        cutaway={cutaway}
        onSelectRoom={onSelectRoomFromDollhouse}
      />

      <Suspense fallback={null}>
        <StudioRoom
          selectedId={selectedId}
          onSelect={onSelectFurniture}
          onFocusObject={onFocusFurniture}
          quality={quality}
        />
        <Balcony
          selectedId={selectedId}
          onSelect={onSelectFurniture}
          onFocusObject={onFocusFurniture}
        />
        <BedroomTwo
          selectedId={selectedId}
          onSelect={onSelectFurniture}
          onFocusObject={onFocusFurniture}
        />
        <BedroomThree
          selectedId={selectedId}
          onSelect={onSelectFurniture}
          onFocusObject={onFocusFurniture}
        />
        <LivingRoom
          selectedId={selectedId}
          onSelect={onSelectFurniture}
          onFocusObject={onFocusFurniture}
        />
        <Kitchen
          selectedId={selectedId}
          onSelect={onSelectFurniture}
          onFocusObject={onFocusFurniture}
        />
      </Suspense>
    </group>
  );
};
