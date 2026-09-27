'use client'

// 지형 풍경(산 능선·바다·고산·설원·사막)을 3D로 그리고, 지형에만 쿠와하라(회화풍) 필터를 씌운다.
// 하늘·해·달·별·비는 필터를 거치지 않아 선명하게 남는다

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import type { Landscape, SkyTime, SkyWeather } from '@/lib/sky'

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 격자 값 노이즈
function createNoise(seed: number) {
  const rand = mulberry32(seed)
  const GRID = 256
  const values = Float32Array.from({ length: GRID * GRID }, () => rand())
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
  return {
    fbm(x: number, y: number, octaves = 5) {
      let sum = 0
      let amp = 0.5
      let freq = 1
      for (let i = 0; i < octaves; i++) {
        sum += noise(x * freq, y * freq) * amp
        amp *= 0.5
        freq *= 2.03
      }
      return sum
    },
    // 날카로운 능선이 생기는 ridged 노이즈
    ridged(x: number, y: number, octaves = 5) {
      let sum = 0
      let amp = 0.5
      let freq = 1
      for (let i = 0; i < octaves; i++) {
        const n = 1 - Math.abs(noise(x * freq, y * freq) * 2 - 1)
        sum += n * n * amp
        amp *= 0.5
        freq *= 2.1
      }
      return sum
    },
  }
}

const GROUND = -14
const NEAR = 1
const FAR = 900
const WIDTH = 2200
const SEA_LEVEL = GROUND + 1.5
/** 이 레이어에 있는 물체만 회화풍 필터를 받는다 */
const PAINT_LAYER = 1

type TerrainLandscape = 'hills' | 'coast' | 'alpine' | 'snow' | 'desert'
export const TERRAIN_LANDSCAPES: readonly Landscape[] = ['hills', 'coast', 'alpine', 'snow', 'desert']

interface TerrainPreset {
  seed: number
  /** 가까운 언덕 높이 */
  hills: number
  /** 먼 산맥 높이 */
  mountains: number
  /** 산맥이 솟기 시작하는 거리 ~ 다 솟은 거리 */
  mountainRange: [number, number]
  colors: { low: string; mid: string; rock: string; snow: string }
  /** 최고 높이 대비 이 비율부터 바위, 눈 */
  rockLine: number
  snowLine: number
  /** 가운데를 바다로 파낸다 */
  sea?: boolean
  /** 모래 언덕과 계단식 메사 */
  desert?: boolean
  /** 눈처럼 밝은 지형은 노출을 낮춘 화면에서 회색으로 가라앉으므로 빛을 더 준다.
   *  햇빛(sun)을 세게 주면 노을에 붉게 물들어 사막처럼 보여서, 하늘빛(sky)으로 밝힌다 */
  lightBoost?: { sun: number; sky: number }
  /** 햇빛·대기색을 차가운 라벤더빛으로 섞는 비율. 노을에 눈이 주황으로 타지 않게 한다 */
  coolTint?: number
}

const PRESETS: Record<TerrainLandscape, TerrainPreset> = {
  hills: {
    seed: 629,
    hills: 26,
    mountains: 150,
    mountainRange: [220, 700],
    colors: { low: '#86a356', mid: '#40603a', rock: '#7b7568', snow: '#f3f5f8' },
    rockLine: 0.42,
    snowLine: 0.72,
  },
  coast: {
    seed: 81,
    hills: 22,
    mountains: 70,
    mountainRange: [300, 750],
    colors: { low: '#a8a266', mid: '#4f6c43', rock: '#8a8274', snow: '#e8ecef' },
    rockLine: 0.55,
    snowLine: 2,
    sea: true,
  },
  alpine: {
    seed: 91,
    hills: 30,
    mountains: 210,
    mountainRange: [140, 520],
    colors: { low: '#6f9150', mid: '#2f4c33', rock: '#6f6a62', snow: '#f5f7fa' },
    rockLine: 0.32,
    snowLine: 0.55,
  },
  snow: {
    seed: 101,
    hills: 20,
    mountains: 140,
    mountainRange: [200, 650],
    colors: { low: '#e9eef3', mid: '#c9d3dc', rock: '#8c94a0', snow: '#ffffff' },
    rockLine: 0.5,
    snowLine: 0.18,
    lightBoost: { sun: 1.15, sky: 2.2 },
    coolTint: 0.6,
  },
  desert: {
    seed: 111,
    hills: 12,
    mountains: 60,
    mountainRange: [260, 700],
    colors: { low: '#e0bd83', mid: '#cf9f64', rock: '#b0714a', snow: '#f0dcb4' },
    rockLine: 0.45,
    snowLine: 2,
    desert: true,
  },
}

