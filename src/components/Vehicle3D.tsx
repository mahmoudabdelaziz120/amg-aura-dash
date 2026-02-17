import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface VehicleProps {
  healthScore: number;
  speed: number;
  engineLoad: number;
}

function getHealthColor(score: number): [number, number, number] {
  if (score > 70) return [0.1, 1, 0.4];
  if (score > 40) return [1, 0.85, 0.1];
  return [1, 0.15, 0.1];
}

function getHaloAnimation(score: number): string {
  if (score > 70) return 'animate-halo-pulse';
  if (score > 40) return 'animate-halo-warning';
  return 'animate-halo-critical';
}

function CarBody({ healthScore, speed }: { healthScore: number; speed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const haloColor = useMemo(() => getHealthColor(healthScore), [healthScore]);
  const targetColor = useRef(new THREE.Color(...haloColor));

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      // Speed-based forward motion
      groupRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * (speed / 300) * 0.3;
    }
    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      targetColor.current.set(new THREE.Color(...getHealthColor(healthScore)));
      mat.color.lerp(targetColor.current, delta * 2);
      mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * (healthScore > 70 ? 1.5 : healthScore > 40 ? 3 : 6)) * 0.1;
    }
  });

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.05, 0.05, 0.08),
    metalness: 0.95,
    roughness: 0.15,
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.1, 0.15, 0.2),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.6,
    thickness: 0.5,
  }), []);

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.8, 0.85, 0.9),
    metalness: 0.9,
    roughness: 0.2,
  }), []);

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Main body - low sleek shape */}
      <mesh position={[0, 0.35, 0]} material={bodyMaterial}>
        <boxGeometry args={[2.4, 0.35, 5.2]} />
      </mesh>
      {/* Hood - front wedge */}
      <mesh position={[0, 0.45, -1.8]} rotation={[0.15, 0, 0]} material={bodyMaterial}>
        <boxGeometry args={[2.2, 0.15, 1.8]} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.7, -0.2]} material={glassMaterial}>
        <boxGeometry args={[1.8, 0.4, 1.8]} />
      </mesh>
      {/* Rear - slightly raised */}
      <mesh position={[0, 0.5, 1.6]} material={bodyMaterial}>
        <boxGeometry args={[2.3, 0.25, 1.5]} />
      </mesh>
      {/* Rear wing */}
      <mesh position={[0, 0.9, 2.2]} material={accentMaterial}>
        <boxGeometry args={[2.4, 0.04, 0.35]} />
      </mesh>
      {/* Wing supports */}
      <mesh position={[-0.7, 0.72, 2.1]} material={accentMaterial}>
        <boxGeometry args={[0.06, 0.35, 0.1]} />
      </mesh>
      <mesh position={[0.7, 0.72, 2.1]} material={accentMaterial}>
        <boxGeometry args={[0.06, 0.35, 0.1]} />
      </mesh>
      {/* Front splitter */}
      <mesh position={[0, 0.15, -2.7]} material={accentMaterial}>
        <boxGeometry args={[2.5, 0.04, 0.3]} />
      </mesh>
      {/* Side skirts */}
      <mesh position={[-1.25, 0.2, 0]} material={accentMaterial}>
        <boxGeometry args={[0.06, 0.1, 4.5]} />
      </mesh>
      <mesh position={[1.25, 0.2, 0]} material={accentMaterial}>
        <boxGeometry args={[0.06, 0.1, 4.5]} />
      </mesh>
      {/* Wheels */}
      {[[-0.95, 0.15, -1.5], [0.95, 0.15, -1.5], [-0.95, 0.15, 1.5], [0.95, 0.15, 1.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[-0.7, 0.4, -2.6]}>
        <boxGeometry args={[0.5, 0.08, 0.05]} />
        <meshStandardMaterial color="#66ccff" emissive="#66ccff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.7, 0.4, -2.6]}>
        <boxGeometry args={[0.5, 0.08, 0.05]} />
        <meshStandardMaterial color="#66ccff" emissive="#66ccff" emissiveIntensity={2} />
      </mesh>
      {/* Taillights */}
      <mesh position={[-0.8, 0.45, 2.6]}>
        <boxGeometry args={[0.6, 0.06, 0.05]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.8, 0.45, 2.6]}>
        <boxGeometry args={[0.6, 0.06, 0.05]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={2} />
      </mesh>

      {/* Health Halo */}
      <mesh ref={haloRef} position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.5, 64]} />
        <meshBasicMaterial color={new THREE.Color(...haloColor)} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        mirror={0.4}
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050510"
        metalness={0.5}
      />
    </mesh>
  );
}

export default function Vehicle3D({ healthScore, speed, engineLoad }: VehicleProps) {
  const haloClass = getHaloAnimation(healthScore);

  return (
    <div className={`relative w-full h-full min-h-[350px] rounded-lg overflow-hidden ${haloClass}`}>
      <Canvas
        camera={{ position: [5, 3, 7], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#030308', 10, 30]} />
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 8, 5]} intensity={0.5} color="#c0d0ff" />
        <pointLight position={[-3, 2, -3]} intensity={0.5} color="#3399ff" />
        <pointLight position={[3, 1, 3]} intensity={0.3} color="#ff3300" />
        <spotLight position={[0, 10, 0]} intensity={0.4} angle={0.3} penumbra={1} color="#ffffff" />

        <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
          <CarBody healthScore={healthScore} speed={speed} />
        </Float>

        <Floor />
        <Environment preset="night" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* Overlay gradient edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-background/50 to-transparent" />
      </div>
    </div>
  );
}
