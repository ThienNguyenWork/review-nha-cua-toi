import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraMode, CameraTransitionRequest } from '../../types/apartment';
import { FreeFlyControls } from './FreeFlyControls';
import { FirstPersonControls } from './FirstPersonControls';
import { OrbitControls } from './OrbitControls';

export interface CameraTelemetry {
  x: number;
  y: number;
  z: number;
  yaw: number;
}

interface CameraControllerProps {
  mode: CameraMode;
  transition: CameraTransitionRequest | null;
  orbitTarget: [number, number, number];
  collisionEnabled: boolean;
  allowSpaceFlyUp: boolean;
  telemetryRef?: MutableRefObject<CameraTelemetry>;
  onTransitionComplete: (nextMode?: CameraMode) => void;
}

const _goalPos = new THREE.Vector3();
const _goalLook = new THREE.Vector3();
const _currLook = new THREE.Vector3();
const _dir = new THREE.Vector3();

export const CameraController: React.FC<CameraControllerProps> = ({
  mode,
  transition,
  orbitTarget,
  collisionEnabled,
  allowSpaceFlyUp,
  telemetryRef,
  onTransitionComplete,
}) => {
  const { camera } = useThree();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeTransitionRef = useRef<CameraTransitionRequest | null>(null);
  const transitionStartTime = useRef<number>(0);

  useEffect(() => {
    if (!transition) return;
    activeTransitionRef.current = transition;
    transitionStartTime.current = performance.now();
    _goalPos.set(...transition.position);
    _goalLook.set(...transition.target);

    // Initialize _currLook along current camera forward vector at matching distance
    camera.getWorldDirection(_dir);
    const dist = Math.max(1.5, camera.position.distanceTo(_goalLook));
    _currLook.copy(camera.position).addScaledVector(_dir, dist);
    setIsTransitioning(true);
  }, [transition, camera]);

  const handleUserInteract = useCallback(() => {
    if (!activeTransitionRef.current) return;
    // Allow immediate manual override after 160ms so camera never fights user input
    if (performance.now() - transitionStartTime.current > 160) {
      const nextMode = activeTransitionRef.current.switchMode;
      activeTransitionRef.current = null;
      setIsTransitioning(false);
      onTransitionComplete(nextMode);
    }
  }, [onTransitionComplete]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (activeTransitionRef.current) {
      const lambda = 4.6;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _goalPos.x, lambda, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _goalPos.y, lambda, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _goalPos.z, lambda, dt);

      _currLook.x = THREE.MathUtils.damp(_currLook.x, _goalLook.x, lambda * 1.15, dt);
      _currLook.y = THREE.MathUtils.damp(_currLook.y, _goalLook.y, lambda * 1.15, dt);
      _currLook.z = THREE.MathUtils.damp(_currLook.z, _goalLook.z, lambda * 1.15, dt);

      camera.lookAt(_currLook);

      if (
        camera.position.distanceTo(_goalPos) < 0.035 &&
        _currLook.distanceTo(_goalLook) < 0.035
      ) {
        camera.position.copy(_goalPos);
        camera.lookAt(_goalLook);
        const nextMode = activeTransitionRef.current.switchMode;
        activeTransitionRef.current = null;
        setIsTransitioning(false);
        onTransitionComplete(nextMode);
      }
    }

    if (telemetryRef) {
      camera.getWorldDirection(_dir);
      telemetryRef.current.x = camera.position.x;
      telemetryRef.current.y = camera.position.y;
      telemetryRef.current.z = camera.position.z;
      telemetryRef.current.yaw = Math.atan2(_dir.x, _dir.z);
    }
  });

  return (
    <>
      <FreeFlyControls
        enabled={mode === CameraMode.FreeFly && !isTransitioning}
        onUserInteract={handleUserInteract}
      />
      <FirstPersonControls
        enabled={mode === CameraMode.Walk}
        collisionEnabled={collisionEnabled}
        allowSpaceFlyUp={allowSpaceFlyUp}
        isTransitioning={isTransitioning}
        onUserInteract={handleUserInteract}
      />
      <OrbitControls
        enabled={mode === CameraMode.Orbit}
        target={orbitTarget}
        isTransitioning={isTransitioning}
        onUserInteract={handleUserInteract}
      />
    </>
  );
};
