/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/models/cake/square1.glb 
*/

import { useGLTF } from '@react-three/drei'
import { MeshStandardMaterial } from 'three'

export function Square({ color, ...props }) {
  const { nodes, materials } = useGLTF('/models/cake/square1.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[0, 0, Math.PI]}>
        <mesh geometry={nodes.Chocolate009.geometry} material={new MeshStandardMaterial({ color: color })} />
        <mesh geometry={nodes.Chocolate009_1.geometry} material={materials['3']} />
        <mesh geometry={nodes.Chocolate009_2.geometry} material={materials['2']} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/cake/square1.glb')