import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;
      
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.1, 0.5, 0.5 + Math.random() * 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function Grid() {
  const ref = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = (state.clock.elapsedTime * 2) % 20 - 10;
    }
  });

  return (
    <gridHelper
      ref={ref}
      args={[100, 50, '#185FA5', '#185FA5']}
      position={[0, -5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

interface HeroScene3DProps {
  mouseX: number;
  mouseY: number;
}

export function HeroScene3D({ mouseX, mouseY }: HeroScene3DProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        className="opacity-60"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#185FA5" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0F6E56" />
        
        <StarField />
        <Grid />
        
        {/* Camera parallax based on mouse */}
        <group position={[mouseX * 2, -mouseY * 2, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
              color="#185FA5"
              emissive="#185FA5"
              emissiveIntensity={0.5}
              wireframe
            />
          </mesh>
        </group>
      </Canvas>
    </div>
  );
}
