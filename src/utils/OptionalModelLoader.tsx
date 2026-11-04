import React, { Component, ReactNode, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function GLTFModelInner({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  url: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(url);
  return (
    <primitive
      object={scene.clone()}
      scale={scale}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
}

/**
 * Loads an external GLB/GLTF model from /assets/models/* when specified and available,
 * gracefully falling back to our detailed procedural 3D architectural assembly without crashing.
 */
export function OptionalModelLoader({
  modelUrl,
  fallback,
  scale,
  position,
  rotation,
}: {
  modelUrl?: string;
  fallback: ReactNode;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  if (!modelUrl) {
    return <>{fallback}</>;
  }

  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLTFModelInner url={modelUrl} scale={scale} position={position} rotation={rotation} />
      </Suspense>
    </ModelErrorBoundary>
  );
}