function buildTerrain(preset: TerrainPreset) {
  const noise = createNoise(preset.seed)
  const geometry = new THREE.PlaneGeometry(WIDTH, FAR - NEAR, 360, 200)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, 0, -(NEAR + FAR) / 2)

  const position = geometry.attributes.position as THREE.BufferAttribute
  const [rangeStart, rangeEnd] = preset.mountainRange
  let maxHeight = 1
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const z = position.getZ(i)
    const distance = -z
    const far = THREE.MathUtils.smoothstep(distance, rangeStart, rangeEnd)
    let height: number
    if (preset.desert) {
      // 바람결 따라 휘어진 모래 언덕 + 멀리 계단식 메사
      const warp = noise.fbm(x * 0.004, z * 0.004, 3) * 6
      const dunes = (Math.sin(x * 0.018 + z * 0.006 + warp) * 0.5 + 0.5) ** 2 * preset.hills
      const mesa = noise.fbm(x * 0.003 + 3, z * 0.003, 4) * preset.mountains * far
      height = dunes + Math.floor(mesa / 14) * 14
    } else {
      const hills = noise.fbm(x * 0.006, z * 0.006, 4) * preset.hills
      const mountains = noise.ridged(x * 0.0032 + 7, z * 0.0032, 6) * preset.mountains * far
      height = hills + mountains - (1 - far) * 6
    }
    if (preset.sea) {
      // 가운데 앞쪽을 파내 바다를 만든다. 양옆 가까운 곳은 곶으로 남는다
      // 멀어질수록 넓어져서 먼 곳은 수평선까지 트인 바다가 된다
      // 화면 양끝에 곶이 걸리도록 가까운 곳은 시야 폭의 절반 남짓, 먼 곳(400 이상)은 확 넓힌다
      const halfWidth = 40 + distance * 0.8 + Math.max(0, distance - 400) * 2.5
      const bay = Math.exp(-((x / halfWidth) ** 4)) * THREE.MathUtils.smoothstep(distance, 20, 90)
      height = height * (1 - bay) - bay * 18
    }
    position.setY(i, GROUND + height)
    maxHeight = Math.max(maxHeight, height)
  }
  geometry.computeVertexNormals()

  // 최고 높이 대비 비율과 경사로 풀 → 숲 → 바위 → 눈을 칠한다
  const normal = geometry.attributes.normal as THREE.BufferAttribute
  const colors = new Float32Array(position.count * 3)
  const color = new THREE.Color()
  const low = new THREE.Color(preset.colors.low)
  const mid = new THREE.Color(preset.colors.mid)
  const rock = new THREE.Color(preset.colors.rock)
  const snow = new THREE.Color(preset.colors.snow)
  for (let i = 0; i < position.count; i++) {
    const t = (position.getY(i) - GROUND) / maxHeight
    const slope = 1 - normal.getY(i)
    const variation = noise.fbm(position.getX(i) * 0.05, position.getZ(i) * 0.05, 2) - 0.5
    color.copy(low).lerp(mid, THREE.MathUtils.clamp(t * 3 + variation * 0.8, 0, 1))
    color.lerp(rock, THREE.MathUtils.clamp((t - preset.rockLine) * 5 + slope * 1.4, 0, 1))
    color.lerp(snow, THREE.MathUtils.clamp((t - preset.snowLine) * 6 - slope * 0.5 + variation, 0, 1))
    colors.set([color.r, color.g, color.b], i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // 눈 오는 날엔 아주 가파른 바위 면만 빼고 하얗게 덮는다. 군데군데 풀·바위가 비치게 얼룩을 준다
  const fresh = new THREE.Color('#f8fafd')
  const snowColors = new Float32Array(position.count * 3)
  for (let i = 0; i < position.count; i++) {
    const slope = 1 - normal.getY(i)
    const patch = noise.fbm(position.getX(i) * 0.03 + 9, position.getZ(i) * 0.03, 3)
    const cover = THREE.MathUtils.clamp(1.25 - slope * 1.6 - (0.5 - patch) * 0.6, 0, 1)
    color.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]).lerp(fresh, cover)
    snowColors.set([color.r, color.g, color.b], i * 3)
  }
  geometry.userData.colors = { normal: geometry.attributes.color, snow: new THREE.BufferAttribute(snowColors, 3) }
  return geometry
}

// 시간대별 대기(안개) 색과 빛
const ATMOSPHERE: Record<SkyTime, { fog: string; sun: string; sunIntensity: number; sky: string; ground: string; hemi: number }> = {
  day: { fog: '#b9cde0', sun: '#fff4e0', sunIntensity: 5, sky: '#bcd4ee', ground: '#5b6a45', hemi: 1.6 },
  dawn: { fog: '#b98b86', sun: '#ffb58a', sunIntensity: 3.2, sky: '#8d7fa6', ground: '#3c3440', hemi: 0.9 },
  dusk: { fog: '#b87d6d', sun: '#ff9a66', sunIntensity: 3, sky: '#7d6a92', ground: '#3a2e38', hemi: 0.8 },
  night: { fog: '#18213d', sun: '#a9bce8', sunIntensity: 1.4, sky: '#34457a', ground: '#11151f', hemi: 1 },
}

const SEA_COLORS: Record<SkyTime, string> = { day: '#236b97', dawn: '#465a80', dusk: '#435277', night: '#101b33' }

// 잔물결 노멀맵: 노이즈 높이값의 기울기로 법선을 만든다
function createRippleTexture() {
  const size = 256
  const noise = createNoise(7)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const image = ctx.createImageData(size, size)
  const height = (x: number, y: number) => noise.fbm((x / size) * 16, (y / size) * 5, 3)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = height((x + 1) % size, y) - height((x - 1 + size) % size, y)
      const dy = height(x, (y + 1) % size) - height(x, (y - 1 + size) % size)
      const i = (y * size + x) * 4
      image.data[i] = 128 + dx * 900
      image.data[i + 1] = 128 + dy * 900
      image.data[i + 2] = 255
      image.data[i + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(60, 30)
  return texture
}

// 윤슬: 가운데가 밝고 양옆으로 번지는 빛줄기를 굵은 물결 줄무늬로 부순다.
// 비스듬히 보면 텍스처가 크게 줄어들어서, 가는 무늬는 평균되며 사라지므로 굵게 그린다
function createGlitterTexture() {
  const width = 64
  const height = 256
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const image = ctx.createImageData(width, height)
  const noise = createNoise(17)
  for (let y = 0; y < height; y++) {
    // 캔버스 위쪽이 수평선 쪽(먼 끝)이다. 먼 쪽이 가장 밝고 가까울수록 옅어진다
    const along = 0.35 + 0.65 * (1 - y / height)
    for (let x = 0; x < width; x++) {
      const across = Math.exp(-(((x - width / 2) / (width * 0.22)) ** 2))
      const streak = THREE.MathUtils.smoothstep(noise.fbm(x * 0.08, y * 0.35, 2), 0.38, 0.62)
      const alpha = across * along * (0.35 + 0.65 * streak)
      const i = (y * width + x) * 4
      image.data[i] = image.data[i + 1] = image.data[i + 2] = 255
      image.data[i + 3] = Math.round(alpha * 255)
    }
  }
  ctx.putImageData(image, 0, 0)
  return new THREE.CanvasTexture(canvas)
}

// 수평선까지 끊기지 않게 멀리 깐다 (카메라 far와 맞춘다)
// 바다 위 섬: 가까운 곶에 가리지 않도록 만 안쪽 트인 바다에 둔다 (x, 거리, 가로 반지름, 높이, 세로 반지름)
const ISLANDS = [
  { x: -110, z: 330, rx: 70, height: 22, rz: 34, seed: 3 },
  { x: 260, z: 620, rx: 130, height: 36, rz: 60, seed: 7 },
  { x: -560, z: 1050, rx: 200, height: 52, rz: 90, seed: 11 },
]

function buildIsland(seed: number) {
  const noise = createNoise(seed)
  const geometry = new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2)
  const position = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const y = position.getY(i)
    const z = position.getZ(i)
    // 봉우리가 한쪽으로 치우친 울퉁불퉁한 둔덕
    const bump = 0.75 + noise.fbm(x * 2 + 5, z * 2 + 5, 3) * 0.6
    position.setXYZ(i, x * (0.9 + noise.fbm(z * 3, y * 3, 2) * 0.25), y ** 1.3 * bump, z)
  }
  geometry.computeVertexNormals()
  const colors = new Float32Array(position.count * 3)
  const sand = new THREE.Color('#c9b98a')
  const forest = new THREE.Color('#3f6440')
  const color = new THREE.Color()
  for (let i = 0; i < position.count; i++) {
    color.copy(sand).lerp(forest, THREE.MathUtils.smoothstep(position.getY(i), 0.04, 0.2))
    colors.set([color.r, color.g, color.b], i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

// 배: 가까이 고기잡이배 두 척, 먼 바다에 유조선 한 척. 물결에 흔들리며 천천히 오간다 (머리가 +x)
const FISHING_BOATS = [
  { x: 40, z: 95, heading: 0.35, sway: 1, phase: 0, scale: 2.6 },
  { x: -90, z: 165, heading: Math.PI - 0.25, sway: -1, phase: 2, scale: 3.2 },
]
// 섬에 가리지 않도록 가운데 오른쪽 바다에 둔다
const TANKER = { x: 40, z: 400, heading: 0.04, phase: 5, scale: 2.2 }

function extrudeHull(points: [number, number][], beam: number) {
  const shape = new THREE.Shape()
  shape.moveTo(...points[0])
  points.slice(1).forEach((point) => shape.lineTo(...point))
  shape.lineTo(...points[0])
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: beam, bevelEnabled: false })
  geometry.translate(0, 0, -beam / 2)
  return geometry
}

