import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CenterStar = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const elapsedTime = clock.getElapsedTime();
    // Pulse scale calculation simulating deadline core gravity field
    const scaleFactor = 1.0 + Math.sin(elapsedTime * 2.5) * 0.06;
    meshRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial 
        color="#4FD1C5" 
        wireframe={false}
      />
      <pointLight distance={30} intensity={2.5} color="#4FD1C5" />
    </mesh>
  );
};
