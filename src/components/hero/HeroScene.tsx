"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";

type BagMeshProps = {
  src: string;
  mouseX: number;
  mouseY: number;
};

function BagMesh({ src, mouseX, mouseY }: BagMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(src);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouseX * 0.35,
      0.06
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -mouseY * 0.2,
      0.06
    );
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3.4, 3.4]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.01} />
    </mesh>
  );
}

type HeroSceneProps = {
  src: string;
  mouseX: number;
  mouseY: number;
};

export function HeroScene({ src, mouseX, mouseY }: HeroSceneProps) {
  return (
    <Canvas
      className="!h-full !w-full"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.1} />
      <pointLight position={[3, 2, 4]} intensity={1.8} color="#ffcd57" />
      <pointLight position={[-2, -1, 3]} intensity={0.4} color="#ffffff" />
      <BagMesh src={src} mouseX={mouseX} mouseY={mouseY} />
    </Canvas>
  );
}
