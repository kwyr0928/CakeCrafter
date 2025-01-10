/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/models/cake/triangle1.glb 
*/

import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial } from 'three'

export function Triangle({ color, ...props }) {
  const { nodes, materials } = useGLTF('/models/cake/triangle1.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cream013.geometry} material={new MeshStandardMaterial({ color: color })} />
      <mesh geometry={nodes.Cream013_1.geometry} material={materials['2.006']} />
    </group>
  )
}

useGLTF.preload('models/cake/triangle1.glb')
