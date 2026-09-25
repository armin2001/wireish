'use client';

/*
 * The brand scene: customer channels wired into an AI agent core, which routes out to
 * your tools. Pulses travel along the wires like messages. Click a channel to send one.
 *
 * Memory: every geometry, material and texture created with `new` here is disposed in
 * the cleanup effect. Meshes that use them set dispose={null} so R3F doesn't free
 * shared resources on its own; JSX-declared geometries/materials are freed by R3F.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { BRAND, LOGO_GRADIENTS, type GradientStops } from '@/lib/brand';
import {
  coreFragment,
  coreVertex,
  particleFragment,
  particleVertex,
  wireFragment,
  wireVertex,
} from './shaders';

export type SceneVariant = 'hero' | 'ambient';

interface Endpoint {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  direction: 'in' | 'out';
  gradient: GradientStops;
}

const CORE_RADIUS = 0.62;
const ROUTE_GRADIENT: GradientStops = [BRAND.charge, BRAND.current, BRAND.beam];

const ENDPOINTS: Endpoint[] = [
  { id: 'website', label: 'Website chat', position: [-2.15, 1.05, 0.35], color: BRAND.signal, direction: 'in', gradient: LOGO_GRADIENTS.wire },
  { id: 'instagram', label: 'Instagram DMs', position: [-2.5, -0.15, 0.7], color: BRAND.ion, direction: 'in', gradient: LOGO_GRADIENTS.wire },
  { id: 'whatsapp', label: 'WhatsApp Business', position: [-1.75, -1.3, 0.25], color: BRAND.azure, direction: 'in', gradient: LOGO_GRADIENTS.wire },
  { id: 'knowledge', label: 'Knowledge base', position: [0.3, 1.9, -0.9], color: BRAND.spark, direction: 'in', gradient: LOGO_GRADIENTS.pulse },
  { id: 'crm', label: 'CRM', position: [2.1, 0.9, -0.25], color: BRAND.current, direction: 'out', gradient: ROUTE_GRADIENT },
  { id: 'team', label: 'Your team', position: [2.3, -0.65, 0.45], color: BRAND.pulse, direction: 'out', gradient: ROUTE_GRADIENT },
];

interface Wire {
  id: string;
  direction: 'in' | 'out';
  geometry: THREE.TubeGeometry;
  material: THREE.ShaderMaterial;
}

interface Resources {
  wires: Wire[];
  core: { geometry: THREE.SphereGeometry; material: THREE.ShaderMaterial };
  lattice: { geometry: THREE.WireframeGeometry; material: THREE.LineBasicMaterial };
  particles: { geometry: THREE.BufferGeometry; material: THREE.ShaderMaterial };
  floorTexture: THREE.CanvasTexture | null;
}

const color = (hex: string) => new THREE.Color(hex);

function createWires(variant: SceneVariant): Wire[] {
  return ENDPOINTS.map((ep, i) => {
    const node = new THREE.Vector3(...ep.position);
    const surface = node.clone().normalize().multiplyScalar(CORE_RADIUS + 0.02);
    const [start, end] = ep.direction === 'in' ? [node, surface] : [surface, node];
    const bow = new THREE.Vector3(0, 0.25 + (i % 2) * 0.2, 0.35);
    const curve = new THREE.CatmullRomCurve3([start, start.clone().lerp(end, 0.5).add(bow), end]);
    return {
      id: ep.id,
      direction: ep.direction,
      geometry: new THREE.TubeGeometry(curve, 96, 0.014, 8, false),
      material: new THREE.ShaderMaterial({
        vertexShader: wireVertex,
        fragmentShader: wireFragment,
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: 0.26 + (i % 3) * 0.05 },
          uOffset: { value: i * 0.23 },
          uBoost: { value: 0 },
          uIntensity: { value: variant === 'ambient' ? 0.7 : 1 },
          uColorA: { value: color(ep.gradient[0]) },
          uColorB: { value: color(ep.gradient[1]) },
          uColorC: { value: color(ep.gradient[2]) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    };
  });
}

function createParticles(count: number) {
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const palette = [BRAND.signal, BRAND.ion, BRAND.current, BRAND.charge, BRAND.spark].map(color);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const radius = 3 + rand() * 7;
    const theta = rand() * Math.PI * 2;
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = (rand() - 0.5) * 7;
    positions[i * 3 + 2] = Math.sin(theta) * radius * 0.6 - 4;
    const c = palette[Math.floor(rand() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    phases[i] = rand();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geometry.computeBoundingSphere();
  const material = new THREE.ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uSize: { value: 28 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  return { geometry, material };
}

/** Radial alpha falloff so the shadow-catching floor fades into the page. */
function createFloorTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

