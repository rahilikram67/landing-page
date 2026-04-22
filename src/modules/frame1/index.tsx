import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

// Figma reference frame: 1376 × 900
// [assetKey, xf, yf, wf, hf]  — all as fractions of container (1376×900 reference)
const CHIPS: [string, number, number, number, number][] = [
  [ASSETS.rewriteChip, 778.64 / 1376, 564 / 900, 235.621 / 1376, 152.426 / 900],
  [ASSETS.summarizeChip, 672 / 1376, 208.61 / 900, 159.5 / 1376, 107.933 / 900],
  [ASSETS.reportChip, 948.22 / 1376, 486 / 900, 281.644 / 1376, 154.365 / 900],
  [ASSETS.organizeChip, 189 / 1376, 568.28 / 900, 317.175 / 1376, 153.127 / 900],
  [ASSETS.error404Chip, 862 / 1376, 184.73 / 900, 155.997 / 1376, 111.496 / 900],
  [ASSETS.howToWriteChip, 319.76 / 1376, 85 / 900, 312.362 / 1376, 198.737 / 900],
  [ASSETS.explainCodeChip, 575.56 / 1376, 634 / 900, 215.378 / 1376, 111.163 / 900],
  [ASSETS.diffMlAiChip, 120.7 / 1376, 135 / 900, 263.584 / 1376, 169.658 / 900],
]

function Frame1Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)


  useEffect(() => {
    if (!timeline || !app.renderer) return
    // const p = proxy.current

    // timeline.to(p, { bgAlpha: 1, duration: 1.2, ease: "power1.out", onUpdate: forceRender }, ">")
    // timeline.to(p, { cardAlpha: 1, duration: 1.0, ease: "power1.out", onUpdate: forceRender }, ">-0.5")
    // timeline.to(p, { textAlpha: 1, duration: 1.0, ease: "power1.out", onUpdate: forceRender }, ">-0.3")
    // timeline.to(p, { chipAlpha: 1, duration: 1.2, ease: "power1.out", onUpdate: forceRender }, ">-0.4")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  // const p = proxy.current

  // Blur backgrounds — scale to fill full height, width proportional
  const blurLTex = Assets.get(ASSETS.bg1BlurLeft)
  const blurRTex = Assets.get(ASSETS.bg1BlurRight)
  const blurLW = blurLTex.width * (sh / blurLTex.height)
  const blurRW = blurRTex.width * (sh / blurRTex.height)

  // Circles — centered, 85.75% of container width (1180/1376)
  const circleTex = Assets.get(ASSETS.circle)
  const circleSize = sw * 0.8575
  const circleX = (sw - circleSize) / 2
  const circleY = (sh - circleSize) / 2

  // Left card — xf=43/1376, yf=388/900, wf=245.885/1376
  const inboxTex = Assets.get(ASSETS.inboxAlertChip)
  const inboxW = sw * 0.1787
  const inboxH = inboxTex.height / inboxTex.width * inboxW
  const inboxX = sw * 0.0313
  const inboxY = sh * 0.4311

  // Right card — xf=1134/1376, yf=160/900, wf=207.636/1376
  const mailsTex = Assets.get(ASSETS.mailsChip)
  const mailsW = sw * 0.1509
  const mailsH = mailsTex.height / mailsTex.width * mailsW
  const mailsX = sw * 0.8241
  const mailsY = sh * 0.1778

  // Text line 1 — xf derived from calc(50%+16px - 50% of text), yf=277/900
  const everyTex = Assets.get(ASSETS.everySecondText)
  const everyW = sw * 0.8111
  const everyH = everyTex.height / everyTex.width * everyW
  const everyX = (sw - everyW) / 2 + sw * 0.0116
  const everyY = sh * 0.3078

  // Text line 2 — same x, yf=438/900
  const millTex = Assets.get(ASSETS.millionsGoneText)
  const millW = sw * 0.8111
  const millH = millTex.height / millTex.width * millW
  const millX = (sw - millW) / 2 + sw * 0.0116
  const millY = sh * 0.4867

  return (
    <pixiContainer>
      {/* Blurs */}

      
      <pixiSprite texture={blurLTex} width={blurLW} height={sh} x={0} y={0} />
      <pixiSprite texture={blurRTex} width={blurRW} height={sh} x={sw - blurRW} y={0} />
      
      <pixiSprite texture={everyTex} width={everyW} height={everyH} x={everyX} y={everyY} blendMode="overlay" />
      <pixiSprite texture={millTex}  width={millW}  height={millH}  x={millX}  y={millY}  blendMode="overlay" />



      {/* Circles */}
      <pixiSprite texture={circleTex} width={circleSize} height={circleSize} x={circleX} y={circleY} />

      {/* Cards */}
      <pixiSprite texture={inboxTex} width={inboxW} height={inboxH} x={inboxX} y={inboxY} />
      <pixiSprite texture={mailsTex} width={mailsW} height={mailsH} x={mailsX} y={mailsY} />


      




      {/* Central text */}

      {/* Floating chips — xf/yf/wf/hf already normalised in CHIPS array */}
      {CHIPS.map(([key, xf, yf, wf, hf]) => {
        const tex = Assets.get(key)
        const w = sw * wf
        const h = sh * hf
        return (
          <pixiSprite
            key={key}
            texture={tex}
            width={w}
            height={h}
            x={sw * xf}
            y={sh * yf}
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
