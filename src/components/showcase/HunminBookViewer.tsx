'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import * as THREE from 'three'

/**
 * 메인 페이지 히어로 하단에 띄우는 ≪훈민정음≫ 해례본 3D 모델.
 *
 * 디자인 결정
 *  • Meshy 류 도구로 만든 GLB는 표지/속지를 별도 mesh·material 로 분리하지
 *    않는 경우가 많다. 따라서 이름 패턴으로 표지를 ‘숨기는’ 시도는
 *    위험(속지까지 가려질 수 있음). 대신 **카메라 앵글**로 표지가
 *    프레임 밖으로 빠지고 속지(펼친 면)가 정면으로 들어오도록 한다.
 *  • 모델은 X축 회전으로 ‘누운 정도’와 ‘속지가 보이는 각’을 맞춘다. 값은
 *    프로젝트마다 좌표계가 달라 `BOOK_ROT_X` 의 분모(현재 4.4)만 조정하는
 *    식으로 맞추면 된다.
 *  • 정적이지 않게 아주 작은 위아래 부양·Y축 흔들림만 준다(진폭 상수로 조절).
 *
 *  튜닝 위치 요약
 *  • 자세: 아래 `BOOK_ROT_X` / `BOOK_ROT_Y` / `BOOK_ROT_Z`
 *  • 화면에서 상대적 크기: `BOOK_BOUNDS_MARGIN`(작을수록 확대, 잘림 위험)
 *  • 애니메이션: `FLOAT_AMP_Y` / `SWAY_AMP_Y`(폭), `FLOAT_FREQ` / `SWAY_FREQ`(진동 속도)
 *  • 레이아웃 픽셀 높이: `src/app/(site)/page.tsx` 의 3D 컨테이너 `clamp(...)`
 */

/** 정적 자산: `public/models/hmji.glb` → URL `/models/hmji.glb` */
const MODEL_PATH = '/models/hmji.glb'

/** 한 번 캐시해 두면 페이지 진입이 매끄럽다. */
useGLTF.preload(MODEL_PATH)

/* 모델 자세 — GLB 축마다 다르므로 숫자만 바꿔 맞춘다.
 * `BOOK_ROT_X`: 분모를 키우면 회전량이 줄어든다(예: /4 → /5 는 덜 기울임).
 * 부호·`BOOK_ROT_Y`로 속지가 카메라를 보도록 미세 조정. */
const BOOK_ROT_X = +Math.PI / 4.4
const BOOK_ROT_Y = 0.05
const BOOK_ROT_Z = 0

/** Bounds `margin`: 1에 가까울수록 꽉 참. **줄이면 카메라가 더 가까이 붙어 책이 커 보임**(0.9~1.05 권장, 너무 낮으면 잘림). */
const BOOK_BOUNDS_MARGIN = 1.00

/** 위아래 떠 있는 느낌 최대 이동량(월드 단위). */
const FLOAT_AMP_Y = 0.045

/** Y축 흔들림 진폭(라디안). */
const SWAY_AMP_Y = 0.085

/** X축 미세 끄덕임 진폭(라디안) — 책장이 들렸다 가라앉는 느낌. */
const TILT_AMP_X = 0.025

/** sin 인자에 곱하는 “속도” 계수 — 커질수록 같은 시간에 더 빠르게 진동. */
const FLOAT_FREQ = 0.85
const SWAY_FREQ = 0.5
const TILT_FREQ = 0.6

function HunminBook() {
  const gltf = useGLTF(MODEL_PATH) as unknown as GLTF
  const ref = useRef<THREE.Group>(null)

  /* scene 자체를 매번 변형하지 않도록 한 번 clone. envMap 강도만 살짝 낮춰
   * 무광 한지 느낌을 살린다. material 자체 교체 없음(=속지 텍스처 보존). */
  const root = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      const apply = (mat: THREE.Material) => {
        const std = mat as THREE.MeshStandardMaterial
        if ('envMapIntensity' in std) std.envMapIntensity = 0.7
      }
      if (Array.isArray(mesh.material)) mesh.material.forEach(apply)
      else if (mesh.material) apply(mesh.material)
    })
    return cloned
  }, [gltf])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = Math.sin(t * FLOAT_FREQ) * FLOAT_AMP_Y
    ref.current.rotation.y = BOOK_ROT_Y + Math.sin(t * SWAY_FREQ) * SWAY_AMP_Y
    ref.current.rotation.x = BOOK_ROT_X + Math.sin(t * TILT_FREQ + 0.6) * TILT_AMP_X
  })

  return (
    <group
      ref={ref}
      rotation={[BOOK_ROT_X, BOOK_ROT_Y, BOOK_ROT_Z]}
    >
      <primitive object={root} />
    </group>
  )
}

interface HunminBookViewerProps {
  className?: string
}

export function HunminBookViewer({ className }: HunminBookViewerProps) {
  return (
    <div className={className}>
      <Canvas
        /* 정면에서 살짝 위로 — 펼친 면을 내려다보는 듯한 시점.
         * fov 28 정도면 perspective 왜곡이 약해 책장이 평평하게 보임. */
        camera={{ position: [0, 0.35, 2.1], fov: 28 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        style={{ background: 'transparent' }}
      >
        {/* 한지 위에 떠 있는 듯한 부드러운 광원 — 종이의 미세한 광택 표현 */}
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#fff8eb', '#c7b890', 0.45]} />
        <directionalLight position={[3, 4, 5]} intensity={0.95} />
        <directionalLight position={[-3, 2, -2]} intensity={0.35} />
        <Suspense fallback={null}>
          <Bounds fit clip margin={BOOK_BOUNDS_MARGIN}>
            <HunminBook />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  )
}
