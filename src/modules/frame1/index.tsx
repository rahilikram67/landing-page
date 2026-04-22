import { useEffect, useRef, useState } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

// [assetKey, xf, yf, wf] — fractions of sw/sh; height from texture aspect ratio
const CHIPS: [string, number, number, number][] = [
  [ASSETS.rewriteChip,     0.5659, 0.6267, 0.1712],
  [ASSETS.summarizeChip,   0.4884, 0.2318, 0.1159],
  [ASSETS.reportChip,      0.6891, 0.5400, 0.2047],
  [ASSETS.organizeChip,    0.1374, 0.6314, 0.2305],
  [ASSETS.error404Chip,    0.6264, 0.2053, 0.1134],
  [ASSETS.howToWriteChip,  0.2324, 0.0944, 0.2270],
  [ASSETS.explainCodeChip, 0.4183, 0.7044, 0.1565],
  [ASSETS.diffMlAiChip,    0.0877, 0.1500, 0.1916],
]

// Circle initial → end-state fractions (Figma: 21599-97575/76/77 → 21599-97937/38/39)
const CIRCLES_INIT = [
  { wf: 0.8576, xf: 0.0720, yf: -0.1544 },
  { wf: 0.7267, xf: 0.1374, yf: -0.0544 },
  { wf: 0.5814, xf: 0.2093, yf:  0.0556 },
]
const CIRCLES_END = [
  { wf: 0.6919, xf: 0.1541, yf: -0.0278 },
  { wf: 0.5843, xf: 0.2072, yf:  0.0533 },
  { wf: 0.4709, xf: 0.2653, yf:  0.1422 },
]

// dead-burnout text rect — Figma 21599-97950: x=334, y=334, w=708, h=232 in 1376×900
const DEAD = { l: 0.2428, r: 0.7574, t: 0.3711, b: 0.6289 }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/**
 * Return the position where a chip (xf,yf,wf,hf) should stop so its nearest
 * edge just grazes the dead-burnout rect border — it never enters inside.
 */
function chipBorderTarget(
  xf: number, yf: number, wf: number, hf: number,
): { xf: number; yf: number } {
  const chipCX = xf + wf / 2
  const chipCY = yf + hf / 2
  const deadCX = (DEAD.l + DEAD.r) / 2
  const deadCY = (DEAD.t + DEAD.b) / 2
  const dx = chipCX - deadCX
  const dy = chipCY - deadCY
  const deadAspect = (DEAD.b - DEAD.t) / (DEAD.r - DEAD.l)

  let target: { xf: number; yf: number }
  if (Math.abs(dx) < 0.001 || Math.abs(dy / dx) >= deadAspect) {
    // approach from top or bottom
    target = dy < 0
      ? { xf, yf: DEAD.t - hf }  // chip above → bottom edge touches DEAD.top
      : { xf, yf: DEAD.b }       // chip below → top edge touches DEAD.bottom
  } else {
    // approach from left or right
    target = dx < 0
      ? { xf: DEAD.l - wf, yf }  // chip left  → right edge touches DEAD.left
      : { xf: DEAD.r,      yf }  // chip right → left  edge touches DEAD.right
  }

  // If target is farther from dead center than initial, the chip would move
  // away from the text — keep it in place instead
  const tCX = target.xf + wf / 2
  const tCY = target.yf + hf / 2
  const initDist2 = dx * dx + dy * dy
  const targDist2 = (tCX - deadCX) ** 2 + (tCY - deadCY) ** 2
  if (targDist2 > initDist2 + 1e-6) return { xf, yf }

  return target
}

