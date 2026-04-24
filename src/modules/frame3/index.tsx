import { useEffect, useRef, useReducer } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// Slider card order: right → left
const CARD_KEYS = [
  ASSETS.studentLaptop,
  ASSETS.studentLaptop2,
  ASSETS.designer,
  ASSETS.marketing,
] as const

// Cards are rendered at 82% of screen height; width follows texture aspect ratio
const CARD_HF = 0.82

function Frame3Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({
    sliderProg:    0,
    bgBlur3Alpha:  0,
    bgBlur32Alpha: 0,
  })

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    // Main slider: all 4 cards scroll right → left
    timeline.to(p, {
      sliderProg: 1,
      duration: 3.5,
      ease: "none",
      onUpdate: forceRender,
    }, ">")

    // bg-blur-f3 fades in at mid-slider (~45% = 1.575 s from slider start)
    timeline.to(p, {
      bgBlur3Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate: forceRender,
    }, "<1.575")

    // bg-blur-f3-2 fades in near end (~85% = 2.975 s from slider start)
    // "<" here refers to bgBlur3 start (1.575), so +1.4 → 2.975
    timeline.to(p, {
      bgBlur32Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate: forceRender,
    }, "<1.4")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const bgBlur3Tex  = Assets.get(ASSETS.bgBlurF3)
  const bgBlur32Tex = Assets.get(ASSETS.bgBlurF32)

  // Gap between cards as a fraction of sw (Figma: 32 / 1376 ≈ 0.023)
  const cardGap = sw * 0.025

  // Cards: height = 82% of sh, width from texture aspect ratio
  const cards = CARD_KEYS.map(key => {
    const tex = Assets.get(key)
    const h = sh * CARD_HF
    const w = (tex.width / tex.height) * h
    return { tex, w, h }
  })

  // Strip x: lerp from fully off-screen right → fully off-screen left
  const stripStartX = sw
  const totalStripW = cards.reduce((acc, c) => acc + c.w, 0) + cardGap * (cards.length - 1)
  const stripEndX   = -totalStripW
  const stripX      = lerp(stripStartX, stripEndX, p.sliderProg)
  const cardY       = (sh - sh * CARD_HF) / 2

  // Pre-compute cumulative x-offsets to avoid O(n²) slice+reduce inside map
  const xOffsets = cards.map((_, i) =>
    cards.slice(0, i).reduce((acc, c) => acc + c.w + cardGap, 0)
  )

  return (
    <pixiContainer>
      {/* background blurs fade in during the slide */}
      <pixiSprite texture={bgBlur3Tex}  width={sw} height={sh} alpha={p.bgBlur3Alpha}  />
      <pixiSprite texture={bgBlur32Tex} width={sw} height={sh} alpha={p.bgBlur32Alpha} />

      {/* card strip — slides right → left */}
      {cards.map(({ tex, w, h }, i) => (
        <pixiSprite
          key={i}
          texture={tex}
          width={w}
          height={h}
          x={stripX + xOffsets[i]}
          y={cardY}
        />
      ))}
    </pixiContainer>
  )
}

// ─── Mobile: cards slide bottom → top ────────────────────────────────────────

// Cards fill 88% of screen width on mobile; height from texture aspect ratio
const CARD_WF_M = 0.88

function Frame3Mobile({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({
    sliderProg:    0,
    bgBlur3Alpha:  0,
    bgBlur32Alpha: 0,
  })

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    timeline.to(p, {
      sliderProg: 1,
      duration: 3.5,
      ease: "none",
      onUpdate: forceRender,
    }, ">")

    timeline.to(p, {
      bgBlur3Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate: forceRender,
    }, "<1.575")

    timeline.to(p, {
      bgBlur32Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate: forceRender,
    }, "<1.4")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const bgBlur3Tex  = Assets.get(ASSETS.bgBlurF3)
  const bgBlur32Tex = Assets.get(ASSETS.bgBlurF32)

  const cardGap = sh * 0.025

  // Cards: width = 88% of sw, height from texture aspect ratio
  const cards = CARD_KEYS.map(key => {
    const tex = Assets.get(key)
    const w = sw * CARD_WF_M
    const h = (tex.height / tex.width) * w
    return { tex, w, h }
  })

  const cardX = (sw - sw * CARD_WF_M) / 2  // horizontally centred

  // Strip y: lerp from fully off-screen bottom → fully off-screen top
  const stripStartY = sh
  const totalStripH = cards.reduce((acc, c) => acc + c.h, 0) + cardGap * (cards.length - 1)
  const stripEndY   = -totalStripH
  const stripY      = lerp(stripStartY, stripEndY, p.sliderProg)

  // Pre-compute cumulative y-offsets to avoid O(n²) slice+reduce inside map
  const yOffsets = cards.map((_, i) =>
    cards.slice(0, i).reduce((acc, c) => acc + c.h + cardGap, 0)
  )

  return (
    <pixiContainer>
      <pixiSprite texture={bgBlur3Tex}  width={sw} height={sh} alpha={p.bgBlur3Alpha}  />
      <pixiSprite texture={bgBlur32Tex} width={sw} height={sh} alpha={p.bgBlur32Alpha} />

      {cards.map(({ tex, w, h }, i) => (
        <pixiSprite
          key={i}
          texture={tex}
          width={w}
          height={h}
          x={cardX}
          y={stripY + yOffsets[i]}
        />
      ))}
    </pixiContainer>
  )
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function Frame3({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return <Frame3Mobile timeline={timeline} />
  return <Frame3Desktop timeline={timeline} />
}
