"use client";

import { Environment, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { Suspense, useContext, useRef } from "react";
import { TextureLoader } from "three";
import { Model } from "../components/Model";
import { CAKES, MODELS } from "../config/models";
import AudioContext from "../context/AudioContext";

const AnimatedArrow = ({ position, onClick, rotation }) => {
  const arrowRef = useRef();
  useFrame((state) => {
    if (arrowRef.current) {
      arrowRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={arrowRef} onClick={onClick} position={position}>
      <Model
        path={MODELS.Arrow1.path}
        position={MODELS.Arrow1.defaultPosition}
        scale={[0.16, 0.16, 0.16]}
        rotation={rotation || [0, 0, -Math.PI / 2]}
      />
    </mesh>
  );
};

export default function Page() {
  const router = useRouter();
  const { isPlaying, playAudio, pauseAudio } = useContext(AudioContext);
  const soundOnTexture = useLoader(TextureLoader, '/img/soundOn.png');
  const soundOffTexture = useLoader(TextureLoader, '/img/soundOff.png');
  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Environment
          preset="apartment"
          backgroundRotation={[0, 1.6, 0]}
          background
        />
        <Suspense fallback={null}>
        <Text
            position={[0, 2.5, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#573b00"
            fontStyle="italic"
            castShadow
          >
            Select your cake !
          </Text>
          <AnimatedArrow 
            position={[0, 0.7, 0]} 
            onClick={() => router.push("/create?cake=Circle")}
          />
          <mesh onClick={() => router.push("/create?cake=Circle")}>
            <Model
              path={CAKES.Circle.path}
              position={[0, -1, 0]}
              scale={[0.15, 0.15, 0.15]}
              rotation={[0.3, 0, 0]}
            />
          </mesh>
          <AnimatedArrow 
            position={[5, 0.7, 0]} 
            onClick={() => router.push("/create?cake=Square")}
          />
          <mesh onClick={() => router.push("/create?cake=Square")}>
          <Model
            path={CAKES.Square.path}
            position={[5, -1.2, 0]}
            scale={[0.15, 0.15, 0.15]}
            rotation={[0.3, 0, 0]}
          />
          </mesh>
          <AnimatedArrow 
            position={[-5, 0.7, 0]} 
            onClick={() => router.push("/create?cake=Triangle")}
          />
          <mesh onClick={() => router.push("/create?cake=Triangle")}>
          <Model
            path={CAKES.Triangle.path}
            position={[-5, -1.2, 0]}
            scale={[0.15, 0.15, 0.15]}
            rotation={[0.3, 0, 0]}
          />
          </mesh>
          <mesh
            onClick={() => router.push("/")}
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
          <OrbitControls/>
        </Suspense>
      </Canvas>
    </div>
  );
}
