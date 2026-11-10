import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const CHAMPAGNE = '#C6A879'
const MOCHA = '#49342E'
const COCOA = '#88685B'

/**
 * Shared warm-gold material tuned per the brand spec:
 * metalness 0.7, roughness 0.25, champagne tint with a subtle emissive glow.
 */
function useGoldMaterial(emissiveIntensity = 0.18) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CHAMPAGNE,
        metalness: 0.7,
        roughness: 0.25,
        emissive: new THREE.Color(CHAMPAGNE),
        emissiveIntensity,
        envMapIntensity: 1.2,
      }),
    [emissiveIntensity],
  )
}

/** A stylized 3D musical note: tilted ellipsoid head + stem + curved flag. */
function Note({ gold, simplified }) {
  const seg = simplified ? 16 : 32
  return (
    <group position={[0, -0.1, 0]}>
      {/* Note head — flattened, tilted sphere */}
      <mesh
        material={gold}
        position={[-0.42, -0.95, 0]}
        rotation={[0, 0, -0.5]}
        scale={[0.46, 0.3, 0.3]}
      >
        <sphereGeometry args={[1, seg, seg]} />
      </mesh>
      {/* Stem */}
      <mesh material={gold} position={[-0.04, 0.05, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 2.1, simplified ? 8 : 16]} />
      </mesh>
      {/* Flag — a quarter torus sweeping off the stem tip */}
      <mesh
        material={gold}
        position={[0.38, 1.02, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <torusGeometry args={[0.44, 0.07, simplified ? 8 : 14, seg, Math.PI * 0.85]} />
      </mesh>
    </group>
  )
}

/** Small floating accent notes orbiting the artifact. */
function OrbitingChords({ gold, simplified }) {
  const ref = useRef()
  const chords = useMemo(() => {
    const items = []
    const count = simplified ? 3 : 5
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      items.push({
        angle,
        radius: 2.5 + (i % 2) * 0.45,
        y: Math.sin(angle * 2) * 0.7,
        scale: 0.1 + (i % 3) * 0.035,
        speed: 0.25 + (i % 2) * 0.12,
      })
    }
    return items
  }, [simplified])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.children.forEach((child, i) => {
      const c = chords[i]
      const a = c.angle + t * c.speed
      child.position.set(
        Math.cos(a) * c.radius,
        c.y + Math.sin(t * 0.8 + i) * 0.25,
        Math.sin(a) * c.radius * 0.6,
      )
      child.rotation.x = t * 0.4 + i
      child.rotation.y = t * 0.3 + i
    })
  })

  return (
    <group ref={ref}>
      {chords.map((c, i) => (
        <mesh key={i} material={gold} scale={c.scale}>
          {i % 2 === 0 ? (
            <torusGeometry args={[1, 0.34, simplified ? 6 : 12, simplified ? 12 : 24]} />
          ) : (
            <icosahedronGeometry args={[1, 0]} />
          )}
        </mesh>
      ))}
    </group>
  )
}

/**
 * The hero artifact: a winding stave ribbon (torus knot) wrapped around a
 * golden 3D musical note, with orbiting chord accents. Fully procedural —
 * no external .gltf required.
 */
export default function EternotesArtifact({ simplified = false }) {
  const parallaxRef = useRef()
  const scrollRef = useRef()
  const ribbonRef = useRef()
  const gold = useGoldMaterial(0.18)
  const ribbonGold = useGoldMaterial(0.08)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // Slow idle spin on the ribbon so the knot always lives.
    if (ribbonRef.current) {
      ribbonRef.current.rotation.y = t * 0.12
      ribbonRef.current.rotation.z = Math.sin(t * 0.2) * 0.08
    }

    // Mouse parallax with damping — locked on touch devices.
    if (parallaxRef.current) {
      const targetX = simplified ? 0 : state.pointer.y * 0.22
      const targetY = simplified ? 0 : state.pointer.x * 0.35
      parallaxRef.current.rotation.x = THREE.MathUtils.damp(
        parallaxRef.current.rotation.x, -targetX, 3, delta,
      )
      parallaxRef.current.rotation.y = THREE.MathUtils.damp(
        parallaxRef.current.rotation.y, targetY, 3, delta,
      )
    }

    // Scroll-bound rotation: the artifact pivots as the hero scrolls away.
    if (scrollRef.current) {
      const progress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1)
      scrollRef.current.rotation.y = THREE.MathUtils.damp(
        scrollRef.current.rotation.y, progress * Math.PI * 0.9, 4, delta,
      )
      scrollRef.current.rotation.x = THREE.MathUtils.damp(
        scrollRef.current.rotation.x, progress * 0.35, 4, delta,
      )
    }
  })

  return (
    <group ref={scrollRef}>
      <group ref={parallaxRef}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9} floatingRange={[-0.25, 0.25]}>
          {/* Stave ribbon winding around the monogram */}
          <mesh ref={ribbonRef} material={ribbonGold} scale={1.55}>
            <torusKnotGeometry
              args={[1, 0.055, simplified ? 110 : 280, simplified ? 10 : 22, 2, 5]}
            />
          </mesh>
          <Note gold={gold} simplified={simplified} />
          <OrbitingChords gold={gold} simplified={simplified} />
        </Float>
      </group>

      {/* Three-point lighting: warm key, mocha rim, cocoa fill + ambient */}
      <ambientLight intensity={0.55} color="#fff6e8" />
      <directionalLight position={[4, 5, 6]} intensity={2.1} color="#ffe9c4" />
      <pointLight position={[-5, -2, -4]} intensity={14} color={MOCHA} />
      <pointLight position={[0, 4, -5]} intensity={10} color={COCOA} />
      <spotLight
        position={[0, 6, 4]}
        angle={0.5}
        penumbra={1}
        intensity={8}
        color="#f5e3c3"
      />
    </group>
  )
}
