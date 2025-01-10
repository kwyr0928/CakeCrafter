"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import {
  type BufferGeometry,
  type Points,
  TextureLoader,
  Vector3,
} from "three";
import { Circle } from "../components/Circle1";
import { Model } from "../components/Model";
import { Square } from "../components/Square1";
import { Triangle } from "../components/Triangle1";
import { CAKES, MODELS } from "../config/models";
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

const ScreenshotButton = () => {
  const cameraTexture = useLoader(TextureLoader, "/img/camera.png");
  const { gl, scene, camera } = useThree();
  const takeScreenshot = () => {
    gl.render(scene, camera);
    const imageData = gl.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "cake-capture.png";
    link.click();
  };
  return (
    <mesh onClick={takeScreenshot} position={[8.5, 3.7, 0]}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshBasicMaterial map={cameraTexture} />
    </mesh>
  );
};

function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export default function Page() {
  const router = useRouter();
  const [cake, setCake] = useState<string>("Circle");
  const [cakeDecorations, setCakeDecorations] = useState<
    { path: string; position: number[]; scale: number[]; rotation?: number[] }[]
  >([]);
  const initialAnimationDone = useRef(false);
  const startTime = useRef<number | null>(null);
  const { isPlaying, playAudio, pauseAudio } = useContext(AudioContext);
  const [selectedColor1, setSelectedColor1] = useState("#8B4513");
  const [selectedColor2, setSelectedColor2] = useState("#c2743d");

  function LinkControl({}) {
  const linkTexture = useLoader(TextureLoader, "/img/link.png");
    return (
  <mesh onClick={handleLink} position={[7, 3.7, 0]}>
  <boxGeometry args={[1, 1, 0.1]} />
  <meshBasicMaterial map={linkTexture} />
</mesh>
    )};
  
  function SoundControl({ isPlaying, playAudio, pauseAudio }: { isPlaying: boolean; playAudio: () => void; pauseAudio: () => void; }) {
    const soundOnTexture = useLoader(TextureLoader, '/img/soundOn.png');
    const soundOffTexture = useLoader(TextureLoader, '/img/soundOff.png');
  
    return (
      <mesh onClick={isPlaying ? pauseAudio : playAudio} position={[-8.5, 2.8, 0]}>
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
      const radius = 10;
      camera.position.x = Math.cos(angle) * radius;
      camera.position.z = Math.sin(angle) * radius;
      camera.lookAt(new Vector3(0, 0, 0));
    });

    return null;
  }

  const handleLink = () => {
    const data = {
      cake,
      selectedColor1,
      selectedColor2,
      decorations: cakeDecorations,
    };
    const encodedData = encodeURIComponent(JSON.stringify(data));
    const url = `${window.location.origin}/gift?data=${encodedData}`;
    navigator.clipboard.writeText(url)
    .then(() => {
      alert("共有リンクをコピーしました！誰かに共有しましょう！");
    })
    .catch((error) => {
      console.error("Failed to copy link: ", error);
      alert("Failed to copy the link. Please try again.");
    });

  console.log(url);
  };

  useEffect(() => {
    if (startTime.current === null) {
      startTime.current = Date.now();
    }
    const cakeData = localStorage.getItem("cakeData");
    if (cakeData) {
      const parsedCakeData = JSON.parse(cakeData) as {
        cake: string;
        selectedColor1: string;
        selectedColor2: string;
        decorations: {
          path: string;
          position: number[];
          scale: number[];
          rotation?: number[];
        }[];
      };
      setCake(parsedCakeData.cake);
      setSelectedColor1(parsedCakeData.selectedColor1);
      setSelectedColor2(parsedCakeData.selectedColor2);
      setCakeDecorations(parsedCakeData.decorations);
    }
  }, []);

  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Environment
          preset="apartment"
          backgroundRotation={[0, 1.6, 0]}
          background
        />
        <Suspense fallback={<mesh>
          <Model
                path={MODELS.Loading.path}
                position={MODELS.Loading.defaultPosition}
                scale={MODELS.Loading.defaultScale}
              />
        </mesh>}>
          <SparkleEffect />
          <CameraController />
          <group position={[0, 1, 0]}>
            {cake === "Circle" ? (
              <Circle
                position={CAKES.Circle.defaultPosition}
                scale={CAKES.Circle.defaultScale} color1={selectedColor1}  color2={selectedColor2}             />
            ) : cake === "Square" ? (
              <Square
                  position={CAKES.Square.defaultPosition}
                  scale={CAKES.Square.defaultScale} color1={selectedColor1} color2={selectedColor2}              />
            ) : cake === "Triangle" ? (
              <Triangle
                    position={CAKES.Triangle.defaultPosition}
                    scale={CAKES.Triangle.defaultScale} color1={selectedColor1} color2={selectedColor2}              />
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
            onClick={() => router.push(`/create?cake=${cake}`)}
            position={[-8.4, 3.8, 0]}
          >
            <Model
              path={MODELS.Arrow2.path}
              position={MODELS.Arrow2.defaultPosition}
              scale={MODELS.Arrow2.defaultScale}
            />
          </mesh>
          <LinkControl />
          <SoundControl isPlaying={isPlaying} playAudio={playAudio} pauseAudio={pauseAudio} />
          <ScreenshotButton />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