function useShipMotion(ref: React.RefObject<THREE.Group | null>, base: { x: number; phase: number }, roam: number, roll: number) {
  useFrame(({ clock }) => {
    const group = ref.current
    if (!group) return
    const t = clock.elapsedTime + base.phase
    group.position.x = base.x + Math.sin(t * 0.02) * roam
    group.position.y = SEA_LEVEL + 0.2 + Math.sin(t * 1.2) * 0.15 * roll
    group.rotation.x = Math.sin(t * 1.05) * 0.05 * roll
    group.rotation.z = Math.sin(t * 0.8) * 0.025 * roll
  })
  useEffect(() => {
    ref.current?.traverse((object) => object.layers.enable(PAINT_LAYER))
  })
}

function FishingBoat({ boat, night }: { boat: (typeof FISHING_BOATS)[number]; night: boolean }) {
  const ref = useRef<THREE.Group>(null)
  // 뱃머리가 들린 선체
  const hull = useMemo(
    () =>
      extrudeHull(
        [
          [-3.6, 1.1],
          [4.2, 1.6],
          [3.2, -0.45],
          [-3.1, -0.45],
        ],
        2,
      ),
    [],
  )
  useEffect(() => () => hull.dispose(), [hull])
  useShipMotion(ref, boat, 30 * boat.sway, 1)

  return (
    <group
      ref={ref}
      position={[boat.x, SEA_LEVEL, -boat.z]}
      rotation={[0, boat.heading, 0]}
      scale={boat.scale}
    >
      <mesh geometry={hull}>
        <meshLambertMaterial color='#2e5a8a' />
      </mesh>
      {/* 뱃전의 흰 띠 */}
      <mesh position={[0.3, 1.25, 0]}>
        <boxGeometry args={[7.6, 0.25, 2.06]} />
        <meshLambertMaterial color='#eeeae0' />
      </mesh>
      {/* 조타실과 앞창 */}
      <mesh position={[1.2, 2.2, 0]}>
        <boxGeometry args={[2.2, 1.8, 1.5]} />
        <meshLambertMaterial color='#f2efe8' />
      </mesh>
      <mesh position={[1.25, 3.2, 0]}>
        <boxGeometry args={[2.5, 0.2, 1.7]} />
        <meshLambertMaterial color='#b33b2e' />
      </mesh>
      <mesh position={[2.32, 2.45, 0]}>
        <boxGeometry args={[0.05, 0.55, 1.2]} />
        <meshLambertMaterial
          color={night ? '#ffd98a' : '#34465e'}
          emissive={night ? '#ffc861' : '#000000'}
          emissiveIntensity={night ? 1.4 : 0}
        />
      </mesh>
      {/* 돛대와 양옆으로 뻗은 그물 붐대 */}
      <mesh position={[-1.4, 3.6, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 5, 6]} />
        <meshLambertMaterial color='#4a4540' />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[-1.4, 2.6, side * 1.7]}
          rotation={[side * 1.05, 0, 0]}
        >
          <cylinderGeometry args={[0.04, 0.05, 4, 5]} />
          <meshLambertMaterial color='#4a4540' />
        </mesh>
      ))}
      {night && (
        <>
          {/* 돛대 꼭대기 등과 집어등 줄조명 */}
          <Glow
            position={[-1.4, 6.2, 0]}
            color='#fff1c9'
            size={5}
          />
          {Array.from({ length: 5 }, (_, i) => (
            <Glow
              key={i}
              position={[-1.4 + (i + 1) * 1, 5.6 - (i + 1) * 0.75, 0]}
              color='#fff6dc'
              size={3.2}
            />
          ))}
          <Glow
            position={[2.4, 2.45, 0]}
            color='#ffc861'
            size={6}
            opacity={0.8}
          />
        </>
      )}
    </group>
  )
}

