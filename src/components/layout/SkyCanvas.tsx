'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'
import * as SunCalc from 'suncalc'
import { getSkyTime, type SkyWeather } from '@/lib/sky'
import { useSky } from './WeatherSync'
import { Painterly, Terrain, TERRAIN_LANDSCAPES } from './SkyTerrain'

const DEG = Math.PI / 180
const FPS = 30
const CAMERA_FOV = 55
// 해(밤엔 달)가 화면 오른쪽 위에 오도록 카메라 기준 방위를 돌린다. 화면이 좁으면 안쪽으로 당긴다
const FOCUS_OFFSET = 36 * DEG
// 해가 낮으면 지평선의 노을을, 높으면 위쪽의 파란 하늘을 담도록 카메라를 든다
const CAMERA_PITCH_LOW = 15 * DEG
const CAMERA_PITCH_HIGH = 19 * DEG
const MOON_DISTANCE = 90

interface Preset {
  turbidity: number
  rayleigh: number
  mieCoefficient: number
  mieDirectionalG: number
}

// 날씨마다 대기 탁도를 바꾼다 (구름은 PaintedClouds가 그린다)
const PRESETS: Record<SkyWeather, Preset> = {
  clear: { turbidity: 2, rayleigh: 3.5, mieCoefficient: 0.002, mieDirectionalG: 0.95 },
  cloudy: { turbidity: 9, rayleigh: 2.4, mieCoefficient: 0.008, mieDirectionalG: 0.8 },
  fog: { turbidity: 12, rayleigh: 2, mieCoefficient: 0.012, mieDirectionalG: 0.75 },
  rain: { turbidity: 16, rayleigh: 2.5, mieCoefficient: 0.02, mieDirectionalG: 0.7 },
  snow: { turbidity: 14, rayleigh: 2.2, mieCoefficient: 0.015, mieDirectionalG: 0.7 },
  storm: { turbidity: 20, rayleigh: 3, mieCoefficient: 0.025, mieDirectionalG: 0.7 },
}

// 서버·클라이언트 모두 같은 배치가 나오도록 시드 고정 난수를 쓴다
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 높이 뜬 해·달은 화면 밖으로 나가므로 20° 위로는 고도를 눌러서 보여주고,
// 카메라가 보는 범위 위쪽 끝(max)을 넘지 않게 한다 (도 → 라디안)
function displayAltitude(degrees: number, max: number) {
  const compressed = degrees > 20 ? 20 + (degrees - 20) * 0.4 : degrees
  return Math.min(compressed, max) * DEG
}

// 두 방위의 차이를 -180°~180°로 맞춘다
function azimuthDelta(azimuth: number, from: number) {
  return ((((azimuth - from) % 360) + 540) % 360) - 180
}

// 고도·방위(오른쪽이 +) → 카메라 기준 좌표
function toVector(altitude: number, azimuth: number, distance: number) {
  return new THREE.Vector3(
    distance * Math.cos(altitude) * Math.sin(azimuth),
    distance * Math.sin(altitude),
    -distance * Math.cos(altitude) * Math.cos(azimuth),
  )
}

function useCanvasTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 256) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    draw(canvas.getContext('2d')!, size)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return { texture, url: canvas.toDataURL() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size])
}

// 격자 값 노이즈를 여러 옥타브 겹친 fBm. 구름 가장자리를 뭉게뭉게하게 만든다
function createFbm(seed: number) {
  const random = mulberry32(seed)
  const GRID = 64
  const values = Array.from({ length: GRID * GRID }, () => random())
  const at = (x: number, y: number) => values[(((y % GRID) + GRID) % GRID) * GRID + (((x % GRID) + GRID) % GRID)]
  const smooth = (t: number) => t * t * (3 - 2 * t)
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const tx = smooth(x - xi)
    const ty = smooth(y - yi)
    const top = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * tx
    const bottom = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * tx
    return top + (bottom - top) * ty
  }
  return (x: number, y: number) => {
    let sum = 0
    let amplitude = 0.5
    let frequency = 1
    for (let octave = 0; octave < 5; octave++) {
      sum += noise(x * frequency, y * frequency) * amplitude
      amplitude *= 0.5
      frequency *= 2
    }
    return sum
  }
}

