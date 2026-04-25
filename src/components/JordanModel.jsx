import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const cameraKeyframes = [
  { pos: [5, 2, 7], look: [0, 0, 0], shoeRotation: 0 },
  { pos: [-6, 0, -1], look: [0, 0, 0], shoeRotation: 0 },
  { pos: [0, -6, 5], look: [0, -0.5, 0], shoeRotation: 0 },
  { pos: [6, 1, 9], look: [0, 0, 0], shoeRotation: Math.PI * 2 },
  { pos: [0, 10, 9], look: [0, 0, 0], shoeRotation: Math.PI * 2 }
]

export default function JordanModel({ scrollProgress }) {
  const { scene } = useGLTF('/models/jordan_1.glb')
  const group = useRef()
  const { camera } = useThree()
  
  const targetPosition = useRef(new THREE.Vector3(5, 2, 7))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const currentShoeRotation = useRef(0)
  
  useFrame(() => {
    const offset = scrollProgress || 0
    const segment = offset * (cameraKeyframes.length - 1)
    const index = Math.floor(segment)
    const fraction = segment - index
    
    const safeIndex = Math.min(index, cameraKeyframes.length - 1)
    const nextIndex = Math.min(index + 1, cameraKeyframes.length - 1)
    
    const startPos = cameraKeyframes[safeIndex].pos
    const endPos = cameraKeyframes[nextIndex].pos
    const currentPos = [
      THREE.MathUtils.lerp(startPos[0], endPos[0], fraction),
      THREE.MathUtils.lerp(startPos[1], endPos[1], fraction),
      THREE.MathUtils.lerp(startPos[2], endPos[2], fraction)
    ]
    
    const startLook = cameraKeyframes[safeIndex].look
    const endLook = cameraKeyframes[nextIndex].look
    const currentLook = [
      THREE.MathUtils.lerp(startLook[0], endLook[0], fraction),
      THREE.MathUtils.lerp(startLook[1], endLook[1], fraction),
      THREE.MathUtils.lerp(startLook[2], endLook[2], fraction)
    ]
    
    targetPosition.current.set(...currentPos)
    targetLookAt.current.set(...currentLook)
    
    camera.position.lerp(targetPosition.current, 0.08)
    camera.lookAt(targetLookAt.current)
    
    if (group.current) {
      const targetRotation = THREE.MathUtils.lerp(
        cameraKeyframes[safeIndex].shoeRotation,
        cameraKeyframes[nextIndex].shoeRotation,
        fraction
      )
      currentShoeRotation.current = THREE.MathUtils.lerp(
        currentShoeRotation.current,
        targetRotation,
        0.08
      )
      group.current.rotation.y = currentShoeRotation.current
    }
  })

  const clonedScene = useMemo(() => scene.clone(true), [scene])
  
  return (
    <group ref={group}>
      <primitive 
        object={clonedScene} 
        scale={0.2} 
        position={[0, -0.5, 0]} 
      />
    </group>
  )
}