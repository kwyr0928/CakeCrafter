"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { Suspense, useContext, useEffect, useRef } from "react";
import { ColorManagement, TextureLoader, Vector3, type Group } from "three";
import { Model } from "./components/Model";
import { MODELS, TITLE1, TITLE2 } from "./config/models";
import AudioContext from './context/AudioContext';

function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export default function Page() {
  const { isPlaying, playAudio, pauseAudio } = useContext(AudioContext);
  const router = useRouter();
  const initialAnimationDone = useRef(false);
  const startTime = useRef<number | null>(null);
  useEffect(() => {
    ColorManagement.enabled = true;
    if (startTime.current === null) {
      startTime.current = Date.now();
    }
  }, []);

  function SoundControl({ isPlaying, playAudio, pauseAudio }: { isPlaying: boolean; playAudio: () => void; pauseAudio: () => void; }) {
    const soundOnTexture = useLoader(TextureLoader, '/img/soundOn.png');
    const soundOffTexture = useLoader(TextureLoader, '/img/soundOff.png');
    
    return (
      <mesh onClick={isPlaying ? pauseAudio : playAudio} position={[5.8, 1.05, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        {isPlaying ? (
          <meshBasicMaterial map={soundOnTexture} />
        ) : (
          <meshBasicMaterial map={soundOffTexture} />
        )}
      </mesh>
    );
  }
  
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
      const radius = 16;
      camera.position.x = Math.cos(angle) * radius;
      camera.position.z = Math.sin(angle) * radius;
      camera.lookAt(new Vector3(0, 0, 0));
    });
    
    return null;
  }

  function TITLE1Group() {
    const groupRef = useRef<Group>(null);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.0005;
      }
    });

    return (
      <group ref={groupRef}>
        {Object.entries(TITLE1).map(([key, model]) => {
          const angle =
            (model.index / Object.keys(TITLE1).length) * Math.PI * 2;
          const radius = 10;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const rotationY = Math.atan2(z, x);
          return (
            <Model
              key={key}
              path={model.path}
              position={[model.defaultPosition[0] + x, model.defaultPosition[1] + 4, model.defaultPosition[2] + z]}
              scale={model.defaultScale}
              rotation={[0, -rotationY - Math.PI / 2, 0]}
            />
          );
        })}
      </group>
    );
  }

  function TITLE2Group() {
    const groupRef = useRef<Group>(null);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y -= 0.0005;
      }
    });

    return (
      <group ref={groupRef}>
        {Object.entries(TITLE2).map(([key, model]) => {
          const angle = (model.index / Object.keys(TITLE2).length) * Math.PI * 2;
          const radius = 10;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const rotationY = Math.atan2(z, x);
          return (
            <Model
              key={key}
              path={model.path}
              position={[x + model.defaultPosition[0], -6 + model.defaultPosition[1], z + model.defaultPosition[2]]}
              scale={model.defaultScale}
              rotation={[0, -rotationY - Math.PI / 2, 0]}
            />
          );
        })}
      </group>
    );
  }

  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 16], fov: 30 }}>
      <CameraController />
        <Environment
          preset="apartment"
          backgroundRotation={[0, 1.6, 0]}
          background
        />
        <Suspense fallback={null}>
          <Model
            path={MODELS.Title.path}
            position={MODELS.Title.defaultPosition}
            scale={MODELS.Title.defaultScale}
          />
          <TITLE1Group />
          <TITLE2Group />
          <mesh
            onClick={() => router.push("/select")}
            position={[0, -0.6, 0]}
          >
            <Model
            path={MODELS.Start.path}
            position={MODELS.Start.defaultPosition}
            scale={MODELS.Start.defaultScale}
          />
          </mesh>
          <SoundControl isPlaying={isPlaying} playAudio={playAudio} pauseAudio={pauseAudio} />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
