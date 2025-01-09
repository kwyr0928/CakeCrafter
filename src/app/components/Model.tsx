"use client";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { type AnimationClip, type Group } from "three";

interface ModelProps {
  path: string;
  position?: number[];
  scale?: number[];
  rotation?: number[];
}

interface GLTFResult {
  scene: Group;
  animations: AnimationClip[];
}

export function Model({ path, position, scale, rotation }: ModelProps) {
  const { scene: originalScene, animations } = useGLTF(path) as GLTFResult;
  const scene = originalScene.clone(true);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const actionKey = Object.keys(actions)[0];
    if (actionKey && actions?.[actionKey]) {
      actions[actionKey].play();
    }
    return () => {
      Object.values(actions).forEach(action => {
        if (action) action.stop();
      });
    };
  }, [actions]);

  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />;
}
