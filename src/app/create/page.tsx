"use client";

import { Environment } from "@react-three/drei";
import { Canvas, useLoader, type ThreeEvent } from "@react-three/fiber";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { TextureLoader, type Group } from "three";
import { Model } from "../components/Model";
import {
  CAKES,
  CHRISTMAS,
  FOOD,
  HALLOWEEN,
  MAIN,
  MODELS,
  OTHER,
  PRESENT,
  RIBON,
  SPORTS,
} from "../config/models";
import AudioContext from "../context/AudioContext";

export default function Create() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}

function Page() {
  const { isPlaying, playAudio, pauseAudio } = useContext(AudioContext);
  const params = useSearchParams();
  const cakeParams = params.get("cake");
  const [cake, setCake] = useState(cakeParams);
  const [selectMode, setSelectMode] = useState<number>(0);
  const router = useRouter();
  const [cakeDecorations, setCakeDecorations] = useState<
    {
      path: string;
      position: number[];
      scale: number[];
      rotation?: number[];
      isSelected?: boolean;
    }[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<"move" | "rotate" | "scale">("move");
  const [isDragging, setIsDragging] = useState(false);
  const startPointerRef = useRef<{ x: number; y: number } | null>({
    x: 0,
    y: 0,
  });
  const [cakeRotation, setCakeRotation] = useState({ x: 0, y: 0, z: 0 });
  const [direction, setDirection] = useState(0);


  function ButtonControl({}) {
  const moveTexture = useLoader(TextureLoader, "/img/move.png");
  const rotateTexture = useLoader(TextureLoader, "/img/rotate.png");
  const scaleTexture = useLoader(TextureLoader, "/img/scale.png");
  const deleteTexture = useLoader(TextureLoader, "/img/delete.png");
  const leftTexture = useLoader(TextureLoader, "/img/leftArrow.png");
  const rightTexture = useLoader(TextureLoader, "/img/rightArrow.png");
    return (
<group>
    <mesh onClick={() => setEditMode("move")} position={[-17, -1, -10]}>
          <boxGeometry args={[1.5, 1.5, 0.1]} />
          <meshBasicMaterial map={moveTexture} />
          </mesh>
        <mesh position={[-17, -1, -10]}>
         <boxGeometry args={[1.7, 1.7, 0.09]} />
         {editMode === "move" ? (
         <meshStandardMaterial color="#da2d52" />
        ) : (
    <meshStandardMaterial color="#e29b00" />
        )}
      </mesh>
        <mesh
       onClick={() => setEditMode("rotate")}
     position={[-17, -3, -10]}
        >
      <boxGeometry args={[1.5, 1.5, 0.1]} />
      <meshBasicMaterial map={rotateTexture} />
        </mesh>
        <mesh position={[-17, -3, -10]}>
        <boxGeometry args={[1.7, 1.7, 0.09]} />
      {editMode === "rotate" ? (
    <meshStandardMaterial color="#da2d52" />
      ) : (
        <meshStandardMaterial color="#e29b00" />
       )}
        </mesh>
      <mesh
        onClick={() => setEditMode("scale")}
      position={[-17, -5, -10]}
      >
       <boxGeometry args={[1.5, 1.5, 0.1]} />
     <meshBasicMaterial map={scaleTexture} />
          </mesh>
      <mesh position={[-17, -5, -10]}>
        <boxGeometry args={[1.7, 1.7, 0.09]} />
      {editMode === "scale" ? (
        <meshStandardMaterial color="#da2d52" />
      ) : (
        <meshStandardMaterial color="#e29b00" />
      )}
        </mesh>
        <mesh
       onClick={() =>
    selectedIndex !== null && handleDelete(selectedIndex)
      }
       position={[-17, -7, -10]}
        >
     <boxGeometry args={[1.5, 1.5, 0.1]} />
        <meshBasicMaterial map={deleteTexture} />
          </mesh>
        <mesh position={[-17, -7, -10]}>
        <boxGeometry args={[1.7, 1.7, 0.09]} />
       <meshStandardMaterial color="#e29b00" />
        </mesh>
        <mesh
         position={[-8, -5, -10]}
       onClick={() => {
       setCakeRotation((prev) => ({
      x: prev.x,
      y: prev.y - Math.PI / 2,
      z: prev.z,
        }));
            setDirection((prev) => (prev - 1 + 4) % 4);
        }}
     >
        <boxGeometry args={[1.2, 1.2, 0.1]} />
        <meshBasicMaterial map={leftTexture} />
    </mesh>
<mesh position={[-8, -5, -10]}>
  <boxGeometry args={[1.3, 1.3, 0.09]} />
  <meshStandardMaterial color="#e29b00" />
</mesh>
<mesh
  position={[8, -5, -10]}
  onClick={() => {
    setCakeRotation((prev) => ({
      x: prev.x,
      y: prev.y + Math.PI / 2,
      z: prev.z,
    }));
    setDirection((prev) => (prev + 1) % 4);
  }}
>
  <boxGeometry args={[1.2, 1.2, 0.1]} />
  <meshBasicMaterial map={rightTexture} />
</mesh>
<mesh position={[8, -5, -10]}>
  <boxGeometry args={[1.3, 1.3, 0.09]} />
  <meshStandardMaterial color="#e29b00" />
</mesh></group>
);
}

  function ChangeControl({}) {
  const changeUpTexture = useLoader(TextureLoader, "/img/up.png");
  const changeDownTexture = useLoader(TextureLoader, "/img/down.png");
    return (
      <group>
        <mesh
          onClick={() => setSelectMode(selectMode === 0 ? 5 : selectMode - 1)}
         position={[17, 6, -10]}
          >
        <boxGeometry args={[1.2, 1.2, 0.1]} />
          <meshBasicMaterial map={changeUpTexture} />
          </mesh>
          <mesh position={[17, 6, -10]}>
            <boxGeometry args={[1.3, 1.3, 0.09]} />
          <meshStandardMaterial color="#e29b00" />
          </mesh>
        <mesh
         onClick={() => setSelectMode((selectMode + 1) % 6)}
          position={[17, 4, -10]}
          >
          <boxGeometry args={[1.2, 1.2, 0.1]} />
          <meshBasicMaterial map={changeDownTexture} />
          </mesh>
            <mesh position={[17, 4, -10]}>
          <boxGeometry args={[1.3, 1.3, 0.09]} />
          <meshStandardMaterial color="#e29b00" />
        </mesh>
      </group>
);
}

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

  useEffect(() => {
    if (cakeDecorations.length === 0) {
      return;
    }
    const data = {
      cake,
      decorations: cakeDecorations,
    };
    
    console.log(cakeDecorations);
    localStorage.setItem("cakeData", JSON.stringify(data));
  }, [cakeDecorations, cake]);

  useEffect(() => {
    const cakeData = localStorage.getItem("cakeData");
    if (cakeData) {
    const parsedCakeData = JSON.parse(cakeData) as { cake: string; decorations: { path: string; position: number[]; scale: number[]; rotation?: number[] }[] };
    setCake(parsedCakeData.cake);
    setCakeDecorations(parsedCakeData.decorations);
    }
  }, []);

  const handleCreate = () => {
    router.push("/share");
  };

  const addToCake = (path: string) => {
    setCakeDecorations((prev) => [
      ...prev,
      {
        path,
        position: [0, 0.3, 0],
        scale: [0.5, 0.5, 0.5],
        rotation: [0, 0, 0],
        isSelected: false,
      },
    ]);
  };

  const handleSelect = (index: number, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setSelectedIndex(index);
    setCakeDecorations((prev) =>
      prev.map((item, i) => ({
        ...item,
        isSelected: i === index,
      })),
    );
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>, index: number) => {
    if (!isDragging || selectedIndex !== index || !startPointerRef.current)
      return;

    const deltaX = e.clientX - startPointerRef.current.x;
    const deltaY = e.clientY - startPointerRef.current.y;

    // 現在のポインタ位置を更新
    startPointerRef.current = { x: e.clientX, y: e.clientY };

    if (editMode === "move") {
      setCakeDecorations((prev) =>
        prev.map((item, i) => {
          if (i !== index) return item;
          if (direction === 0) {
            return {
              ...item,
              position: [
                item.position[0] + deltaX * 0.01,
                item.position[1] - deltaY * 0.01,
                item.position[2],
              ],
            };
          } else if (direction === 1) {
            return {
              ...item,
              position: [
                item.position[0],
                item.position[1] - deltaY * 0.01,
                item.position[2] + deltaX * 0.01,
              ],
            };
          } else if (direction === 2) {
            return {
              ...item,
              position: [
                item.position[0] - deltaX * 0.01,
                item.position[1] - deltaY * 0.01,
                item.position[2],
              ],
            };
          } else if (direction === 3) {
            return {
              ...item,
              position: [
                item.position[0],
                item.position[1] - deltaY * 0.01,
                item.position[2] - deltaX * 0.01,
              ],
            };
          }
        }),
      );
    } else if (editMode === "rotate") {
      setCakeDecorations((prev) =>
        prev.map((item, i) => {
          if (i !== index) return item;
          return {
            ...item,
            rotation: [
              item.rotation[0] + deltaY * 0.01,
              item.rotation[1] + deltaX * 0.01,
              item.rotation[2],
            ],
          };
        }),
      );
    } else if (editMode === "scale") {
      setCakeDecorations((prev) =>
        prev.map((item, i) => {
          if (i !== index) return item;
          const scaleFactor = 1 + deltaY * 0.01;
          return {
            ...item,
            scale: item.scale.map((s) => s * scaleFactor) as number[],
          };
        }),
      );
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    startPointerRef.current = null;
  };

  const handleDelete = (index: number) => {
    setCakeDecorations((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndex(null);
    setIsDragging(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedIndex === null) return;

    switch (e.key) {
      case "m":
        setEditMode("move");
        break;
      case "r":
        setEditMode("rotate");
        break;
      case "s":
        setEditMode("scale");
        break;
      case "Delete":
      case "Backspace":
        handleDelete(selectedIndex);
        break;
      case "Escape":
        setSelectedIndex(null);
        setEditMode("move");
        setIsDragging(false);
        setCakeDecorations((prev) =>
          prev.map((item) => ({
            ...item,
            isSelected: false,
          })),
        );
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  function CHRISTMASGroup() {
    const groupRef = useRef<Group>(null);
    return (
      <group ref={groupRef}>
        {Object.entries(CHRISTMAS).map(([key, model]) => {
          const gridSize = 10;
          const spacing = 3;
          const col = model.index % gridSize;
          const row = Math.floor(model.index / gridSize);
          const x = col * spacing - (gridSize * spacing - spacing) / 2;
          const y = -row * spacing + (gridSize * spacing - spacing) / 4;
          const z = -10;
          return (
            <mesh
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                addToCake(model.path);
              }}
            >
              <Model
                path={model.path}
                position={[
                  model.defaultPosition[0] + x,
                  model.defaultPosition[1] + y - 1,
                  model.defaultPosition[2] + z,
                ]}
                scale={model.defaultScale}
                rotation={model.defaultRotation}
              />
            </mesh>
          );
        })}
      </group>
    );
  }

  function FOODGroup() {
    const groupRef = useRef<Group>(null);
    return (
      <group ref={groupRef}>
        {Object.entries(FOOD).map(([key, model]) => {
          const gridSize = 10;
          const spacing = 3;
          const col = model.index % gridSize;
          const row = Math.floor(model.index / gridSize);
          const x = col * spacing - (gridSize * spacing - spacing) / 2;
          const y = -row * spacing + (gridSize * spacing - spacing) / 4;
          const z = -10;
          return (
            <mesh
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                addToCake(model.path);
              }}
            >
              <Model
                path={model.path}
                position={[
                  model.defaultPosition[0] + x,
                  model.defaultPosition[1] + y - 1,
                  model.defaultPosition[2] + z,
                ]}
                scale={model.defaultScale}
                rotation={model.defaultRotation}
              />
            </mesh>
          );
        })}
      </group>
    );
  }

  function HALLOWEENGroup() {
    const groupRef = useRef<Group>(null);
    return (
      <group ref={groupRef}>
        {Object.entries(HALLOWEEN).map(([key, model]) => {
          const gridSize = 10;
          const spacing = 3;
          const col = model.index % gridSize;
          const row = Math.floor(model.index / gridSize);
          const x = col * spacing - (gridSize * spacing - spacing) / 2;
          const y = -row * spacing + (gridSize * spacing - spacing) / 4;
          const z = -10;
          return (
            <mesh
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                addToCake(model.path);
              }}
            >
              <Model
                path={model.path}
                position={[
                  model.defaultPosition[0] + x,
                  model.defaultPosition[1] + y - 1,
                  model.defaultPosition[2] + z,
                ]}
                scale={model.defaultScale}
                rotation={model.defaultRotation}
              />
            </mesh>
          );
        })}
        {Object.entries(OTHER).map(([key, model]) => {
          const gridSize = 10;
          const spacing = 3;
          const col = model.index % gridSize;
          const row = Math.floor(model.index / gridSize) + 1;
          const x = col * spacing - (gridSize * spacing - spacing) / 2;
          const y = -row * spacing + (gridSize * spacing - spacing) / 4;
          const z = -10;
          return (
            <mesh
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                addToCake(model.path);
              }}
            >
              <Model
                path={model.path}
                position={[
                  model.defaultPosition[0] + x,
                  model.defaultPosition[1] + y - 1,
                  model.defaultPosition[2] + z,
                ]}
                scale={model.defaultScale}
                rotation={model.defaultRotation}
              />
            </mesh>
          );
        })}
      </group>
    );
  }

  function PRESENTGroup() {
    const groupRef = useRef<Group>(null);
    return (
      <group ref={groupRef}>
        {Object.entries(PRESENT).map(([key, model]) => {
          const gridSize = 10;
          const spacing = 3;
          const col = model.index % gridSize;
          const row = Math.floor(model.index / gridSize);
          const x = col * spacing - (gridSize * spacing - spacing) / 2;
          const y = -row * spacing + (gridSize * spacing - spacing) / 4;
          const z = -10;
          return (
            <mesh
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                addToCake(model.path);
              }}
            >
              <Model
                path={model.path}
                position={[
                  model.defaultPosition[0] + x,
                  model.defaultPosition[1] + y - 1,
                  model.defaultPosition[2] + z,
                ]}
                scale={model.defaultScale}
                rotation={model.defaultRotation}
              />
            </mesh>
          );
        })}
        {Object.entries(RIBON).map(([key, model]) => {
          const gridSize = 10;
          const spacing = 3;
          const col = model.index % gridSize;
          const row = Math.floor(model.index / gridSize) + 1;
          const x = col * spacing - (gridSize * spacing - spacing) / 2;
          const y = -row * spacing + (gridSize * spacing - spacing) / 4;
          const z = -10;
          return (
            <mesh
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                addToCake(model.path);
              }}
            >
              <Model
                path={model.path}
                position={[
                  model.defaultPosition[0] + x,
                  model.defaultPosition[1] + y - 1,
                  model.defaultPosition[2] + z,
                ]}
                scale={model.defaultScale}
                rotation={model.defaultRotation}
              />
            </mesh>
          );
        })}
      </group>
    );
  }

  function SPORTSGroup() {
    const groupRef = useRef<Group>(null);
    return (
      <group ref={groupRef}>
        {Object.entries(SPORTS).map(([key, model]) => {
          const gridSize = 10;
          const spacing = 3;
          const col = model.index % gridSize;
          const row = Math.floor(model.index / gridSize);
          const x = col * spacing - (gridSize * spacing - spacing) / 2;
          const y = -row * spacing + (gridSize * spacing - spacing) / 4;
          const z = -10;
          return (
            <mesh
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                addToCake(model.path);
              }}
            >
              <Model
                path={model.path}
                position={[
                  model.defaultPosition[0] + x,
                  model.defaultPosition[1] + y - 1,
                  model.defaultPosition[2] + z,
                ]}
                scale={model.defaultScale}
                rotation={model.defaultRotation}
              />
            </mesh>
          );
        })}
      </group>
    );
  }

  function MAINGroup() {
    const groupRef = useRef<Group>(null);
    return (
      <group ref={groupRef}>
        {Object.entries(MAIN).map(([key, model]) => {
          const gridSize = 10;
          const spacing = 3;
          const col = model.index % gridSize;
          const row = Math.floor(model.index / gridSize);
          const x = col * spacing - (gridSize * spacing - spacing) / 2;
          const y = -row * spacing + (gridSize * spacing - spacing) / 4;
          const z = -10;
          return (
            <mesh
              key={key}
              onClick={(e) => {
                e.stopPropagation();
                addToCake(model.path);
              }}
            >
              <Model
                path={model.path}
                position={[
                  model.defaultPosition[0] + x,
                  model.defaultPosition[1] + y - 1,
                  model.defaultPosition[2] + z,
                ]}
                scale={model.defaultScale}
                rotation={model.defaultRotation}
              />
            </mesh>
          );
        })}
      </group>
    );
  }

  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Environment
          preset="apartment"
          backgroundRotation={[0, 1.6, 0]}
          background
        />
        <Suspense fallback={null}>
          <group rotation={[cakeRotation.x, cakeRotation.y, cakeRotation.z]}>
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
              <group
                key={index}
                onPointerDown={(e) => handleSelect(index, e)}
                onPointerMove={(e) => handlePointerMove(e, index)}
              >
                <Model
                  path={decoration.path}
                  position={decoration.position}
                  scale={decoration.scale}
                  rotation={decoration.rotation}
                />
              </group>
            ))}
          </group>
          {selectMode === 0 ? (
            <CHRISTMASGroup />
          ) : selectMode === 1 ? (
            <MAINGroup />
          ) : selectMode === 2 ? (
            <FOODGroup />
          ) : selectMode === 3 ? (
            <HALLOWEENGroup />
          ) : selectMode === 4 ? (
            <SPORTSGroup />
          ) : selectMode === 5 ? (
            <PRESENTGroup />
          ) : null}
          <mesh
            onClick={() => router.push("/select")}
            position={[-8.4, 3.8, 0]}
          >
            <Model
              path={MODELS.Arrow2.path}
              position={MODELS.Arrow2.defaultPosition}
              scale={MODELS.Arrow2.defaultScale}
            />
          </mesh>
          <mesh onClick={handleCreate} position={[15.8, -6.8, -10]}>
            <Model
              path={MODELS.Arrow1.path}
              position={MODELS.Arrow1.defaultPosition}
              scale={MODELS.Arrow1.defaultScale}
            />
          </mesh>
          <SoundControl isPlaying={isPlaying} playAudio={playAudio} pauseAudio={pauseAudio} />
          <ChangeControl />
          <ButtonControl />
        </Suspense>
      </Canvas>
    </div>
  );
}
