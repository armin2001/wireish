'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

function ParticleCloud() {
  const ref = useRef<THREE.Points>(null);
  
  const sphere = useMemo(() => random.inSphere(new Float32Array(1500), { radius: 1.5 }), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere as Float32Array} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8B5CF6"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleCloud />
      </Canvas>
    </div>
  );
}