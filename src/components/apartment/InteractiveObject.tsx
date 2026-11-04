import React, { ReactNode, useRef } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { FURNITURE_CATALOG } from '../../data/furnitureCatalog';
import { FurnitureItemInfo } from '../../types/apartment';

interface InteractiveObjectProps {
  furnitureId: string;
  selectedId: string | null;
  onSelect: (item: FurnitureItemInfo) => void;
  onDoubleClickFocus?: (item: FurnitureItemInfo) => void;
  position?: [number, number, number];
  rotation?: [number, number, number];
  children: ReactNode;
}

export const InteractiveObject: React.FC<InteractiveObjectProps> = ({
  furnitureId,
  selectedId,
  onSelect,
  onDoubleClickFocus,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  children,
}) => {
  const downPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isSelected = selectedId === furnitureId;

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    downPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    const dx = e.clientX - downPos.current.x;
    const dy = e.clientY - downPos.current.y;
    // Ignore camera drag gestures (> 5px pointer travel)
    if (dx * dx + dy * dy > 25) return;

    e.stopPropagation();
    const info = FURNITURE_CATALOG[furnitureId];
    if (info) {
      onSelect(info);
    }
  };

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const info = FURNITURE_CATALOG[furnitureId];
    if (info && onDoubleClickFocus) {
      onDoubleClickFocus(info);
    }
  };

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {children}
      {isSelected && (
        <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.43, 48]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.85} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};
