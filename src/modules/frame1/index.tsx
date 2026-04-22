import { useEffect } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

// [assetKey, xf, yf, wf]  — all fractions of sw/sh; height derived from texture aspect ratio
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

function Frame1Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()



  useEffect(() => {
    if (!timeline || !app.renderer) return

  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height


  // Three concentric circles — Figma nodes 21599-97575/97576/97577
  const circleTex = Assets.get(ASSETS.circle)
  const circles = [
    { wf: 0.8576, xf: 0.0720, yf: -0.1544 },
    { wf: 0.7267, xf: 0.1374, yf: -0.0544 },
    { wf: 0.5814, xf: 0.2093, yf:  0.0556 },
  ].map(({ wf, xf, yf }) => ({ size: sw * wf, x: sw * xf, y: sh * yf }))

  const inboxTex = Assets.get(ASSETS.inboxAlertChip)
  const inboxW = sw * 0.1787
  const inboxH = (inboxTex.height / inboxTex.width) * inboxW
  const inboxX = sw * 0.0313
  const inboxY = sh * 0.4311

  const mailsTex = Assets.get(ASSETS.mailsChip)
  const mailsW = sw * 0.1509
  const mailsH = (mailsTex.height / mailsTex.width) * mailsW
  const mailsX = sw * 0.8241
  const mailsY = sh * 0.1778


  // Blur backgrounds — scale to fill full height, width proportional
  const blurLTex = Assets.get(ASSETS.bg1BlurLeft)
  const blurRTex = Assets.get(ASSETS.bg1BlurRight)
  const blurLW = blurLTex.width * (sh / blurLTex.height)
  const blurRW = blurRTex.width * (sh / blurRTex.height)

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


  const bg1Tex = Assets.get(ASSETS.bg1)

  return (
    <pixiContainer>
      <pixiSprite texture={blurLTex} width={blurLW} height={sh} x={0} y={0} />
      <pixiSprite texture={blurRTex} width={blurRW} height={sh} x={sw - blurRW} y={0} />
      <pixiSprite texture={everyTex} width={everyW} height={everyH} x={everyX} y={everyY} alpha={0.5} blendMode="overlay" />
      <pixiSprite texture={millTex}  width={millW}  height={millH}  x={millX}  y={millY} alpha={0.5}  blendMode="overlay" /> 
      

      {/* Circles */}

      {circles.map(({ size, x, y }, i) => (
        <pixiSprite key={i} texture={circleTex} width={size} height={size} x={x} y={y} />
      ))}
      {/* Cards */}
      <pixiSprite texture={inboxTex} width={inboxW} height={inboxH} x={inboxX} y={inboxY} />
      <pixiSprite texture={mailsTex} width={mailsW} height={mailsH} x={mailsX} y={mailsY} />


     







      {/* Central text */}

      {/* Floating chips — positions/widths are fractions of screen; height from texture aspect ratio */}
      {CHIPS.map(([key, xf, yf, wf]) => {
        const tex = Assets.get(key)
        const w = sw * wf
        const h = (tex.height / tex.width) * w
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
