import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { isSoftwareGl } from '../../utils/webglDetect';

interface OrbitControlsWrapperProps {
  enabled: boolean;
  target: [number, number, number];
  isTransitioning: boolean;
  onUserInteract: () => void;
}

export const OrbitControls: React.FC<OrbitControlsWrapperProps> = ({
  enabled,
  target,
  isTransitioning,
  onUserInteract,
}) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    if (controlsRef.current && !isTransitioning) {
      controlsRef.current.target.set(target[0], target[1], target[2]);
      controlsRef.current.update();
    }
  }, [target, isTransitioning]);

  if (!enabled) return null;

  return (
    <DreiOrbitControls
      ref={controlsRef}
      makeDefault={false}
      enabled={enabled && !isTransitioning}
      enableDamping={!isSoftwareGl}
      dampingFactor={0.07}
      rotateSpeed={0.74}
      zoomSpeed={0.95}
      panSpeed={0.85}
      minDistance={0.26}
      maxDistance={28}
      maxPolarAngle={Math.PI * 0.495}
      onStart={onUserInteract}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
};
