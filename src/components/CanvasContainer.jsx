import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const cameraKeyframes = [
  { pos: [4, 4, 7], look: [0, -0.3, 0], shoeRotation: 0 },
  { pos: [-5, 1, -3], look: [0, 0, 0], shoeRotation: 0 },
  { pos: [0, -4, 5], look: [0, -0.5, 0], shoeRotation: 0 },
  { pos: [5, 2, 8], look: [0, 0, 0], shoeRotation: Math.PI * 2 },
  { pos: [0, 8, 8], look: [0, 0, 0], shoeRotation: Math.PI * 2 }
]

function JordanModel({ scrollProgress }) {
  const { scene } = useGLTF('/models/jordan_1.glb')
  const group = useRef()
  const { camera } = useThree()
  
  const targetPosition = useRef(new THREE.Vector3(4, 3, 5))
  const targetLookAt = useRef(new THREE.Vector3(0, -0.3, 0))
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

  return (
    <group ref={group}>
      <primitive 
        object={scene} 
        scale={0.2} 
        position={[0, 0, 0]} 
      />
    </group>
  )
}

function CinematicLighting({ theme }) {
  const isDark = theme === 'dark'
  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight position={[5, 5, 5]} angle={0.3} penumbra={0.5} intensity={1.5} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#ff2040" />
      <pointLight position={[3, 2, -2]} intensity={0.8} color="#8B5CF6" />
      <directionalLight position={[0, 5, 5]} intensity={0.5} />
    </>
  )
}

export default function CanvasContainer({ scrollProgress, theme }) {
  const bgColor = theme === 'dark' ? '#0a0a0a' : '#ffffff'
  const envPreset = theme === 'dark' ? 'studio' : 'warehouse'
  
  return (
    <div className="canvas-bg">
      <Canvas
        camera={{ position: [4, 3, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={[bgColor]} />
        
        <CinematicLighting theme={theme} />
        
        <Suspense fallback={null}>
          <JordanModel scrollProgress={scrollProgress} />
          <Environment preset={envPreset} />
          <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={8} blur={2} far={3} />
        </Suspense>
      </Canvas>
    </div>
  )
}