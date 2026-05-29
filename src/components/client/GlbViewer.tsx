import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Stage } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import * as THREE from 'three';
import { SafeModel } from './SafeModel';
import { ModelErrorFallback } from './ModelErrorFallback';

export default function GlbViewer({ url }: { url: string }) {
  if (!url) return <div className="w-full h-full flex items-center justify-center text-white text-xs">Sin archivo 3D</div>;

  return (
    // ErrorBoundary FUERA del Canvas → fallback es HTML puro, válido
    <ErrorBoundary FallbackComponent={ModelErrorFallback}>
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}  // fix PCFSoftShadowMap warning
        gl={{ antialias: true }}
      >
        {/* ErrorBoundary DENTRO del Canvas → fallback puede usar <Html> de drei */}
        <ErrorBoundary
          fallback={
            <Html center>
              <span style={{ color: 'red', background: '#000', padding: 8 }}>
                Modelo no disponible
              </span>
            </Html>
          }
          onError={(error) => console.error("Error en el Canvas:", error)}
        >
          <Suspense
            fallback={
              <Html center>
                <div className="text-white text-xs">Cargando 3D...</div>
              </Html>
            }
          >
            <Stage environment="studio" intensity={1.5} contactShadow={false}>
              <SafeModel url={url} />
            </Stage>
          </Suspense>
        </ErrorBoundary>

        <OrbitControls makeDefault />
        <ambientLight intensity={0.8} />
      </Canvas>
    </ErrorBoundary>
  );
}