function Tanker({ night }: { night: boolean }) {
  const ref = useRef<THREE.Group>(null)
  // 길고 낮은 선체. 선수 쪽이 살짝 뾰족하다
  const hull = useMemo(
    () =>
      extrudeHull(
        [
          [-30, 2.6],
          [30, 2.6],
          [33, 1.6],
          [30, -1.2],
          [-29, -1.2],
        ],
        8,
      ),
    [],
  )
  useEffect(() => () => hull.dispose(), [hull])
  useShipMotion(ref, TANKER, 25, 0.25)

  return (
    <group
      ref={ref}
      position={[TANKER.x, SEA_LEVEL, -TANKER.z]}
      rotation={[0, TANKER.heading, 0]}
      scale={TANKER.scale}
    >
      <mesh geometry={hull}>
        <meshLambertMaterial color='#2d2a2c' />
      </mesh>
      {/* 흘수선 아래 붉은 선저 */}
      <mesh position={[1, -0.55, 0]}>
        <boxGeometry args={[60, 1.3, 8.1]} />
        <meshLambertMaterial color='#8c2c24' />
      </mesh>
      {/* 갑판 배관 */}
      <mesh position={[4, 3.1, 0]}>
        <boxGeometry args={[46, 0.9, 1.6]} />
        <meshLambertMaterial color='#7a7466' />
      </mesh>
      {/* 선미의 선교 */}
      <mesh position={[-24, 6.2, 0]}>
        <boxGeometry args={[7, 7.2, 7.6]} />
        <meshLambertMaterial color='#eeebe4' />
      </mesh>
      <mesh position={[-22.9, 8.8, 0]}>
        <boxGeometry args={[4.9, 0.8, 7.7]} />
        <meshLambertMaterial
          color={night ? '#ffd98a' : '#3a4a5e'}
          emissive={night ? '#ffc861' : '#000000'}
          emissiveIntensity={night ? 1.2 : 0}
        />
      </mesh>
      {/* 굴뚝 */}
      <mesh position={[-27.2, 11.3, 0]}>
        <boxGeometry args={[2.4, 3.8, 2.4]} />
        <meshLambertMaterial color='#1f1f22' />
      </mesh>
      <mesh position={[-27.2, 10.2, 0]}>
        <boxGeometry args={[2.45, 0.8, 2.45]} />
        <meshLambertMaterial color='#b33b2e' />
      </mesh>
      {night && (
        <>
          {/* 선교 창 불빛, 선수·선미 항해등 */}
          <Glow
            position={[-22, 8.8, 4]}
            color='#ffd27a'
            size={14}
            opacity={1}
          />
          <Glow
            position={[31, 5, 0]}
            color='#fff4d6'
            size={9}
          />
          <Glow
            position={[-27.2, 13.6, 0]}
            color='#ff6a5c'
            size={4.5}
          />
        </>
      )}
    </group>
  )
}

// 불빛 한 점: 선명한 알맹이와 번지는 빛무리
function Glow({
  position,
  color,
  size,
  opacity = 1,
}: {
  position: [number, number, number]
  color: string
  size: number
  opacity?: number
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.15, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.18)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <sprite
      position={position}
      scale={[size, size, 1]}
    >
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        fog={false}
      />
    </sprite>
  )
}

// 등대: 가장 가까운 섬 꼭대기. 저녁·밤엔 등불이 켜지고 빛줄기가 돌며, 이쪽을 향할 때 번쩍인다
const LIGHTHOUSE = { x: ISLANDS[0].x + 12, z: ISLANDS[0].z, base: SEA_LEVEL - 1 + ISLANDS[0].height * 0.78 }
const LIGHTHOUSE_HEIGHT = 20

function Lighthouse({ lit }: { lit: boolean }) {
  const beamRef = useRef<THREE.Group>(null)
  const flashRef = useRef<THREE.Sprite>(null)
  const beamTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const along = ctx.createLinearGradient(0, 0, 256, 0)
    along.addColorStop(0, 'rgba(255,255,255,0.9)')
    along.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = along
    ctx.fillRect(0, 0, 256, 32)
    // 가운데가 밝고 가장자리는 옅게
    ctx.globalCompositeOperation = 'destination-in'
    const across = ctx.createLinearGradient(0, 0, 0, 32)
    across.addColorStop(0, 'rgba(0,0,0,0)')
    across.addColorStop(0.5, 'rgba(0,0,0,1)')
    across.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = across
    ctx.fillRect(0, 0, 256, 32)
    return new THREE.CanvasTexture(canvas)
  }, [])
  useEffect(() => () => beamTexture.dispose(), [beamTexture])

  useFrame(({ clock }) => {
    const angle = clock.elapsedTime * 0.9
    if (beamRef.current) beamRef.current.rotation.y = angle
    if (flashRef.current) {
      // 빛줄기가 카메라(+z 방향) 쪽을 향할수록 밝아진다
      const facing = Math.max(0, Math.cos(angle + Math.PI / 2))
      const material = flashRef.current.material as THREE.SpriteMaterial
      material.opacity = 0.55 + facing ** 6 * 1.4
      const size = 18 + facing ** 6 * 40
      flashRef.current.scale.set(size, size, 1)
    }
  })

  const top = LIGHTHOUSE.base + LIGHTHOUSE_HEIGHT
  return (
    <group position={[LIGHTHOUSE.x, 0, -LIGHTHOUSE.z]}>
      {/* 흰색·빨간색 줄무늬 탑 */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh
          key={i}
          position={[0, LIGHTHOUSE.base + (i + 0.5) * (LIGHTHOUSE_HEIGHT / 4), 0]}
        >
          <cylinderGeometry args={[1.5 - (i + 1) * 0.18, 1.5 - i * 0.18, LIGHTHOUSE_HEIGHT / 4, 12]} />
          <meshLambertMaterial color={i % 2 === 0 ? '#f2eee6' : '#b8392e'} />
        </mesh>
      ))}
      <mesh position={[0, top + 1, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 2, 10]} />
        <meshLambertMaterial
          color={lit ? '#ffe7a8' : '#d8dde2'}
          emissive={lit ? '#ffcf6e' : '#000000'}
          emissiveIntensity={lit ? 1.2 : 0}
        />
      </mesh>
      <mesh position={[0, top + 2.6, 0]}>
        <coneGeometry args={[1.4, 1.4, 10]} />
        <meshLambertMaterial color='#3b3f45' />
      </mesh>
      {lit && (
        <>
          <group
            ref={beamRef}
            position={[0, top + 1, 0]}
          >
            {/* 양쪽으로 뻗는 빛줄기 두 가닥 */}
            {[0, Math.PI].map((rotation) => (
              <mesh
                key={rotation}
                rotation={[0, rotation, 0]}
                position={[Math.cos(rotation) * 120, 0, 0]}
              >
                <planeGeometry args={[240, 6]} />
                <meshBasicMaterial
                  map={beamTexture}
                  color='#fff0c2'
                  transparent
                  opacity={0.35}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                  fog={false}
                />
              </mesh>
            ))}
          </group>
          <sprite
            ref={flashRef}
            position={[0, top + 1, 0]}
          >
            <spriteMaterial
              map={GLOW_TEXTURE()}
              color='#ffe9b0'
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
              fog={false}
            />
          </sprite>
        </>
      )}
    </group>
  )
}

