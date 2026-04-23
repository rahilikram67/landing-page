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

// Circle diameter fractions — all three circles are concentric with the screen centre.
// xf/yf from Figma only hold at 1376×900; centre-pin is the only correct approach.
const CIRCLES_INIT_WF = [0.8576, 0.7267, 0.5814]
const CIRCLES_END_WF  = [0.6919, 0.5843, 0.4709]

type DeadRect = { l: number; r: number; t: number; b: number }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// Fraction of chip dimension that overlaps with the dead-burnout rect at rest.
const CHIP_OVERLAP = 0.25

/**
 * Trace the chip center along the line toward the dead-text center and stop it
 * at the boundary where CHIP_OVERLAP fraction of the chip overlaps the dead rect.
 * Works for any approach direction including diagonal (e.g. upper-right mails card).
 * If the chip center is already inside that boundary it is left in place.
 */
function chipBorderTarget(
  xf: number, yf: number, wf: number, hf: number,
  dead: DeadRect,
): { xf: number; yf: number } {
  const hw = wf / 2
  const hh = hf / 2
  const chipCX = xf + hw
  const chipCY = yf + hh
  const deadCX = (dead.l + dead.r) / 2
  const deadCY = (dead.t + dead.b) / 2

  // "Stop boundary" for the chip center: chip overlaps dead rect by CHIP_OVERLAP
  const stop = {
    l: dead.l - hw + wf * CHIP_OVERLAP,
    r: dead.r + hw - wf * CHIP_OVERLAP,
    t: dead.t - hh + hf * CHIP_OVERLAP,
    b: dead.b + hh - hf * CHIP_OVERLAP,
  }

  // Already inside the stop boundary — no movement needed
  if (chipCX >= stop.l && chipCX <= stop.r && chipCY >= stop.t && chipCY <= stop.b) {
    return { xf, yf }
  }

  const dx = deadCX - chipCX
  const dy = deadCY - chipCY
  let tMin = 1 // capped at dead center (always inside stop boundary)

  if (Math.abs(dy) > 1e-9) {
    const tT = (stop.t - chipCY) / dy
    if (tT > 1e-9 && tT < tMin) {
      const ix = chipCX + tT * dx
      if (ix >= stop.l && ix <= stop.r) tMin = tT
    }
    const tB = (stop.b - chipCY) / dy
    if (tB > 1e-9 && tB < tMin) {
      const ix = chipCX + tB * dx
      if (ix >= stop.l && ix <= stop.r) tMin = tB
    }
  }
  if (Math.abs(dx) > 1e-9) {
    const tL = (stop.l - chipCX) / dx
    if (tL > 1e-9 && tL < tMin) {
      const iy = chipCY + tL * dy
      if (iy >= stop.t && iy <= stop.b) tMin = tL
    }
    const tR = (stop.r - chipCX) / dx
    if (tR > 1e-9 && tR < tMin) {
      const iy = chipCY + tR * dy
      if (iy >= stop.t && iy <= stop.b) tMin = tR
    }
  }

  return {
    xf: chipCX + tMin * dx - hw,
    yf: chipCY + tMin * dy - hh,
  }
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
  

  // circles — always centred at screen centre, diameter lerps init → end
  const circleTex = Assets.get(ASSETS.circle)
  const circles = CIRCLES_INIT_WF.map((initWf, i) => {
    const size = sw * lerp(initWf, CIRCLES_END_WF[i], circProg)
    return { size, x: sw / 2 - size / 2, y: sh / 2 - size / 2 }
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
  const deadWf = 0.5146
  const deadXf = 0.2428
  const deadYf = 0.3711
  const deadW = sw * deadWf
  const deadH = (deadTex.height / deadTex.width) * deadW
  // rect fully derived from live sw/sh — no static reference dimensions
  const dead: DeadRect = {
    l: deadXf,
    r: deadXf + deadWf,
    t: deadYf,
    b: deadYf + deadH / sh,
  }

  // inbox card — converges to dead border
  const inboxTex = Assets.get(ASSETS.inboxAlertChip)
  const inboxWf = 0.1787
  const inboxHf = (inboxTex.height / inboxTex.width) * inboxWf * (sw / sh)
  const inboxInitXf = 0.0313
  const inboxInitYf = 0.4311
  const inboxTgt = chipBorderTarget(inboxInitXf, inboxInitYf, inboxWf, inboxHf, dead)
  const inboxW = sw * inboxWf
  const inboxH = (inboxTex.height / inboxTex.width) * inboxW
  const inboxX = sw * lerp(inboxInitXf, inboxTgt.xf, chipProg)
  const inboxY = sh * lerp(inboxInitYf, inboxTgt.yf, chipProg)

  // mails card — converges to dead border
  const mailsTex = Assets.get(ASSETS.mailsChip)
  const mailsWf = 0.1509
  const mailsHf = (mailsTex.height / mailsTex.width) * mailsWf * (sw / sh)
  const mailsInitXf = 0.8241
  const mailsInitYf = 0.1778
  const mailsTgt = chipBorderTarget(mailsInitXf, mailsInitYf, mailsWf, mailsHf, dead)
  const mailsW = sw * mailsWf
  const mailsH = (mailsTex.height / mailsTex.width) * mailsW
  const mailsX = sw * lerp(mailsInitXf, mailsTgt.xf, chipProg)
  const mailsY = sh * lerp(mailsInitYf, mailsTgt.yf, chipProg)

  return (
    <pixiContainer>
      <pixiSprite texture={blurLTex} width={blurLW} height={sh} x={0} y={0} />
      <pixiSprite texture={blurRTex} width={blurRW} height={sh} x={sw - blurRW} y={0} />

      {/* top-right-blur2: fades in, drifts top-right → bottom-left */}
      <pixiSprite texture={blur2Tex} width={sw} height={sh} alpha={blur2Alpha} />

      {/* every second / millions gone — fade out */}
      <pixiSprite texture={everyTex} width={everyW} height={everyH} x={everyX} y={everyY} blendMode="overlay" alpha={textAlpha} />
      <pixiSprite texture={millTex}  width={millW}  height={millH}  x={millX}  y={millY}  blendMode="overlay" alpha={textAlpha} />

      {/* dead-burnout-fades — fades in */}
      {/* two stacked overlay passes for better legibility without removing blendMode */}
      <pixiSprite texture={deadTex} width={deadW} height={deadH} x={sw * dead.l} y={sh * dead.t} alpha={deadAlpha} blendMode="overlay" />
      <pixiSprite texture={deadTex} width={deadW} height={deadH} x={sw * dead.l} y={sh * dead.t} alpha={deadAlpha} blendMode="overlay" />

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
        const tgt = chipBorderTarget(xf, yf, wf, hf, dead)
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