function createResources(variant: SceneVariant): Resources {
  const icosahedron = new THREE.IcosahedronGeometry(CORE_RADIUS * 0.66, 1);
  const latticeGeometry = new THREE.WireframeGeometry(icosahedron);
  icosahedron.dispose(); // only needed to build the wireframe

  return {
    wires: createWires(variant),
    core: {
      geometry: new THREE.SphereGeometry(CORE_RADIUS, 64, 64),
      material: new THREE.ShaderMaterial({
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uRadius: { value: CORE_RADIUS },
          uColorA: { value: color(BRAND.signal) },
          uColorB: { value: color(BRAND.charge) },
          uColorC: { value: color(BRAND.spark) },
        },
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    },
    lattice: {
      geometry: latticeGeometry,
      material: new THREE.LineBasicMaterial({
        color: BRAND.white,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    },
    particles: createParticles(variant === 'ambient' ? 600 : 1400),
    floorTexture: variant === 'hero' ? createFloorTexture() : null,
  };
}

function disposeResources(r: Resources) {
  for (const wire of r.wires) {
    wire.geometry.dispose();
    wire.material.dispose();
  }
  r.core.geometry.dispose();
  r.core.material.dispose();
  r.lattice.geometry.dispose();
  r.lattice.material.dispose();
  r.particles.geometry.dispose();
  r.particles.material.dispose();
  r.floorTexture?.dispose();
}

interface WireNetworkProps {
  variant: SceneVariant;
  reduceMotion: boolean;
}

export function WireNetwork({ variant, reduceMotion }: WireNetworkProps) {
  const interactive = variant === 'hero';
  const resources = useMemo(() => createResources(variant), [variant]);
  // Per-frame mutation goes through a ref (the React Compiler lint forbids mutating memo values).
  const res = useRef(resources);
  useEffect(() => {
    res.current = resources;
    return () => disposeResources(resources);
  }, [resources]);

  const viewport = useThree((s) => s.viewport);
  const invalidate = useThree((s) => s.invalidate);
  const sway = useRef<THREE.Group>(null);
  const coreMesh = useRef<THREE.Mesh>(null);
  const latticeMesh = useRef<THREE.LineSegments>(null);
  const pointerLight = useRef<THREE.PointLight>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const clock = useRef(0);
  const pulse = useRef(0);
  const pulseAt = useRef(0);
  const labelTimer = useRef<number | undefined>(undefined);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.clearTimeout(labelTimer.current);
      document.body.style.cursor = '';
    };
  }, []);

  // Keep the network in the right half on desktop, centred and smaller on phones.
  const layout = useMemo(() => {
    const span = 4.8; // horizontal extent of the network at scale 1
    if (variant === 'ambient') return { x: 0, y: 0, scale: Math.min(1.05, (viewport.width * 0.9) / span) };
    if (viewport.aspect >= 1.1) {
      return { x: viewport.width * 0.25, y: 0.05, scale: Math.min(1, (viewport.width * 0.5 - 0.3) / span) };
    }
    return { x: 0, y: -viewport.height * 0.22, scale: Math.min(0.7, (viewport.width - 0.2) / span) };
  }, [variant, viewport.width, viewport.height, viewport.aspect]);

  const fire = (id: string) => {
    const wire = res.current.wires.find((w) => w.id === id);
    if (wire) wire.material.uniforms.uBoost.value = 1;
    pulseAt.current = clock.current + 0.6; // when the message reaches the core
    setActive(id);
    window.clearTimeout(labelTimer.current);
    labelTimer.current = window.setTimeout(() => setActive(null), 1800);
    invalidate();
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30); // no jumps after the loop was paused
    if (!reduceMotion) clock.current += dt;
    const t = clock.current;
    const p = pointer.current;
    const r = res.current;

    const group = sway.current;
    if (group) {
      group.rotation.y = THREE.MathUtils.damp(group.rotation.y, p.x * 0.28, 3, dt);
      group.rotation.x = THREE.MathUtils.damp(group.rotation.x, -p.y * 0.12, 3, dt);
      group.position.y = Math.sin(t * 0.6) * 0.05;
    }

    pointerLight.current?.position.set(p.x * state.viewport.width * 0.5, p.y * state.viewport.height * 0.5, 2.4);

    for (const wire of r.wires) {
      const u = wire.material.uniforms;
      u.uTime.value = t;
      u.uBoost.value = THREE.MathUtils.damp(u.uBoost.value, 0, 1.4, dt);
    }

    if (pulseAt.current && t >= pulseAt.current) {
      pulseAt.current = 0;
      pulse.current = 1;
      // The agent answers: route the message out to the tools.
      for (const wire of r.wires) if (wire.direction === 'out') wire.material.uniforms.uBoost.value = 0.8;
    }
    pulse.current = THREE.MathUtils.damp(pulse.current, 0, 3, dt);
    r.core.material.uniforms.uTime.value = t;
    r.core.material.uniforms.uPulse.value = pulse.current;
    coreMesh.current?.scale.setScalar(1 + pulse.current * 0.08);
    if (latticeMesh.current) {
      latticeMesh.current.rotation.y = t * 0.25;
      latticeMesh.current.rotation.x = t * 0.12;
    }

    r.particles.material.uniforms.uTime.value = t;
    r.particles.material.uniforms.uPixelRatio.value = state.viewport.dpr;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[3, 6, 4]}
        intensity={2.2}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-radius={8}
        shadow-bias={-0.0005}
      />
      <pointLight ref={pointerLight} color={BRAND.signal} intensity={14} distance={8} decay={2} />
      <pointLight position={[-4, 2, -3]} color={BRAND.spark} intensity={30} distance={14} decay={2} />

      <points geometry={resources.particles.geometry} material={resources.particles.material} dispose={null} />

      <group position={[layout.x, layout.y, 0]} scale={layout.scale}>
        {resources.floorTexture && (
          <mesh rotation-x={-Math.PI / 2} position={[0, -2.05, 0]} receiveShadow>
            <circleGeometry args={[6.5, 64]} />
            <meshStandardMaterial
              color={BRAND.deep}
              roughness={0.85}
              metalness={0.2}
              transparent
              depthWrite={false}
              alphaMap={resources.floorTexture}
            />
          </mesh>
        )}

        <group ref={sway}>
          <mesh ref={coreMesh} castShadow geometry={resources.core.geometry} material={resources.core.material} dispose={null} />
          <lineSegments ref={latticeMesh} geometry={resources.lattice.geometry} material={resources.lattice.material} dispose={null} />

          {resources.wires.map((wire) => (
            <mesh key={wire.id} geometry={wire.geometry} material={wire.material} dispose={null} />
          ))}

          {ENDPOINTS.map((ep) => (
            <ChannelNode
              key={ep.id}
              endpoint={ep}
              interactive={interactive}
              highlighted={hovered === ep.id || active === ep.id}
              showLabel={interactive && (hovered === ep.id || active === ep.id)}
              onHover={(id) => {
                setHovered(id);
                document.body.style.cursor = id ? 'pointer' : '';
              }}
              onFire={fire}
            />
          ))}
        </group>
      </group>
    </>
  );
}