let glowTexture: THREE.CanvasTexture | null = null
function GLOW_TEXTURE() {
  if (glowTexture) return glowTexture
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.6)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  glowTexture = new THREE.CanvasTexture(canvas)
  return glowTexture
}

// 돌고래 (길이 약 5, 머리가 +x, 등이 +y)
const DOLPHIN_ARCH = 0.06
const DOLPHIN_BACK = new THREE.Color('#6a7b90')
const DOLPHIN_BELLY = new THREE.Color('#e6ebf0')

// 몸통: 꼬리자루는 가늘고 가운데가 통통하며, 이마(멜론)가 볼록하고 짧은 주둥이가 튀어나온 유선형
function createDolphinBody() {
  // [머리 쪽으로의 위치 0~1, 반지름]
  const profile: [number, number][] = [
    [0, 0.02], [0.04, 0.1], [0.14, 0.2], [0.3, 0.38], [0.48, 0.52], [0.62, 0.53],
    [0.74, 0.47], [0.83, 0.42], [0.88, 0.36], [0.91, 0.22], [0.95, 0.12], [0.99, 0.07], [1, 0],
  ]
  const points = profile.map(([t, r]) => new THREE.Vector2(r, t * 5 - 2.5))
  const geometry = new THREE.LatheGeometry(points, 20)
  // 길이 방향(y)을 x로 눕히고, 옆구리를 살짝 눌러 납작하게
  geometry.rotateZ(-Math.PI / 2)
  geometry.scale(1, 1, 0.82)
  const position = geometry.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(position.count * 3)
  const color = new THREE.Color()
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const y = position.getY(i)
    // 이마는 위로 조금 더 솟고, 주둥이는 살짝 아래로
    if (x > 1.4 && x < 2.2) position.setY(i, y + (y > 0 ? 0.08 : 0))
    if (x > 2.2) position.setY(i, y - 0.06)
    // 뛰어오를 때처럼 등을 둥글게 휜다 (머리와 꼬리가 조금 처진다)
    position.setY(i, position.getY(i) - DOLPHIN_ARCH * x * x)
    // 등은 짙고 배는 밝게. 경계는 옆구리에서 부드럽게 바뀐다 (카운터셰이딩)
    const belly = THREE.MathUtils.smoothstep(-y, -0.05, 0.25)
    color.copy(DOLPHIN_BACK).lerp(DOLPHIN_BELLY, belly)
    colors.set([color.r, color.g, color.b], i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return geometry
}

function extrudeFin(points: [number, number][], thickness: number) {
  const shape = new THREE.Shape()
  shape.moveTo(...points[0])
  for (let i = 1; i < points.length; i += 2) shape.quadraticCurveTo(...points[i], ...points[i + 1])
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 1 })
  geometry.translate(0, 0, -thickness / 2)
  return geometry
}

function createDolphinParts() {
  return {
    body: createDolphinBody(),
    // 등지느러미: 뒤로 휘어진 낫 모양
    dorsal: extrudeFin([[-0.45, 0], [-0.3, 0.4], [-0.65, 0.68], [-0.15, 0.42], [0.45, 0]], 0.08),
    // 꼬리지느러미: 가운데가 파이고 양 끝이 뒤로 뾰족한 두 갈래
    fluke: extrudeFin([[0, 0], [-0.4, 0.55], [-0.95, 0.85], [-0.55, 0.3], [-0.45, 0], [-0.55, -0.3], [-0.95, -0.85], [-0.4, -0.55], [0, 0]], 0.06),
    // 가슴지느러미
    pectoral: extrudeFin([[0, 0], [-0.25, -0.2], [-0.7, -0.45], [-0.3, -0.05], [0.15, 0]], 0.05),
  }
}

const DOLPHIN_CYCLE = 21
const DOLPHIN_JUMP = 1.8
const DOLPHIN_POD = 4
const SPLASH_DROPS = 32

