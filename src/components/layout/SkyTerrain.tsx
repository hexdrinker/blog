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
      const bay = Math.exp(-((x / 420) ** 2)) * THREE.MathUtils.smoothstep(distance, 40, 180)
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

  // 눈 오는 날엔 가파른 곳만 빼고 하얗게 덮인 색을 쓴다
  const snowColors = new Float32Array(position.count * 3)
  for (let i = 0; i < position.count; i++) {
    const slope = 1 - normal.getY(i)
    const cover = THREE.MathUtils.clamp(0.95 - slope * 2.2, 0, 1)
    color.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]).lerp(snow, cover)
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

const COOL = new THREE.Color('#f1e9f4')
const COOL_FOG = new THREE.Color('#9d98b4')

export function Terrain({
  landscape,
  time,
  weather,
  sunDirection,
}: {
  landscape: Landscape
  time: SkyTime
  weather: SkyWeather
  sunDirection: THREE.Vector3
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
  const coolTint = preset.coolTint ?? 0
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
  const boost = preset.lightBoost ?? { sun: 1, sky: 1 }
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
        <mesh
          ref={waterRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, SEA_LEVEL, -(NEAR + FAR) / 2]}
        >
          <planeGeometry args={[WIDTH, FAR - NEAR]} />
          {/* 매끈한 수면이라 해 쪽으로 반짝이는 반사광(윤슬)이 생긴다 */}
          <meshStandardMaterial
            color={time === 'night' ? '#16233f' : overcast || foggy ? '#5f7482' : '#5b8fb0'}
            // 해가 가려진 날엔 윤슬이 없도록 수면을 거칠게 한다
            roughness={overcast || foggy ? 0.95 : 0.28}
            metalness={0}
          />
        </mesh>
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
        gl_FragColor = original;
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
export function Painterly() {
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
