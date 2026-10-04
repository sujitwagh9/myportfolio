"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 900;
const LANES = 6;

/** Particles streaming left to right through six lanes: the six platform stages. */
function Stream({ accent, teal }: { accent: string; teal: string }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const a = new THREE.Color(accent);
    const b = new THREE.Color(teal);
    for (let i = 0; i < COUNT; i++) {
      const lane = i % LANES;
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (lane - (LANES - 1) / 2) * 0.55 + (Math.random() - 0.5) * 0.25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      speeds[i] = 0.4 + Math.random() * 0.9;
      const c = a.clone().lerp(b, lane / (LANES - 1));
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, colors, speeds };
  }, [accent, teal]);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      let x = arr[i * 3]! + speeds[i]! * delta;
      if (x > 6) x = -6;
      arr[i * 3] = x;
      arr[i * 3 + 2] = Math.sin(x * 0.8 + t * 0.5 + i) * 0.35;
    }
    attr.needsUpdate = true;
    pts.rotation.x = Math.sin(t * 0.15) * 0.08 - 0.25;
    pts.rotation.y = state.pointer.x * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function DataField({ accent, teal }: { accent: string; teal: string }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      aria-hidden
    >
      <Stream accent={accent} teal={teal} />
    </Canvas>
  );
}