function Dolphin({
  parts,
  index,
}: {
  parts: ReturnType<typeof createDolphinParts>
  index: number
}) {
  const ref = useRef<THREE.Group>(null)
  const tailRef = useRef<THREE.Group>(null)
  const splashRefs = useRef<(THREE.Sprite | null)[]>([])
  const splashAt = useRef(new THREE.Vector3())

  useFrame(({ clock }) => {
    const group = ref.current
    if (!group) return
    const t = clock.elapsedTime
    const cycle = Math.floor(t / DOLPHIN_CYCLE)
    const rand = mulberry32(cycle * 97 + 13)
    // 낮엔 카메라가 들려 있어 거리 약 90보다 가까운 바다는 화면 아래로 벗어난다
    const distance = 100 + rand() * 50
    const halfWidth = 40 + distance * 0.8
    const baseX = (rand() - 0.5) * halfWidth
    const direction = rand() < 0.5 ? -1 : 1
    const local = t - cycle * DOLPHIN_CYCLE
    const progress = (local - 2 - index * 0.35) / DOLPHIN_JUMP
    const x = (p: number) => baseX + direction * (p * 40 - index * 16)
    // 줄지어 겹치지 않게 앞뒤로 엇갈려 둔다
    const z = -distance - index * 9 + (index % 2) * 4

    const visible = progress > 0 && progress < 1
    group.visible = visible
    if (visible) {
      // 포물선으로 뛰어오르고, 몸은 궤적의 접선 방향으로 기운다
      group.position.set(x(progress), SEA_LEVEL - 4.5 + Math.sin(progress * Math.PI) * 15, z)
      group.rotation.set(0, direction > 0 ? 0 : Math.PI, Math.cos(progress * Math.PI) * 0.85)
      group.scale.setScalar(3.8 + (index % 2) * 0.4)
      // 공중에서 꼬리를 위아래로 친다
      if (tailRef.current) tailRef.current.rotation.z = Math.sin(t * 9 + index) * 0.28
    }

    // 물보라: 솟아오를 때(0)와 들어갈 때(1) 튄다
    const sinceExit = progress * DOLPHIN_JUMP
    const sinceEntry = (progress - 1) * DOLPHIN_JUMP
    const age = sinceExit >= 0 && sinceExit < 0.7 ? sinceExit : sinceEntry >= 0 && sinceEntry < 0.7 ? sinceEntry : -1
    if (age >= 0) splashAt.current.set(x(sinceEntry >= 0 ? 1 : 0), SEA_LEVEL, z)
    splashRefs.current.forEach((sprite, k) => {
      if (!sprite) return
      sprite.visible = age >= 0
      if (age < 0) return
      // 물방울마다 튀는 각도와 세기를 다르게 해서 물줄기처럼 흩어지게 한다
      const angle = ((k + 0.5) / SPLASH_DROPS) * Math.PI * 0.9 - Math.PI * 0.45
      const spread = age * (14 + ((k * 37) % 13))
      // 수면과 같은 높이면 수면에 가려지므로 살짝 띄운다
      sprite.position.set(
        splashAt.current.x + Math.sin(angle) * spread * 0.9,
        SEA_LEVEL + 0.6 + Math.max(0, Math.cos(angle) * spread * 1.6 - age * age * 30),
        splashAt.current.z + 0.5,
      )
      // 작은 물방울이 흩어지며 조금씩 퍼진다
      const size = 0.7 + ((k * 13) % 5) * 0.2 + age * 0.8
      sprite.scale.set(size, size, 1)
      ;(sprite.material as THREE.SpriteMaterial).opacity = 1 - age / 0.7
    })
  })

  return (
    <>
      <group
        ref={ref}
        visible={false}
      >
        <mesh geometry={parts.body}>
          <meshLambertMaterial vertexColors />
        </mesh>
        <mesh
          geometry={parts.dorsal}
          position={[0.1, 0.48, 0]}
        >
          <meshLambertMaterial color={DOLPHIN_BACK} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            geometry={parts.pectoral}
            position={[1.1, -0.22 - DOLPHIN_ARCH * 1.1 * 1.1, side * 0.38]}
            rotation={[side * 0.5, side * 0.35, 0]}
          >
            <meshLambertMaterial color={DOLPHIN_BACK} />
          </mesh>
        ))}
        {/* 눈 */}
        {[-1, 1].map((side) => (
          <mesh
            key={`eye-${side}`}
            position={[1.85, 0.08 - DOLPHIN_ARCH * 1.85 * 1.85, side * 0.33]}
          >
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshBasicMaterial color='#11161d' />
          </mesh>
        ))}
        {/* 꼬리: 꼬리자루 끝을 축으로 위아래로 친다 */}
        <group
          ref={tailRef}
          position={[-2.4, -DOLPHIN_ARCH * 2.4 * 2.4, 0]}
        >
          <mesh
            geometry={parts.fluke}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshLambertMaterial color={DOLPHIN_BACK} />
          </mesh>
        </group>
      </group>
      {Array.from({ length: SPLASH_DROPS }, (_, k) => (
        <sprite
          key={k}
          ref={(node) => {
            splashRefs.current[k] = node
          }}
          visible={false}
        >
          <spriteMaterial
            map={GLOW_TEXTURE()}
            color='#ffffff'
            transparent
            depthWrite={false}
            fog={false}
          />
        </sprite>
      ))}
    </>
  )
}

// 돌고래 떼: 한 주기마다 한 번, 네 마리가 줄지어 물 위로 뛰어올랐다 들어간다. 뛰는 위치는 주기마다 바뀐다
function Dolphins() {
  const parts = useMemo(createDolphinParts, [])
  useEffect(() => () => Object.values(parts).forEach((geometry) => geometry.dispose()), [parts])
  return (
    <>
      {Array.from({ length: DOLPHIN_POD }, (_, k) => (
        <Dolphin
          key={k}
          parts={parts}
          index={k}
        />
      ))}
    </>
  )
}

function Islands() {
  const geometries = useMemo(() => ISLANDS.map((island) => buildIsland(island.seed)), [])
  const refs = useRef<(THREE.Mesh | null)[]>([])
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries])
  useEffect(() => {
    refs.current.forEach((mesh) => mesh?.layers.enable(PAINT_LAYER))
  })
  return (
    <>
      {ISLANDS.map((island, i) => (
        <mesh
          key={island.seed}
          ref={(node) => {
            refs.current[i] = node
          }}
          geometry={geometries[i]}
          position={[island.x, SEA_LEVEL - 1, -island.z]}
          scale={[island.rx, island.height, island.rz]}
        >
          <meshLambertMaterial vertexColors />
        </mesh>
      ))}
    </>
  )
}

const SEA_DEPTH = 24000
// 윤슬 띠: 거리 120부터 1200까지
const GLITTER_CENTER = 660
const GLITTER_LENGTH = 1080

