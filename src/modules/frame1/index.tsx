import { useEffect } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

// Figma reference frame: 1376 × 900
// [assetKey, xf, yf, wf]  — x/y/w as fractions of screen width; height derived from texture aspect ratio
const CHIPS: [string, number, number, number][] = [
  [ASSETS.rewriteChip,      778.64 / 1376, 564    / 900, 235.621 / 1376],
  [ASSETS.summarizeChip,    672    / 1376, 208.61 / 900, 159.5   / 1376],
  [ASSETS.reportChip,       948.22 / 1376, 486    / 900, 281.644 / 1376],
  [ASSETS.organizeChip,     189    / 1376, 568.28 / 900, 317.175 / 1376],
  [ASSETS.error404Chip,     862    / 1376, 184.73 / 900, 155.997 / 1376],
  [ASSETS.howToWriteChip,   319.76 / 1376, 85     / 900, 312.362 / 1376],
  [ASSETS.explainCodeChip,  575.56 / 1376, 634    / 900, 215.378 / 1376],
  [ASSETS.diffMlAiChip,     120.7  / 1376, 135    / 900, 263.584 / 1376],
]

function Frame1Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  


  useEffect(() => {
    if (!timeline || !app.renderer) return
    
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height


  const circleTex = Assets.get(ASSETS.circle)
  const circleSize = sw * (1180 / 1376)
  const circleX = (sw - circleSize) / 2
  const circleY = (sh - circleSize) / 2

  const inboxTex = Assets.get(ASSETS.inboxAlertChip)
  const inboxW = sw * (245.885 / 1376)
  const inboxH = (inboxTex.height / inboxTex.width) * inboxW
  const inboxX = sw * (43 / 1376)
  const inboxY = sh * (388 / 900)

  const mailsTex = Assets.get(ASSETS.mailsChip)
  const mailsW = sw * (207.636 / 1376)
  const mailsH = (mailsTex.height / mailsTex.width) * mailsW
  const mailsX = sw * (1134 / 1376)
  const mailsY = sh * (160 / 900)


  const bg1Tex = Assets.get(ASSETS.bg1)

  return (
    <pixiContainer>
      <pixiSprite texture={bg1Tex} width={sw} height={sh} x={0} y={0} />

      {/* Circles */}
      <pixiSprite texture={circleTex} width={circleSize} height={circleSize} x={circleX} y={circleY} />

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
