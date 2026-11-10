import { Suspense, lazy, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'

const EternotesArtifact = lazy(() => import('./EternotesArtifact.jsx'))

/** Elegant CSS skeleton shown while the 3D scene streams in. */
export function SceneSkeleton() {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      role="status"
      aria-label="Loading 3D scene"
    >
      <div className="skeleton-shimmer size-56 rounded-full opacity-70 sm:size-72" />
    </div>
  )
}

/** True when the device is a touchscreen / coarse pointer — used to simplify the scene. */
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)
    const onChange = (e) => setIsTouch(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isTouch
}

export default function HeroScene() {
  const isTouch = useIsTouchDevice()

  return (
    <Suspense fallback={<SceneSkeleton />}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
        aria-label="Interactive golden musical artifact"
      >
        <Suspense fallback={null}>
          <EternotesArtifact simplified={isTouch} />
        </Suspense>
      </Canvas>
    </Suspense>
  )
}