function Frame1Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()

  const proxy = useRef({
    blur2Alpha: 0,
    textAlpha:  1,
    deadAlpha:  0,
    chipProg:   0,
    circProg:   0,
  })

  const [blur2Alpha,  setBlur2Alpha]  = useState(0)
  
  const [textAlpha,   setTextAlpha]   = useState(1)
  const [deadAlpha,   setDeadAlpha]   = useState(0)
  const [chipProg,    setChipProg]    = useState(0)
  const [circProg,    setCircProg]    = useState(0)

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    // blur2: fade in + drift top-right → bottom-left
    timeline.to(p, {
      blur2Alpha: 1, blur2DXF: -0.3, blur2DYF: 0.25,
      duration: 2.0,
      ease: "power1.inOut",
      onUpdate() {
        setBlur2Alpha(p.blur2Alpha)
      },
    }, ">")

    // every/mill texts fade out (concurrent)
    timeline.to(p, {
      textAlpha: 0,
      duration: 1.0,
      ease: "power1.in",
      onUpdate() { setTextAlpha(p.textAlpha) },
    }, "<")

    // circles shrink (concurrent)
    timeline.to(p, {
      circProg: 1,
      duration: 1.5,
      ease: "power1.inOut",
      onUpdate() { setCircProg(p.circProg) },
    }, "<")

    // dead-burnout text fades in
    timeline.to(p, {
      deadAlpha: 1,
      duration: 1.0,
      ease: "power1.out",
      onUpdate() { setDeadAlpha(p.deadAlpha) },
    }, ">-0.8")

    // chips + cards converge to border (concurrent with dead text)
    timeline.to(p, {
      chipProg: 1,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate() { setChipProg(p.chipProg) },
    }, "<")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height

  // background blurs
  const blurLTex = Assets.get(ASSETS.bg1BlurLeft)
  const blurRTex = Assets.get(ASSETS.bg1BlurRight)
  const blurLW = blurLTex.width * (sh / blurLTex.height)
  const blurRW = blurRTex.width * (sh / blurRTex.height)

  // top-right-blur2 — drifts left + down
  const blur2Tex = Assets.get(ASSETS.topRightBlur2)
  const blur2W = sw
  const blur2H = (blur2Tex.height / blur2Tex.width) * blur2W

  // circles — lerp from initial to end-state
  const circleTex = Assets.get(ASSETS.circle)
  const circles = CIRCLES_INIT.map((init, i) => {
    const end = CIRCLES_END[i]
    return {
      size: sw * lerp(init.wf, end.wf, circProg),
      x:    sw * lerp(init.xf, end.xf, circProg),
      y:    sh * lerp(init.yf, end.yf, circProg),
    }
  })

  // "every second" / "millions gone" — fade out
  const everyTex = Assets.get(ASSETS.everySecondText)
  const everyW = sw * 0.8111
  const everyH = (everyTex.height / everyTex.width) * everyW
  const everyX = (sw - everyW) / 2 + sw * 0.0116
  const everyY = sh * 0.3078

  const millTex = Assets.get(ASSETS.millionsGoneText)
  const millW = sw * 0.8111
  const millH = (millTex.height / millTex.width) * millW
  const millX = (sw - millW) / 2 + sw * 0.0116
  const millY = sh * 0.4867

  // dead-burnout-fades text — fades in
  const deadTex = Assets.get(ASSETS.deadBurnoutFades)
  const deadW = sw * 0.5146
  const deadH = (deadTex.height / deadTex.width) * deadW

  // inbox card — converges to DEAD border
  const inboxTex = Assets.get(ASSETS.inboxAlertChip)
  const inboxWf = 0.1787
  const inboxHf = (inboxTex.height / inboxTex.width) * inboxWf * (sw / sh)
  const inboxInitXf = 0.0313
  const inboxInitYf = 0.4311
  const inboxTgt = chipBorderTarget(inboxInitXf, inboxInitYf, inboxWf, inboxHf)
  const inboxW = sw * inboxWf
  const inboxH = (inboxTex.height / inboxTex.width) * inboxW
  const inboxX = sw * lerp(inboxInitXf, inboxTgt.xf, chipProg)
  const inboxY = sh * lerp(inboxInitYf, inboxTgt.yf, chipProg)

  // mails card — converges to DEAD border
  const mailsTex = Assets.get(ASSETS.mailsChip)
  const mailsWf = 0.1509
  const mailsHf = (mailsTex.height / mailsTex.width) * mailsWf * (sw / sh)
  const mailsInitXf = 0.8241
  const mailsInitYf = 0.1778
  const mailsTgt = chipBorderTarget(mailsInitXf, mailsInitYf, mailsWf, mailsHf)
  const mailsW = sw * mailsWf
  const mailsH = (mailsTex.height / mailsTex.width) * mailsW
  const mailsX = sw * lerp(mailsInitXf, mailsTgt.xf, chipProg)
  const mailsY = sh * lerp(mailsInitYf, mailsTgt.yf, chipProg)

  return (
    <pixiContainer>
      <pixiSprite texture={blurLTex} width={blurLW} height={sh} x={0} y={0} />
      <pixiSprite texture={blurRTex} width={blurRW} height={sh} x={sw - blurRW} y={0} />

      {/* top-right-blur2: fades in, drifts top-right → bottom-left */}
      <pixiSprite texture={blur2Tex} width={blur2W} height={blur2H} alpha={blur2Alpha} />

      {/* every second / millions gone — fade out */}
      <pixiSprite texture={everyTex} width={everyW} height={everyH} x={everyX} y={everyY} blendMode="overlay" alpha={textAlpha} />
      <pixiSprite texture={millTex}  width={millW}  height={millH}  x={millX}  y={millY}  blendMode="overlay" alpha={textAlpha} />

      {/* dead-burnout-fades — fades in */}
      <pixiSprite texture={deadTex} width={deadW} height={deadH} x={sw * DEAD.l} y={sh * DEAD.t} alpha={deadAlpha} blendMode="overlay" />

      {/* circles — shrink toward end-state */}
      {circles.map(({ size, x, y }, i) => (
        <pixiSprite key={i} texture={circleTex} width={size} height={size} x={x} y={y} />
      ))}

      {/* cards — converge to dead-burnout text border */}
      <pixiSprite texture={inboxTex} width={inboxW} height={inboxH} x={inboxX} y={inboxY} />
      <pixiSprite texture={mailsTex} width={mailsW} height={mailsH} x={mailsX} y={mailsY} />

      {/* chips — converge to dead-burnout text border */}
      {CHIPS.map(([key, xf, yf, wf]) => {
        const tex = Assets.get(key)
        const w = sw * wf
        const h = (tex.height / tex.width) * w
        const hf = h / sh
        const tgt = chipBorderTarget(xf, yf, wf, hf)
        return (
          <pixiSprite
            key={key}
            texture={tex}
            width={w}
            height={h}
            x={sw * lerp(xf, tgt.xf, chipProg)}
            y={sh * lerp(yf, tgt.yf, chipProg)}
          />
        )
      })}
    </pixiContainer>
  )
}

export function Frame1({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return null
  return <Frame1Desktop timeline={timeline} />
}