function Sea({
  meshRef,
  time,
  dull,
  sunDirection,
}: {
  meshRef: React.RefObject<THREE.Mesh | null>
  time: SkyTime
  dull: boolean
  sunDirection: THREE.Vector3
}) {
  const ripple = useMemo(createRippleTexture, [])
  const glitter = useMemo(createGlitterTexture, [])
  const glitterRef = useRef<THREE.Mesh>(null)
  useEffect(
    () => () => {
      ripple.dispose()
      glitter.dispose()
    },
    [ripple, glitter],
  )

  // 물결이 천천히 밀려오고 윤슬이 반짝이며 흐른다
  useFrame((_, delta) => {
    ripple.offset.y += delta * 0.02
    ripple.offset.x += delta * 0.004
  })

  // 해(밤엔 달빛 대신 옅게) 아래로 수평선에서 발밑까지 윤슬 띠를 깐다
  const sunX = sunDirection.z < -0.01 ? (sunDirection.x / -sunDirection.z) : 0
  const low = THREE.MathUtils.clamp(1 - sunDirection.y * 3, 0.35, 1)
  const glitterOpacity = dull ? 0 : time === 'night' ? 0.35 : (time === 'day' ? 0.7 : 1) * low
  // 가산 합성이라 1보다 밝은 색을 줘야 어두운 바다 위에서 눈에 띈다
  const glitterColor = useMemo(
    () => new THREE.Color(time === 'day' ? '#fff8e8' : time === 'night' ? '#c9d5f5' : '#ffc38a').multiplyScalar(time === 'day' ? 1.2 : 2),
    [time],
  )

  return (
    <>
      <Islands />
      <Lighthouse lit={time !== 'day'} />
      {time === 'day' && <Dolphins />}
      {FISHING_BOATS.map((boat, i) => (
        <FishingBoat
          key={i}
          boat={boat}
          night={time === 'night'}
        />
      ))}
      <Tanker night={time === 'night'} />
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, SEA_LEVEL, -SEA_DEPTH / 2]}
      >
        <planeGeometry args={[SEA_DEPTH * 3, SEA_DEPTH]} />
        {/* 산을 비추는 빛이 카메라 쪽에서 와서, 광택 있는 재질이면 수면에 흰 줄이 번진다. 반짝임은 윤슬 띠가 맡는다 */}
        <meshLambertMaterial
          color={dull ? '#56687a' : SEA_COLORS[time]}
          normalMap={ripple}
          normalScale={new THREE.Vector2(0.6, 0.6)}
        />
      </mesh>
      {glitterOpacity > 0 && (
        // 발치에서 해 쪽으로 비스듬히 수평선까지. 폭이 일정해도 원근 때문에 멀수록 좁아 보인다
        <group
          position={[sunX * GLITTER_CENTER, SEA_LEVEL + 0.3, -GLITTER_CENTER]}
          rotation={[0, -Math.atan(sunX), 0]}
        >
        <mesh
          ref={glitterRef}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[70, GLITTER_LENGTH]} />
          <meshBasicMaterial
            map={glitter}
            color={glitterColor}
            transparent
            opacity={glitterOpacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
            toneMapped={false}
            // 멀리 있으면 수면과 높이 차가 깊이 정밀도보다 작아 묻힌다. 깊이를 앞당겨 수면 위에 그린다
            polygonOffset
            polygonOffsetFactor={-8}
            polygonOffsetUnits={-8}
          />
        </mesh>
        </group>
      )}
    </>
  )
}

const COOL = new THREE.Color('#f1e9f4')
const COOL_FOG = new THREE.Color('#9d98b4')

export function Terrain({
  landscape,
  time,
  weather,
  sunDirection,
  glintDirection,
}: {
  landscape: Landscape
  time: SkyTime
  weather: SkyWeather
  sunDirection: THREE.Vector3
  /** 윤슬이 비칠 방향. 밤엔 달 쪽 */
  glintDirection?: THREE.Vector3
}) {
  const scene = useThree((state) => state.scene)
  const preset = PRESETS[landscape as TerrainLandscape]
  const geometry = useMemo(() => buildTerrain(preset), [preset])
  const terrainRef = useRef<THREE.Mesh>(null)
  const waterRef = useRef<THREE.Mesh>(null)
  const atmosphere = ATMOSPHERE[time]
  const overcast = weather === 'rain' || weather === 'storm' || weather === 'snow'
  const foggy = weather === 'fog'

  useEffect(() => () => geometry.dispose(), [geometry])

  useEffect(() => {
    const { normal, snow } = geometry.userData.colors
    geometry.setAttribute('color', weather === 'snow' ? snow : normal)
  }, [geometry, weather])

  useEffect(() => {
    terrainRef.current?.layers.enable(PAINT_LAYER)
    waterRef.current?.layers.enable(PAINT_LAYER)
  })

  // 거리에 따라 대기 색으로 옅어진다. 흐리거나 안개가 끼면 더 가까이서부터
  // 눈 오는 날엔 어느 지형이든 눈빛이 회색으로 가라앉지 않게 차가운 빛을 섞고 밝힌다
  const snowing = weather === 'snow'
  const coolTint = Math.max(preset.coolTint ?? 0, snowing ? 0.5 : 0)
  const sunColor = useMemo(() => new THREE.Color(atmosphere.sun).lerp(COOL, coolTint), [atmosphere.sun, coolTint])

  useEffect(() => {
    const color = new THREE.Color(atmosphere.fog).lerp(COOL_FOG, coolTint)
    if (overcast) color.lerp(new THREE.Color(time === 'night' ? '#1b2030' : '#9aa3ad'), 0.6)
    scene.fog = new THREE.Fog(color, foggy ? 40 : 120, foggy ? 420 : overcast ? 650 : 1000)
    return () => {
      scene.fog = null
    }
  }, [scene, atmosphere.fog, overcast, foggy, time, coolTint])

  // 카메라는 늘 해를 바라봐서, 실제 방향대로 비추면 산의 그늘진 면만 보인다.
  // 그림처럼 보이도록 좌우는 해를 따르되 빛은 카메라 쪽 비스듬히 위에서 오게 한다
  const lightDirection = new THREE.Vector3(sunDirection.x, Math.max(sunDirection.y, 0.35), 0.7).normalize()
  const boost = preset.lightBoost ?? (snowing ? { sun: 1.15, sky: 2.2 } : { sun: 1, sky: 1 })
  // 흐린 날은 햇빛이 약해진다. 밤엔 원래 약하니 덜 줄여서 지형이 새까맣게 묻히지 않게 한다
  const dimming = overcast ? (time === 'night' ? 0.8 : 0.35) : weather === 'cloudy' ? 0.7 : 1
  const sunIntensity = atmosphere.sunIntensity * boost.sun * dimming

  return (
    <>
      <hemisphereLight args={[atmosphere.sky, atmosphere.ground, atmosphere.hemi * boost.sky * (overcast ? (time === 'night' ? 1.6 : 1.2) : 1)]} />
      <directionalLight
        position={lightDirection.multiplyScalar(500)}
        color={sunColor}
        intensity={sunIntensity}
      />
      <mesh
        ref={terrainRef}
        geometry={geometry}
      >
        {/* 흙·풀엔 광택이 없다. Standard 재질은 비스듬히 볼 때 반사광(프레넬)이 흰 줄로 생긴다 */}
        <meshLambertMaterial vertexColors />
      </mesh>
      {preset.sea && (
        <Sea
          meshRef={waterRef}
          time={time}
          dull={overcast || foggy}
          sunDirection={glintDirection ?? sunDirection}
        />
      )}
    </>
  )
}