interface ChannelNodeProps {
  endpoint: Endpoint;
  interactive: boolean;
  highlighted: boolean;
  showLabel: boolean;
  onHover: (id: string | null) => void;
  onFire: (id: string) => void;
}

function ChannelNode({ endpoint, interactive, highlighted, showLabel, onHover, onFire }: ChannelNodeProps) {
  const scaleGroup = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const g = scaleGroup.current;
    if (g) g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, highlighted ? 1.35 : 1, 10, dt));
    if (ring.current) ring.current.rotation.z += dt * (highlighted ? 1.6 : 0.4);
  });

  const handlers = interactive
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(endpoint.id);
        },
        onPointerOut: () => onHover(null),
        onClick: (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onFire(endpoint.id);
        },
      }
    : {};

  return (
    <group position={endpoint.position}>
      <group ref={scaleGroup}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color={endpoint.color}
            emissive={endpoint.color}
            emissiveIntensity={highlighted ? 1.1 : 0.55}
            roughness={0.28}
            metalness={0.25}
          />
        </mesh>
        <mesh ref={ring} rotation-x={Math.PI / 2.4}>
          <torusGeometry args={[0.26, 0.006, 8, 64]} />
          <meshBasicMaterial color={endpoint.color} transparent opacity={highlighted ? 0.95 : 0.5} toneMapped={false} />
        </mesh>
        {/* Invisible, larger hit target so the node is easy to click. */}
        <mesh {...handlers}>
          <sphereGeometry args={[0.34, 12, 12]} />
          <meshBasicMaterial colorWrite={false} depthWrite={false} />
        </mesh>
      </group>
      {showLabel && (
        <Html center position={[0, 0.46, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <span className="glass-overlay whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium text-white">
            {endpoint.label}
          </span>
        </Html>
      )}
    </group>
  );
}
