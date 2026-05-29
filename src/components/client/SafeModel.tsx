import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react';

// Sin try/catch — solo usa el hook normalmente.
// Suspense y ErrorBoundary se encargan desde afuera.
export function SafeModel({ url }: { url: string }) {
  const gltf = useGLTF(url);
  
  // Clonar la escena para evitar problemas si el objeto es compartido
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  
  return <primitive object={scene} />;
}

// Preload opcional para mejorar rendimiento
SafeModel.preload = (url: string) => useGLTF.preload(url);
