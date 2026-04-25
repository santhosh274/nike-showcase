import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, Float } from '@react-three/drei'
import JordanModel from './JordanModel'

function CinematicLighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <spotLight position={[8, 12, 8]} angle={0.15} penumbra={1} intensity={2} castShadow />
      <pointLight position={[-6, -2, 4]} intensity={1.2} color="#E4002B" />
      <pointLight position={[6, 2, -4]} intensity={0.8} color="#8B5CF6" />
      <directionalLight position={[0, 8, 5]} intensity={0.5} />
    </>
  )
}

export default function CanvasContainer({ scrollProgress }) {
  return (
    <div className="canvas-bg">
      <Canvas camera={{ position: [5, 2, 7], fov: 45 }} gl={{ antialias: true }} dpr={[1, 2]}>
        <color attach="background" args={['#050208']} />
        
        <CinematicLighting />
        
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <JordanModel scrollProgress={scrollProgress} />
          </Float>
          <Environment preset="city" />
          <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={12} blur={2} far={4} />
        </Suspense>
      </Canvas>
    </div>
  )
}