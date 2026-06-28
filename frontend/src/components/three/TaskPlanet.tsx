import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Task } from '../../types';

interface TaskPlanetProps {
  task: Task;
  orbitRadius: number;
  orbitSpeed: number;
  angleOffset: number;
  color: string;
  size: number;
  isSelected: boolean;
  onSelect: () => void;
}

export const TaskPlanet = ({
  task,
  orbitRadius,
  orbitSpeed,
  angleOffset,
  color,
  size,
  isSelected,
  onSelect
}: TaskPlanetProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Deterministic orbital coordinate inclination plane offset
  const planeTilt = (task.title.length % 5) * 0.08 - 0.16;

  useFrame(({ clock }) => {
    if (!groupRef.current || !planetRef.current) return;
    const elapsed = clock.getElapsedTime();
    const currentAngle = angleOffset + elapsed * orbitSpeed;

    // Standard high-efficiency coordinate projection logic avoiding full matrix operations
    const x = Math.cos(currentAngle) * orbitRadius;
    const z = Math.sin(currentAngle) * orbitRadius;
    const y = Math.sin(currentAngle) * orbitRadius * Math.sin(planeTilt);

    planetRef.current.position.set(x, y, z);
    planetRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={groupRef}>
      {/* Orbit Track Mapping Overlay */}
      <mesh rotation={[Math.PI / 2 + planeTilt, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.01, orbitRadius + 0.01, 64]} />
        <meshBasicMaterial 
          color={isSelected ? "#4FD1C5" : color} 
          opacity={isSelected ? 0.35 : 0.08} 
          transparent 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Actual Task Node Mesh Sphere */}
      <mesh
        ref={planetRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 1.5 : 0.4}
          roughness={0.2}
        />

        {/* Selected Accent Rings (Gravitational Vector representation) */}
        {isSelected && (
          <mesh>
            <torusGeometry args={[size * 1.5, 0.02, 8, 32]} />
            <meshBasicMaterial color="#4FD1C5" transparent opacity={0.8} />
          </mesh>
        )}

        {/* Telemetry HTML tags projected inside WebGL scene layout */}
        {(hovered || isSelected) && (
          <Html distanceFactor={8} zIndexRange={[100, 0]}>
            <div className={`px-2 py-1 bg-space-800 border ${isSelected ? 'border-nova-glow' : 'border-space-700'} text-xs rounded font-mono whitespace-nowrap pointer-events-none transition-all duration-150`}>
              <span className="text-nova-telemetry">[{task.priorityScore}]</span> {task.title}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
};