// 달 표면: 밝은 회색 바탕에 바다(어두운 얼룩)와 크레이터를 흩뿌린다
function drawMoonSurface(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = '#d8d3c6'
  ctx.fillRect(0, 0, size, size)
  const random = mulberry32(11)
  for (let i = 0; i < 14; i++) {
    const x = random() * size
    const y = size * (0.25 + random() * 0.5)
    const r = size * (0.05 + random() * 0.12)
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, 'rgba(110,104,95,0.45)')
    gradient.addColorStop(1, 'rgba(110,104,95,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  for (let i = 0; i < 60; i++) {
    ctx.beginPath()
    ctx.arc(random() * size, random() * size, 1 + random() * 4, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(90,85,78,${0.15 + random() * 0.2})`
    ctx.fill()
  }
}

function drawGlow(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,250,230,0.9)')
  gradient.addColorStop(0.25, 'rgba(255,245,220,0.25)')
  gradient.addColorStop(1, 'rgba(255,245,220,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
}

function drawDrop(ctx: CanvasRenderingContext2D, size: number) {
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
}

// frameloop="demand"로 두고 30fps로만 다시 그려서 GPU·배터리를 아낀다
function FrameDriver({ onReady, pitch, exposure }: { onReady: () => void; pitch: number; exposure: number }) {
  const invalidate = useThree((state) => state.invalidate)
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const ready = useRef(false)

  useEffect(() => {
    const timer = window.setInterval(() => invalidate(), 1000 / FPS)
    return () => window.clearInterval(timer)
  }, [invalidate])

  useFrame(() => {
    // 시간대가 바뀌어 카메라 각도가 달라지면 부드럽게 따라간다
    const ease = ready.current ? 0.05 : 1
    camera.rotation.x += (pitch - camera.rotation.x) * ease
    gl.toneMappingExposure += (exposure - gl.toneMappingExposure) * ease
    camera.updateMatrixWorld()
    if (ready.current) return
    ready.current = true
    onReady()
  })
  return null
}

// 밤하늘을 대각선으로 가로지르는 은하수
function drawMilkyWay(ctx: CanvasRenderingContext2D, size: number) {
  const fbm = createFbm(19)
  const image = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const band = Math.exp(-(((y / size - 0.5) * 5) ** 2))
      const n = fbm((x / size) * 6, (y / size) * 6)
      const alpha = Math.max(0, band * (n - 0.25) * 1.6)
      const i = (y * size + x) * 4
      image.data[i] = 200
      image.data[i + 1] = 205
      image.data[i + 2] = 255
      image.data[i + 3] = Math.min(255, alpha * 255)
    }
  }
  ctx.putImageData(image, 0, 0)
}

function MilkyWay() {
  const band = useCanvasTexture(drawMilkyWay, 256)
  return (
    <mesh
      position={[-40, 160, -420]}
      rotation={[0, 0, -0.5]}
    >
      <planeGeometry args={[900, 360]} />
      <meshBasicMaterial
        map={band.texture}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  )
}

function Moon({ position, phase, southern, dim }: { position: THREE.Vector3; phase: number; southern: boolean; dim: boolean }) {
  const camera = useThree((state) => state.camera)
  const screenRef = useRef<THREE.Group>(null)
  const radialRef = useRef<THREE.Group>(null)
  const moonRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const surface = useCanvasTexture(drawMoonSurface)
  const glow = useCanvasTexture(drawGlow, 128)

  // 위상대로 빛이 들어오도록 달 기준으로 광원 방향을 잡는다 (북반구: 차오를 때 오른쪽이 밝다)
  const lightPosition = useMemo(() => {
    const toCamera = position.clone().negate().normalize()
    const right = new THREE.Vector3().crossVectors(position.clone().normalize(), new THREE.Vector3(0, 1, 0)).normalize()
    if (southern) right.negate()
    const angle = phase * Math.PI * 2
    const direction = right.multiplyScalar(Math.sin(angle)).add(toCamera.multiplyScalar(-Math.cos(angle)))
    return position.clone().add(direction.multiplyScalar(50))
  }, [position, phase, southern])

  useEffect(() => {
    if (lightRef.current && moonRef.current) lightRef.current.target = moonRef.current
  }, [])

  // 화면 가장자리에 있으면 원근 때문에 달이 타원으로 늘어난다.
  // 화면 기준으로 늘어나는 방향(중심→달)을 찾아 그만큼(cos θ) 눌러서 동그랗게 보이게 한다
  useFrame(() => {
    if (!screenRef.current || !radialRef.current) return
    const local = position.clone().applyMatrix4(camera.matrixWorldInverse)
    const offAxis = Math.atan2(Math.hypot(local.x, local.y), -local.z)
    screenRef.current.quaternion.copy(camera.quaternion)
    radialRef.current.rotation.z = Math.atan2(local.y, local.x)
    radialRef.current.scale.set(Math.cos(offAxis), 1, 1)
  })

  // 보름에 가까울수록 달무리가 밝다
  const glowOpacity = dim ? 0 : 0.08 + 0.2 * (1 - Math.abs(phase - 0.5) * 2)

  return (
    <group>
      <group
        ref={screenRef}
        position={position}
      >
        <group ref={radialRef}>
          <mesh ref={moonRef}>
            <sphereGeometry args={[3, 48, 48]} />
            {/* 하늘 노출을 낮춰도 달은 밝게 보이도록 톤 매핑에서 뺀다 */}
            <meshStandardMaterial
              map={surface.texture}
              roughness={1}
              metalness={0}
              transparent
              opacity={dim ? 0.5 : 1}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
      <directionalLight
        ref={lightRef}
        position={lightPosition}
        intensity={3}
      />
      <sprite
        position={position}
        scale={[14, 14, 1]}
      >
        <spriteMaterial
          map={glow.texture}
          transparent
          opacity={glowOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}

function Rain({ count, color }: { count: number; color: string }) {
  const positions = useMemo(() => {
    const random = mulberry32(3)
    const array = new Float32Array(count * 6)
    for (let i = 0; i < count; i++) {
      const x = (random() - 0.5) * 50
      const y = -14 + random() * 34
      const z = -6 - random() * 24
      array.set([x, y, z, x + 0.12, y + 0.9, z], i * 6)
    }
    return array
  }, [count])
  const geometryRef = useRef<THREE.BufferGeometry>(null)

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.1) * 26
    for (let i = 0; i < count; i++) {
      const o = i * 6
      positions[o] -= step * 0.12
      positions[o + 1] -= step
      if (positions[o + 1] < -14) {
        positions[o] += 2.5
        positions[o + 1] += 34
      }
      positions[o + 3] = positions[o] + 0.12
      positions[o + 4] = positions[o + 1] + 0.9
    }
    geometryRef.current!.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach='attributes-position'
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.45}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  )
}

function Snow({ count }: { count: number }) {
  const flake = useCanvasTexture(drawDrop, 32)
  const { positions, offsets } = useMemo(() => {
    const random = mulberry32(5)
    const positions = new Float32Array(count * 3)
    const offsets = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions.set([(random() - 0.5) * 50, -14 + random() * 34, -6 - random() * 24], i * 3)
      offsets[i] = random() * Math.PI * 2
    }
    return { positions, offsets }
  }, [count])
  const geometryRef = useRef<THREE.BufferGeometry>(null)

  useFrame(({ clock }, delta) => {
    const step = Math.min(delta, 0.1)
    for (let i = 0; i < count; i++) {
      const o = i * 3
      positions[o] += Math.sin(clock.elapsedTime * 0.6 + offsets[i]) * step * 0.6
      positions[o + 1] -= step * 1.6
      if (positions[o + 1] < -14) positions[o + 1] += 34
    }
    geometryRef.current!.attributes.position.needsUpdate = true
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach='attributes-position'
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={flake.texture}
        size={0.22}
        transparent
        opacity={0.9}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

function useClock(fixed: Date | null) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    if (fixed) return
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000)
    return () => window.clearInterval(timer)
  }, [fixed])
  return fixed ?? now
}

function Scene({ onReady }: { onReady: () => void }) {
  const sky = useSky()
  const size = useThree((state) => state.size)
  const date = useClock(sky.date)
  const preset = PRESETS[sky.weather]

  const view = useMemo(() => {
    const sun = SunCalc.getPosition(date, sky.latitude, sky.longitude)
    const moon = SunCalc.getMoonPosition(date, sky.latitude, sky.longitude)
    const { phase } = SunCalc.getMoonIllumination(date)
    // suncalc 2.x: 각도는 도 단위, 방위는 북쪽 0에서 시계방향 (바라볼 때 오른쪽이 +)
    const sunAltitude = sun.altitude
    // 낮·박명엔 해를, 밤엔 떠 있는 달을 화면에 담는다
    const focus = sunAltitude > -6 || moon.altitude <= 0 ? sun.azimuth : moon.azimuth
    const highSun = Math.min(Math.max((sunAltitude - 6) / 16, 0), 1)
    const pitch = CAMERA_PITCH_LOW + (CAMERA_PITCH_HIGH - CAMERA_PITCH_LOW) * highSun
    // 한낮 하늘은 매우 밝아서 노출을 더 낮춰야 파란색이 진하게 산다
    const exposure = 0.5 - 0.2 * highSun
    // 해·달이 화면 안에 온전히 들어오도록: 위로는 화면 위 끝 10° 아래까지, 옆으로는 가로 시야 안쪽
    const topEdge = pitch / DEG + CAMERA_FOV / 2 - 10
    const halfWidth = Math.atan(Math.tan((CAMERA_FOV / 2) * DEG) * (size.width / size.height))
    const focusOffset = Math.min(FOCUS_OFFSET, halfWidth - 8 * DEG)
    const relative = (azimuth: number) => azimuthDelta(azimuth, focus) * DEG + focusOffset


    return {
      pitch,
      exposure,
      sunAltitude,
      sunDirection: toVector(displayAltitude(sun.altitude, topEdge), relative(sun.azimuth), 1),
      moonPosition: toVector(displayAltitude(moon.altitude, topEdge), relative(moon.azimuth), MOON_DISTANCE),
      moonUp: moon.altitude > -3,
      phase,
    }
  }, [date, sky.latitude, sky.longitude, size.width, size.height])

  const isNight = view.sunAltitude < -6
  // 밤에는 대기 산란을 줄여야 하늘이 회색으로 뜨지 않는다
  const skyParams = isNight
    ? { turbidity: 1, rayleigh: 0.4, mieCoefficient: 0.002, mieDirectionalG: 0.8 }
    : preset
  const clearish = sky.weather === 'clear' || sky.weather === 'cloudy'
  // 지형 풍경은 3D 지형 + 회화풍 후처리로, 도시 풍경은 SVG(Landscape)로 그린다
  const showTerrain = TERRAIN_LANDSCAPES.includes(sky.landscape)
  const skyTime = getSkyTime(date, sky.latitude, sky.longitude)

  // 3D로 그리는 풍경을 알려서 같은 풍경의 SVG를 숨긴다 (Landscape의 [data-sky-terrain])
  useEffect(() => {
    const root = document.documentElement
    if (showTerrain) root.dataset.skyTerrain = sky.landscape
    else delete root.dataset.skyTerrain
    return () => {
      delete root.dataset.skyTerrain
    }
  }, [showTerrain, sky.landscape])

  return (
    <>
      {showTerrain && (
        <>
          <Terrain
            landscape={sky.landscape}
            time={skyTime}
            weather={sky.weather}
            sunDirection={view.sunDirection}
          />
          <Painterly />
        </>
      )}
      <FrameDriver
        onReady={onReady}
        pitch={view.pitch}
        exposure={view.exposure}
      />
      <ambientLight intensity={0.05} />
      <Sky
        distance={1000}
        sunPosition={view.sunDirection}
        turbidity={skyParams.turbidity}
        rayleigh={skyParams.rayleigh}
        mieCoefficient={skyParams.mieCoefficient}
        mieDirectionalG={skyParams.mieDirectionalG}
      />
      {view.sunAltitude < -4 && clearish && (
        <Stars
          radius={300}
          depth={80}
          count={sky.weather === 'clear' ? 5000 : 1500}
          factor={4}
          saturation={0}
          fade
          speed={0.4}
        />
      )}
      {isNight && sky.weather === 'clear' && <MilkyWay />}
      {view.moonUp && (
        <Moon
          position={view.moonPosition}
          phase={view.phase}
          southern={sky.latitude < 0}
          dim={!isNight || !clearish}
        />
      )}
      {(sky.weather === 'rain' || sky.weather === 'storm') && (
        <Rain
          count={sky.weather === 'storm' ? 1600 : 1000}
          color={isNight ? '#b8c4e0' : '#dfe6f0'}
        />
      )}
      {sky.weather === 'snow' && <Snow count={1400} />}
    </>
  )
}

export default function SkyCanvas({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      frameloop='demand'
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power' }}
      camera={{ fov: CAMERA_FOV, near: 0.1, far: 2000, position: [0, 0, 0] }}
      // ACES는 밝은 하늘의 채도를 많이 깎아서, 색조를 더 잘 지키는 Neutral 톤 매핑을 쓴다
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping
      }}
      aria-hidden='true'
    >
      <Scene onReady={onReady} />
    </Canvas>
  )
}
