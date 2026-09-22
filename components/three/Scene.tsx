'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NetworkMeshProps {
  count?: number;
  maxDistance?: number;
}

function NetworkMesh({ count = 90, maxDistance = 0.9 }: NetworkMeshProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // 1. Generišemo početne podatke samo jednom
  const initialData = useMemo(() => {
    const particleCount = count;
    const posArray = new Float32Array(particleCount * 3);
    const velArray = new Float32Array(particleCount * 3);
    const maxLines = (particleCount * (particleCount - 1)) / 2;
    const linesArray = new Float32Array(maxLines * 6);

    let seed = 123456789;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (random() - 0.5) * 4;
      posArray[i * 3 + 1] = (random() - 0.5) * 4;
      posArray[i * 3 + 2] = (random() - 0.5) * 4;

      velArray[i * 3] = (random() - 0.5) * 0.003;
      velArray[i * 3 + 1] = (random() - 0.5) * 0.003;
      velArray[i * 3 + 2] = (random() - 0.5) * 0.003;
    }

    return { pos: posArray, vel: velArray, linePositions: linesArray };
  }, [count]);

  // 2. Prebacujemo ih u useRef kako bismo dozvolili sigurnu mutaciju unutar useFrame
  const posRef = useRef(initialData.pos);
  const velRef = useRef(initialData.vel);
  const linePositionsRef = useRef(initialData.linePositions);

  // Sinhronizacija u slučaju da se props promijene
  useEffect(() => {
    posRef.current = initialData.pos;
    velRef.current = initialData.vel;
    linePositionsRef.current = initialData.linePositions;
  }, [initialData]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    // Izvlačimo vrijednosti iz .current za mutaciju (Linter se na ovo ne buni)
    const pos = posRef.current;
    const vel = velRef.current;
    const linePositions = linePositionsRef.current;

    for (let i = 0; i < count; i++) {
      pos[i * 3] += vel[i * 3];
      pos[i * 3 + 1] += vel[i * 3 + 1];
      pos[i * 3 + 2] += vel[i * 3 + 2];

      if (Math.abs(pos[i * 3]) > 2) vel[i * 3] *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 2) vel[i * 3 + 1] *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 2) vel[i * 3 + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    let vertexIdx = 0;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDistance * maxDistance) {
          linePositions[vertexIdx++] = pos[i * 3];
          linePositions[vertexIdx++] = pos[i * 3 + 1];
          linePositions[vertexIdx++] = pos[i * 3 + 2];

          linePositions[vertexIdx++] = pos[j * 3];
          linePositions[vertexIdx++] = pos[j * 3 + 1];
          linePositions[vertexIdx++] = pos[j * 3 + 2];
        }
      }
    }

    linesRef.current.geometry.setDrawRange(0, vertexIdx / 3);
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    const targetX = (mouse.current.y * Math.PI) / 6;
    const targetY = (mouse.current.x * Math.PI) / 6;

    pointsRef.current.rotation.x += 0.03 * (targetX - pointsRef.current.rotation.x);
    pointsRef.current.rotation.y += 0.03 * (targetY - pointsRef.current.rotation.y);
    linesRef.current.rotation.x = pointsRef.current.rotation.x;
    linesRef.current.rotation.y = pointsRef.current.rotation.y;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialData.pos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          transparent
          color="#00f0ff"
          size={0.035}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialData.linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          transparent
          color="#00f0ff"
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 2.2] }}>
        <NetworkMesh />
      </Canvas>
    </div>
  );
}