// 쿠와하라 필터: 네 사분면 중 색이 가장 고른 쪽의 평균으로 칠해서, 디테일은 뭉개고 경계는 살린다.
// 마스크(지형만 흰색)가 있는 곳에만 적용하고, 하늘은 원본을 그대로 쓴다
const KuwaharaShader = {
  uniforms: {
    tDiffuse: { value: null },
    tMask: { value: null },
    resolution: { value: new THREE.Vector2(1, 1) },
    radius: { value: 5 },
    skySaturation: { value: 1 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform sampler2D tMask;
    uniform vec2 resolution;
    uniform int radius;
    uniform float skySaturation;
    varying vec2 vUv;

    const int MAX_RADIUS = 8;

    void quadrant(vec2 dir, out vec3 mean, out float variance) {
      vec3 sum = vec3(0.0);
      vec3 sumSq = vec3(0.0);
      float count = 0.0;
      vec2 texel = 1.0 / resolution;
      for (int j = 0; j <= MAX_RADIUS; j++) {
        if (j > radius) break;
        for (int i = 0; i <= MAX_RADIUS; i++) {
          if (i > radius) break;
          vec3 c = texture2D(tDiffuse, vUv + vec2(float(i), float(j)) * dir * texel).rgb;
          sum += c;
          sumSq += c * c;
          count += 1.0;
        }
      }
      mean = sum / count;
      vec3 v = abs(sumSq / count - mean * mean);
      variance = v.r + v.g + v.b;
    }

    void main() {
      vec4 original = texture2D(tDiffuse, vUv);
      float mask = texture2D(tMask, vUv).r;
      if (mask < 0.01) {
        // 하늘: 물리 기반 하늘은 채도가 낮아 희뿌옇게 보여서, 맑은 날엔 채도를 끌어올린다
        float luma = dot(original.rgb, vec3(0.2126, 0.7152, 0.0722));
        gl_FragColor = vec4(max(mix(vec3(luma), original.rgb, skySaturation), 0.0), original.a);
        return;
      }
      vec3 m0; vec3 m1; vec3 m2; vec3 m3;
      float v0; float v1; float v2; float v3;
      quadrant(vec2(-1.0, -1.0), m0, v0);
      quadrant(vec2( 1.0, -1.0), m1, v1);
      quadrant(vec2(-1.0,  1.0), m2, v2);
      quadrant(vec2( 1.0,  1.0), m3, v3);
      vec3 color = m0; float best = v0;
      if (v1 < best) { best = v1; color = m1; }
      if (v2 < best) { best = v2; color = m2; }
      if (v3 < best) { best = v3; color = m3; }
      gl_FragColor = vec4(mix(original.rgb, color, mask), original.a);
    }
  `,
}

const BLACK = new THREE.Color(0, 0, 0)

// 기본 렌더링 대신 후처리 파이프라인으로 그린다 (useFrame 우선순위 1)
export function Painterly({ skySaturation = 1 }: { skySaturation?: number }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)

  const { composer, kuwahara, maskTarget, maskMaterial } = useMemo(() => {
    const composer = new EffectComposer(gl)
    composer.addPass(new RenderPass(scene, camera))
    const kuwahara = new ShaderPass(KuwaharaShader)
    composer.addPass(kuwahara)
    composer.addPass(new OutputPass())
    const maskTarget = new THREE.WebGLRenderTarget(1, 1)
    const maskMaterial = new THREE.MeshBasicMaterial({ color: 'white', fog: false })
    kuwahara.uniforms.tMask.value = maskTarget.texture
    return { composer, kuwahara, maskTarget, maskMaterial }
  }, [gl, scene, camera])

  useEffect(() => {
    const pixelRatio = gl.getPixelRatio()
    composer.setPixelRatio(pixelRatio)
    composer.setSize(size.width, size.height)
    maskTarget.setSize(size.width * pixelRatio, size.height * pixelRatio)
    kuwahara.uniforms.resolution.value.set(size.width * pixelRatio, size.height * pixelRatio)
    // 좁은 화면(휴대폰)은 필터 반경을 줄여 연산을 아낀다
    kuwahara.uniforms.radius.value = size.width < 768 ? 3 : 5
  }, [composer, kuwahara, maskTarget, gl, size])

  useEffect(() => {
    kuwahara.uniforms.skySaturation.value = skySaturation
  }, [kuwahara, skySaturation])

  useEffect(
    () => () => {
      composer.dispose()
      maskTarget.dispose()
      maskMaterial.dispose()
    },
    [composer, maskTarget, maskMaterial],
  )

  const clearColor = useMemo(() => new THREE.Color(), [])

  useFrame(() => {
    // 1) 필터를 받을 물체(지형·바다)만 흰색으로 그린 마스크
    const layers = camera.layers.mask
    const background = scene.background
    const override = scene.overrideMaterial
    const clearAlpha = gl.getClearAlpha()
    gl.getClearColor(clearColor)
    camera.layers.set(PAINT_LAYER)
    scene.background = BLACK
    scene.overrideMaterial = maskMaterial
    gl.setRenderTarget(maskTarget)
    gl.setClearColor(BLACK, 1)
    gl.clear()
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    gl.setClearColor(clearColor, clearAlpha)
    scene.overrideMaterial = override
    scene.background = background
    camera.layers.mask = layers

    // 2) 전체 장면 → 지형에만 쿠와하라 → 톤 매핑
    composer.render()
  }, 1)

  return null
}
