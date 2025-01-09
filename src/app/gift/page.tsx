"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { type BufferGeometry, type Points, TextureLoader, Vector3 } from "three";
import { Model } from "../components/Model";
import {
  CAKES,
  MODELS
} from "../config/models";
import AudioContext from "../context/AudioContext";

function SparkleEffect() {
  const particlesCount = 100;
  const positions = new Float32Array(particlesCount * 3);
  const velocities = new Float32Array(particlesCount * 3);
  const pointsRef = useRef<Points>(null);
  const geometryRef = useRef<BufferGeometry>(null);
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = Math.random() * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  useFrame(() => {
    if (!geometryRef.current) return;
    const positions = geometryRef.current.attributes.position
      .array as Float32Array;
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];
      if (positions[i * 3 + 1] > 10) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
    }
    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export default function Page() {
  const router = useRouter();
  const initialAnimationDone = useRef(false);
  const startTime = useRef<number | null>(null);
  const { isPlaying, playAudio, pauseAudio } = useContext(AudioContext);
  const soundOnTexture = useLoader(TextureLoader, "/img/soundOn.png");
  const soundOffTexture = useLoader(TextureLoader, "/img/soundOff.png");
    const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const [cake, setCake] = useState<string>("Circle");
  const [cakeDecorations, setCakeDecorations] = useState<
    { path: string; position: number[]; scale: number[]; rotation?: number[] }[]
  >([]);

  function CameraController() {
      useFrame(({ camera }) => {
        if (initialAnimationDone.current || !startTime.current) return;
  
        const elapsedTime = (Date.now() - startTime.current) / 1000;
        const duration = 4;
        if (elapsedTime >= duration) {
          initialAnimationDone.current = true;
          return;
        }
        const progress = elapsedTime / duration;
        const easedProgress = easeInOutSine(progress);
        const angle = easedProgress * Math.PI * 2 + Math.PI / 2;
        const radius = 10;
        camera.position.x = Math.cos(angle) * radius;
        camera.position.z = Math.sin(angle) * radius;
        camera.lookAt(new Vector3(0, 0, 0));
      });
  
      return null;
    }

  useEffect(() => {
    if (startTime.current === null) {
      startTime.current = Date.now();
    }
    if (data) {
      try {
        const decodedState = JSON.parse(decodeURIComponent(data)) as {
          cake: string;
          decorations: { path: string; position: number[]; scale: number[]; rotation?: number[] }[];
        };
        console.log(decodedState);
        setCake(decodedState.cake);
        setCakeDecorations(decodedState.decorations);
      } catch (error) {
        console.error("デコード失敗", error);
      }
    }
  }, [data]);

  return (
    <div className="h-screen w-full">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <Environment
              preset="apartment"
              backgroundRotation={[0, 1.6, 0]}
              background
            />
            <Suspense fallback={null}>
              <SparkleEffect />
              <CameraController />
              <group position={[0, 1, 0]}>
                {cake === "Circle" ? (
                  <Model
                    path={CAKES.Circle.path}
                    position={CAKES.Circle.defaultPosition}
                    scale={CAKES.Circle.defaultScale}
                  />
                ) : cake === "Square" ? (
                  <Model
                    path={CAKES.Square.path}
                    position={CAKES.Square.defaultPosition}
                    scale={CAKES.Square.defaultScale}
                  />
                ) : cake === "Triangle" ? (
                  <Model
                    path={CAKES.Triangle.path}
                    position={CAKES.Triangle.defaultPosition}
                    scale={CAKES.Triangle.defaultScale}
                  />
                ) : null}
                {cakeDecorations.map((decoration, index) => (
                  <group key={index}>
                    <Model
                      path={decoration.path}
                      position={decoration.position}
                      scale={decoration.scale}
                      rotation={decoration.rotation}
                    />
                  </group>
                ))}
              </group>
              <Model
                path={MODELS.Desk2.path}
                position={MODELS.Desk2.defaultPosition}
                scale={MODELS.Desk2.defaultScale}
                rotation={[0, 0, 0]}
              />
              <mesh
                onClick={() => router.push(`/`)}
                position={[-17, 7.5, -10]}
              >
                <Model
                  path={MODELS.Arrow2.path}
                  position={MODELS.Arrow2.defaultPosition}
                  scale={MODELS.Arrow2.defaultScale}
                />
              </mesh>
              <mesh
                onClick={isPlaying ? pauseAudio : playAudio}
                position={[-8.5, 2.8, 0]}
              >
                <boxGeometry args={[0.6, 0.6, 0.1]} />
                {isPlaying ? (
                  <meshBasicMaterial map={soundOnTexture} />
                ) : (
                  <meshBasicMaterial map={soundOffTexture} />
                )}
              </mesh>
              <OrbitControls />
            </Suspense>
          </Canvas>
        </div>
  );
}
