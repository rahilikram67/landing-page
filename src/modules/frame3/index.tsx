import { useEffect, useRef, useState } from "react"
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

  const proxy = useRef({
    sliderProg:    0,
    bgBlur3Alpha:  0,
    bgBlur32Alpha: 0,
  })

  const [sliderProg,    setSliderProg]    = useState(0)
  const [bgBlur3Alpha,  setBgBlur3Alpha]  = useState(0)
  const [bgBlur32Alpha, setBgBlur32Alpha] = useState(0)

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    // Main slider: all 4 cards scroll right → left
    timeline.to(p, {
      sliderProg: 1,
      duration: 3.5,
      ease: "none",
      onUpdate() { setSliderProg(p.sliderProg) },
    }, ">")

    // bg-blur-f3 fades in at mid-slider (~45% = 1.575 s from slider start)
    timeline.to(p, {
      bgBlur3Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate() { setBgBlur3Alpha(p.bgBlur3Alpha) },
    }, "<1.575")

    // bg-blur-f3-2 fades in near end (~85% = 2.975 s from slider start)
    // "<" here refers to bgBlur3 start (1.575), so +1.4 → 2.975
    timeline.to(p, {
      bgBlur32Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate() { setBgBlur32Alpha(p.bgBlur32Alpha) },
    }, "<1.4")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height

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

  const stripX  = lerp(stripStartX, stripEndX, sliderProg)
  const cardY   = (sh - sh * CARD_HF) / 2

  return (
    <pixiContainer>
      {/* background blurs fade in during the slide */}
      <pixiSprite texture={bgBlur3Tex}  width={sw} height={sh} alpha={bgBlur3Alpha}  />
      <pixiSprite texture={bgBlur32Tex} width={sw} height={sh} alpha={bgBlur32Alpha} />

      {/* card strip — slides right → left */}
      {cards.map(({ tex, w, h }, i) => {
        const xOffset = cards.slice(0, i).reduce((acc, c) => acc + c.w + cardGap, 0)
        return (
          <pixiSprite
            key={i}
            texture={tex}
            width={w}
            height={h}
            x={stripX + xOffset}
            y={cardY}
          />
        )
      })}
    </pixiContainer>
  )
}

export function Frame3({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return null
  return <Frame3Desktop timeline={timeline} />
}
