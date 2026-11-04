import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface FreeFlyControlsProps {
  enabled: boolean;
  onUserInteract: () => void;
}

const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _moveDir = new THREE.Vector3();
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');

export const FreeFlyControls: React.FC<FreeFlyControlsProps> = ({
  enabled,
  onUserInteract,
}) => {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const dragMode = useRef<'none' | 'rotate' | 'pan'>('none');
  const lastPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const yaw = useRef(0);
  const pitch = useRef(0);
  const velocity = useRef(new THREE.Vector3());
  const freeLookActive = useRef(false);

  const syncAnglesFromCamera = () => {
    _euler.setFromQuaternion(camera.quaternion, 'YXZ');
    yaw.current = _euler.y;
    pitch.current = _euler.x;
  };

  useEffect(() => {
    if (enabled) {
      syncAnglesFromCamera();
      velocity.current.set(0, 0, 0);
    }
  }, [enabled, camera]);

  useEffect(() => {
    if (!enabled) return;
    const dom = gl.domElement;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handlePointerDown = (e: PointerEvent) => {
      syncAnglesFromCamera();
      lastPointer.current = { x: e.clientX, y: e.clientY };

      // Middle mouse drag (or Alt+Left / Shift+Right) pans camera like Blender
      if (
        e.button === 1 ||
        (e.button === 0 && e.altKey) ||
        (e.button === 2 && e.shiftKey)
      ) {
        dragMode.current = 'pan';
      } else if (e.button === 2 || e.button === 0) {
        // Right mouse drag (and Left mouse drag) rotates camera smoothly
        dragMode.current = 'rotate';
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (document.pointerLockElement === dom) {
        onUserInteract();
        yaw.current -= e.movementX * 0.0022;
        pitch.current = THREE.MathUtils.clamp(
          pitch.current - e.movementY * 0.0022,
          -Math.PI * 0.485,
          Math.PI * 0.485,
        );
        _euler.set(pitch.current, yaw.current, 0, 'YXZ');
        camera.quaternion.setFromEuler(_euler);
        return;
      }

      if (dragMode.current === 'none' && !freeLookActive.current) return;

      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        onUserInteract();
      }

      if (dragMode.current === 'rotate' || freeLookActive.current) {
        yaw.current -= dx * 0.0032;
        pitch.current = THREE.MathUtils.clamp(
          pitch.current - dy * 0.0032,
          -Math.PI * 0.485,
          Math.PI * 0.485,
        );
        _euler.set(pitch.current, yaw.current, 0, 'YXZ');
        camera.quaternion.setFromEuler(_euler);
      } else if (dragMode.current === 'pan') {
        camera.getWorldDirection(_forward);
        _right.crossVectors(_forward, _up).normalize();
        const camUp = _moveDir.crossVectors(_right, _forward).normalize();
        const panSpeed = 0.0115;
        camera.position.addScaledVector(_right, -dx * panSpeed);
        camera.position.addScaledVector(camUp, dy * panSpeed);
      }
    };

    const handlePointerUp = () => {
      dragMode.current = 'none';
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      onUserInteract();
      camera.getWorldDirection(_forward);
      const zoomStep = THREE.MathUtils.clamp(e.deltaY * -0.0045, -1.6, 1.6);
      camera.position.addScaledVector(_forward, zoomStep);
      camera.position.y = THREE.MathUtils.clamp(camera.position.y, 0.25, 26);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      keys.current[e.code] = true;

      if (e.code === 'KeyF') {
        if (document.pointerLockElement === dom) {
          document.exitPointerLock?.();
          freeLookActive.current = false;
        } else {
          try {
            dom.requestPointerLock?.();
          } catch {
            freeLookActive.current = !freeLookActive.current;
          }
        }
      }

      if (
        [
          'KeyW',
          'KeyA',
          'KeyS',
          'KeyD',
          'KeyQ',
          'KeyE',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
        ].includes(e.code)
      ) {
        onUserInteract();
        syncAnglesFromCamera();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    const handleBlur = () => {
      keys.current = {};
      dragMode.current = 'none';
      freeLookActive.current = false;
    };

    dom.addEventListener('contextmenu', handleContextMenu);
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      dom.removeEventListener('contextmenu', handleContextMenu);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [enabled, camera, gl, onUserInteract]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const dt = Math.min(delta, 0.05);
    const k = keys.current;

    _moveDir.set(0, 0, 0);
    camera.getWorldDirection(_forward);
    _right.crossVectors(_forward, _up).normalize();

    if (k['KeyW'] || k['ArrowUp']) _moveDir.add(_forward);
    if (k['KeyS'] || k['ArrowDown']) _moveDir.sub(_forward);
    if (k['KeyD'] || k['ArrowRight']) _moveDir.add(_right);
    if (k['KeyA'] || k['ArrowLeft']) _moveDir.sub(_right);
    if (k['KeyE'] || k['Space']) _moveDir.y += 1;
    if (k['KeyQ']) _moveDir.y -= 1;

    if (_moveDir.lengthSq() > 0) {
      _moveDir.normalize();
    }

    const sprint = k['ShiftLeft'] || k['ShiftRight'] ? 2.5 : 1.0;
    const baseSpeed = 4.2 * sprint;

    velocity.current.x = THREE.MathUtils.damp(
      velocity.current.x,
      _moveDir.x * baseSpeed,
      10,
      dt,
    );
    velocity.current.y = THREE.MathUtils.damp(
      velocity.current.y,
      _moveDir.y * baseSpeed,
      10,
      dt,
    );
    velocity.current.z = THREE.MathUtils.damp(
      velocity.current.z,
      _moveDir.z * baseSpeed,
      10,
      dt,
    );

    if (velocity.current.lengthSq() > 0.0001) {
      camera.position.addScaledVector(velocity.current, dt);
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -22, 22);
      camera.position.y = THREE.MathUtils.clamp(camera.position.y, 0.25, 25);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -20, 22);
    }
  });

  return null;
};
