import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { resolveWalkCollision } from '../../data/collisions';

interface FirstPersonControlsProps {
  enabled: boolean;
  collisionEnabled: boolean;
  allowSpaceFlyUp: boolean;
  isTransitioning: boolean;
  onUserInteract: () => void;
}

const EYE_HEIGHT = 1.65;
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _moveDir = new THREE.Vector3();
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');

export const FirstPersonControls: React.FC<FirstPersonControlsProps> = ({
  enabled,
  collisionEnabled,
  allowSpaceFlyUp,
  isTransitioning,
  onUserInteract,
}) => {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const isDragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const yaw = useRef(0);
  const pitch = useRef(0);
  const velocity = useRef(new THREE.Vector3());

  const syncFromCamera = () => {
    _euler.setFromQuaternion(camera.quaternion, 'YXZ');
    yaw.current = _euler.y;
    pitch.current = THREE.MathUtils.clamp(_euler.x, -Math.PI * 0.42, Math.PI * 0.42);
  };

  useEffect(() => {
    if (enabled) {
      syncFromCamera();
      velocity.current.set(0, 0, 0);
      // If entering walk mode from exterior bird's-eye overview, bring inside central gallery
      if (
        camera.position.y > 3.2 ||
        camera.position.x < -8.8 ||
        camera.position.x > 8.8 ||
        camera.position.z < -6.3 ||
        camera.position.z > 7.3
      ) {
        camera.position.set(0.2, EYE_HEIGHT, 0.2);
        camera.lookAt(4.5, 1.5, 2.5);
        syncFromCamera();
      }
    }
  }, [enabled, camera]);

  useEffect(() => {
    if (!enabled) return;
    const dom = gl.domElement;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button === 0 || e.button === 2) {
        syncFromCamera();
        isDragging.current = true;
        lastPointer.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (document.pointerLockElement === dom) {
        onUserInteract();
        yaw.current -= e.movementX * 0.0022;
        pitch.current = THREE.MathUtils.clamp(
          pitch.current - e.movementY * 0.0022,
          -Math.PI * 0.44,
          Math.PI * 0.44,
        );
        _euler.set(pitch.current, yaw.current, 0, 'YXZ');
        camera.quaternion.setFromEuler(_euler);
        return;
      }

      if (!isDragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        onUserInteract();
      }

      yaw.current -= dx * 0.003;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current - dy * 0.003,
        -Math.PI * 0.44,
        Math.PI * 0.44,
      );
      _euler.set(pitch.current, yaw.current, 0, 'YXZ');
      camera.quaternion.setFromEuler(_euler);
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      keys.current[e.code] = true;

      if (e.code === 'KeyL') {
        if (document.pointerLockElement === dom) {
          document.exitPointerLock?.();
        } else {
          try {
            dom.requestPointerLock?.();
          } catch {
            // Pointer lock may be restricted in sandboxed iframes; drag-look remains active
          }
        }
      }

      if (
        ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
          e.code,
        )
      ) {
        onUserInteract();
        syncFromCamera();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    const handleBlur = () => {
      keys.current = {};
      isDragging.current = false;
    };

    dom.addEventListener('contextmenu', handleContextMenu);
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      dom.removeEventListener('contextmenu', handleContextMenu);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [enabled, camera, gl, onUserInteract]);

  useFrame((_, delta) => {
    if (!enabled || isTransitioning) return;
    const dt = Math.min(delta, 0.05);
    const k = keys.current;

    // Horizontal forward & right vectors in XZ plane
    camera.getWorldDirection(_forward);
    _forward.y = 0;
    if (_forward.lengthSq() > 0.0001) _forward.normalize();
    _right.crossVectors(_forward, _up).normalize();

    _moveDir.set(0, 0, 0);
    if (k['KeyW'] || k['ArrowUp']) _moveDir.add(_forward);
    if (k['KeyS'] || k['ArrowDown']) _moveDir.sub(_forward);
    if (k['KeyD'] || k['ArrowRight']) _moveDir.add(_right);
    if (k['KeyA'] || k['ArrowLeft']) _moveDir.sub(_right);

    if (_moveDir.lengthSq() > 0) {
      _moveDir.normalize();
    }

    const isFast = k['ShiftLeft'] || k['ShiftRight'];
    const walkSpeed = isFast ? 4.8 : 2.55;

    velocity.current.x = THREE.MathUtils.damp(
      velocity.current.x,
      _moveDir.x * walkSpeed,
      12,
      dt,
    );
    velocity.current.z = THREE.MathUtils.damp(
      velocity.current.z,
      _moveDir.z * walkSpeed,
      12,
      dt,
    );

    const nextX = camera.position.x + velocity.current.x * dt;
    const nextZ = camera.position.z + velocity.current.z * dt;

    if (collisionEnabled) {
      const [resX, resZ] = resolveWalkCollision(
        camera.position.x,
        camera.position.z,
        nextX,
        nextZ,
        0.28,
      );
      camera.position.x = resX;
      camera.position.z = resZ;
    } else {
      camera.position.x = THREE.MathUtils.clamp(nextX, -8.8, 8.8);
      camera.position.z = THREE.MathUtils.clamp(nextZ, -6.3, 7.3);
    }

    // Eye height handling + Space upward lift when enabled
    if (allowSpaceFlyUp && k['Space']) {
      camera.position.y = THREE.MathUtils.clamp(
        camera.position.y + 2.2 * dt,
        EYE_HEIGHT,
        2.82,
      );
    } else {
      camera.position.y = THREE.MathUtils.damp(camera.position.y, EYE_HEIGHT, 8, dt);
    }
  });

  return null;
};
