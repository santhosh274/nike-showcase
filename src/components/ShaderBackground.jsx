import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.12;
  
  vec2 q = vec2(0.0);
  q.x = fbm(uv + vec2(0.0, t * 0.2));
  q.y = fbm(uv + vec2(1.0));
  
  vec2 r = vec2(0.0);
  r.x = fbm(uv + q + vec2(1.7, 9.2) + t * 0.15);
  r.y = fbm(uv + q + vec2(8.3, 2.8) + t * 0.126);
  
  float f = fbm(uv + r);
  
  vec3 color1 = vec3(0.02, 0.01, 0.04);
  vec3 color2 = vec3(0.08, 0.03, 0.12);
  vec3 color3 = vec3(0.15, 0.05, 0.22);
  vec3 color4 = vec3(0.25, 0.08, 0.35);
  
  vec3 color = mix(color1, color2, f * f * f);
  color = mix(color, color3, clamp(f * f, 0.0, 1.0));
  color = mix(color, color4, clamp(length(q), 0.0, 1.0));
  
  float vignette = 1.0 - length((uv - 0.5) * 1.4);
  color *= clamp(vignette + 0.3, 0.0, 1.0);
  
  gl_FragColor = vec4(color, 1.0);
}
`

export default function ShaderBackground() {
  const mesh = useRef()
  const { viewport } = useThree()
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), [])
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.material.uniforms.uTime.value = clock.elapsedTime
    }
  })
  
  return (
    <mesh ref={mesh} position={[0, 0, -10]} renderOrder={-1000}>
      <planeGeometry args={[viewport.width * 3, viewport.height * 3]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}