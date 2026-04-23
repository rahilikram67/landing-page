import { useEffect, useRef, useState } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

// [assetKey, xf, yf, wf] — fractions of sw/sh; height from texture aspect ratio
const CHIPS: [string, number, number, number][] = [
  [ASSETS.rewriteChip, 0.5659, 0.6867, 0.1712],
  [ASSETS.summarizeChip, 0.4884, 0.2318, 0.1159],
  [ASSETS.reportChip, 0.7091, 0.5400, 0.2047],
  [ASSETS.organizeChip, 0.1374, 0.6814, 0.2305],
  [ASSETS.error404Chip, 0.6264, 0.2053, 0.1134],
  [ASSETS.howToWriteChip, 0.2324, 0.0944, 0.2270],
  [ASSETS.explainCodeChip, 0.4183, 0.7044, 0.1565],
  [ASSETS.diffMlAiChip, 0.0877, 0.1500, 0.1916],
]

// Circle diameter fractions — all three circles are concentric with the screen centre.
// xf/yf from Figma only hold at 1376×900; centre-pin is the only correct approach.
const CIRCLES_INIT_WF = [0.8576, 0.7267, 0.5814]
const CIRCLES_END_WF = [0.6919, 0.5843, 0.4709]

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

function Frame12Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()

  const proxy = useRef({
    blur2Alpha: 0,
    textAlpha: 1,
    deadAlpha: 0,
    chipProg: 0,
    circProg: 0,
    bgBlur3Alpha: 0,
    whatIfAlpha: 0,
    whatIfExitProg: 0,
    chipOutProg: 0,
    circOutProg: 0,
  })

  const [blur2Alpha, setBlur2Alpha] = useState(0)
  const [textAlpha, setTextAlpha] = useState(1)
  const [deadAlpha, setDeadAlpha] = useState(0)
  const [chipProg, setChipProg] = useState(0)
  const [circProg, setCircProg] = useState(0)
  const [bgBlur3Alpha, setBgBlur3Alpha] = useState(0)
  const [whatIfAlpha, setWhatIfAlpha] = useState(0)
  const [whatIfExitProg, setWhatIfExitProg] = useState(0)
  const [chipOutProg, setChipOutProg] = useState(0)
  const [circOutProg, setCircOutProg] = useState(0)

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

    // --- exit phase ---

    // chips + cards fly outward in circular arcs
    timeline.to(p, {
      chipOutProg: 1,
      duration: 1.2,
      ease: "power2.in",
      onUpdate() { setChipOutProg(p.chipOutProg) },
    }, ">0.2")

    // circles expand off screen (concurrent)
    timeline.to(p, {
      circOutProg: 1,
      duration: 1.5,
      ease: "power1.in",
      onUpdate() { setCircOutProg(p.circOutProg) },
    }, "<")

    // dead text fades out (concurrent)
    timeline.to(p, {
      deadAlpha: 0,
      duration: 0.8,
      ease: "power1.in",
      onUpdate() { setDeadAlpha(p.deadAlpha) },
    }, "<")

    // bg-blur3 fades in
    timeline.to(p, {
      bgBlur3Alpha: 1,
      duration: 1.2,
      ease: "power1.out",
      onUpdate() { setBgBlur3Alpha(p.bgBlur3Alpha) },
    }, "<0.4")

    // what-if-better text fades in
    timeline.to(p, {
      whatIfAlpha: 1,
      duration: 1.0,
      ease: "power1.out",
      onUpdate() { setWhatIfAlpha(p.whatIfAlpha) },
    }, "<0.2")

    // what-if-better text drops down off frame after fully visible
    timeline.to(p, {
      whatIfExitProg: 1,
      duration: 1.0,
      ease: "power2.in",
      onUpdate() { setWhatIfExitProg(p.whatIfExitProg) },
    }, ">0.5")
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


  // circles — always centred at screen centre; shrink then expand off screen
  const circleTex = Assets.get(ASSETS.circle)
  const circles = CIRCLES_INIT_WF.map((initWf, i) => {
    const shrunkWf = lerp(initWf, CIRCLES_END_WF[i], circProg)
    const finalWf = lerp(shrunkWf, CIRCLES_INIT_WF[0] * 3, circOutProg)
    const size = sw * finalWf
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

  // dead-text centre in pixels (used for circular chip exit)
  const deadCX_px = sw * (dead.l + dead.r) / 2
  const deadCY_px = sh * (dead.t + dead.b) / 2

  // bg-blur3 + what-if-better text
  const bgBlur3Tex = Assets.get(ASSETS.bgBlur3)
  const whatIfTex = Assets.get(ASSETS.whatIfBetterText)
  const whatIfW = sw * deadWf
  const whatIfH = (whatIfTex.height / whatIfTex.width) * whatIfW
  const whatIfX = sw * deadXf
  const whatIfY = sh * deadYf

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

  /** Move a chip/card from its converged position outward in a circular arc. */
  function chipExitPos(tgtXf: number, tgtYf: number, wf: number, hf: number) {
    const tgtCX = sw * (tgtXf + wf / 2)
    const tgtCY = sh * (tgtYf + hf / 2)
    const angle = Math.atan2(tgtCY - deadCY_px, tgtCX - deadCX_px)
    const dist = Math.hypot(tgtCY - deadCY_px, tgtCX - deadCX_px)
    const curAngle = angle + chipOutProg * (Math.PI / 5)
    const curDist = dist + chipOutProg * Math.max(sw, sh) * 1.5
    return {
      x: deadCX_px + curDist * Math.cos(curAngle) - sw * wf / 2,
      y: deadCY_px + curDist * Math.sin(curAngle) - sh * hf / 2,
    }
  }

  return (
    <pixiContainer>
      <pixiSprite texture={blurLTex} width={blurLW} height={sh} x={0} y={0} />
      <pixiSprite texture={blurRTex} width={blurRW} height={sh} x={sw - blurRW} y={0} />

      {/* top-right-blur2: fades in */}
      <pixiSprite texture={blur2Tex} width={sw} height={sh} alpha={blur2Alpha} />

      {/* bg-blur3: fades in during exit phase */}
      <pixiSprite texture={bgBlur3Tex} width={sw} height={sh} alpha={bgBlur3Alpha} />

      {/* every second / millions gone — fade out */}
      <pixiSprite texture={everyTex} width={everyW} height={everyH} x={everyX} y={everyY} blendMode="overlay" alpha={textAlpha} />
      <pixiSprite texture={millTex} width={millW} height={millH} x={millX} y={millY} blendMode="overlay" alpha={textAlpha} />

      {/* dead-burnout-fades — two stacked overlay passes for legibility */}
      {[0, 1].map((i) => (
        <pixiSprite key={i} texture={deadTex} width={deadW} height={deadH}
          x={sw * dead.l} y={sh * dead.t} alpha={deadAlpha} blendMode="overlay" />
      ))}


      <pixiSprite texture={whatIfTex} width={whatIfW} height={whatIfH}
        x={whatIfX}
        y={lerp(whatIfY, sh + whatIfH, whatIfExitProg)}
        alpha={whatIfAlpha} blendMode="overlay" />

      {/* {[0, 1].map((i) => (
        <pixiSprite key={i} texture={whatIfTex} width={whatIfW} height={whatIfH}
          x={whatIfX}
          y={lerp(whatIfY, sh + whatIfH, whatIfExitProg)}
          alpha={whatIfAlpha} blendMode="overlay" />
      ))} */}


      {/* circles — shrink then expand off screen */}
      {circles.map(({ size, x, y }, i) => (
        <pixiSprite key={i} texture={circleTex} width={size} height={size} x={x} y={y} />
      ))}

      {/* cards — converge then exit */}
      {(() => {
        const inboxPos = chipOutProg > 0
          ? chipExitPos(inboxTgt.xf, inboxTgt.yf, inboxWf, inboxHf)
          : { x: inboxX, y: inboxY }
        const mailsPos = chipOutProg > 0
          ? chipExitPos(mailsTgt.xf, mailsTgt.yf, mailsWf, mailsHf)
          : { x: mailsX, y: mailsY }
        return (
          <>
            <pixiSprite texture={inboxTex} width={inboxW} height={inboxH} x={inboxPos.x} y={inboxPos.y} />
            <pixiSprite texture={mailsTex} width={mailsW} height={mailsH} x={mailsPos.x} y={mailsPos.y} />
          </>
        )
      })()}

      {/* chips — converge then exit in circular arcs */}
      {CHIPS.map(([key, xf, yf, wf]) => {
        const tex = Assets.get(key)
        const w = sw * wf
        const h = (tex.height / tex.width) * w
        const hf = h / sh
        const tgt = chipBorderTarget(xf, yf, wf, hf, dead)
        const pos = chipOutProg > 0
          ? chipExitPos(tgt.xf, tgt.yf, wf, hf)
          : { x: sw * lerp(xf, tgt.xf, chipProg), y: sh * lerp(yf, tgt.yf, chipProg) }
        return (
          <pixiSprite key={key} texture={tex} width={w} height={h} x={pos.x} y={pos.y} />
        )
      })}
    </pixiContainer>
  )
}

export function Frame12({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return null
  return <Frame12Desktop timeline={timeline} />
}
