import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

// Figma reference frame: 1376 × 900
const REF_W = 1376
const REF_H = 900

// [assetKey, figma left, figma top, figma container width, figma container height]
const CHIPS: [string, number, number, number, number][] = [
  [ASSETS.rewriteChip,     778.64, 564,    235.621, 152.426],
  [ASSETS.summarizeChip,   672,    208.61, 159.5,   107.933],
  [ASSETS.reportChip,      948.22, 486,    281.644, 154.365],
  [ASSETS.organizeChip,    189,    568.28, 317.175, 153.127],
  [ASSETS.error404Chip,    862,    184.73, 155.997, 111.496],
  [ASSETS.howToWriteChip,  319.76, 85,     312.362, 198.737],
  [ASSETS.explainCodeChip, 575.56, 634,    215.378, 111.163],
  [ASSETS.diffMlAiChip,    120.7,  135,    263.584, 169.658],
]

function Frame1Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)
  const proxy = useRef({ bgAlpha: 0, cardAlpha: 0, textAlpha: 0, chipAlpha: 0 })

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    timeline.to(p, { bgAlpha:   1, duration: 1.2, ease: "power1.out", onUpdate: forceRender }, ">")
    timeline.to(p, { cardAlpha: 1, duration: 1.0, ease: "power1.out", onUpdate: forceRender }, ">-0.5")
    timeline.to(p, { textAlpha: 1, duration: 1.0, ease: "power1.out", onUpdate: forceRender }, ">-0.3")
    timeline.to(p, { chipAlpha: 1, duration: 1.2, ease: "power1.out", onUpdate: forceRender }, ">-0.4")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw  = app.screen.width
  const sh  = app.screen.height
  const p   = proxy.current
  const sc  = sw / REF_W   // horizontal scale
  const vc  = sh / REF_H   // vertical scale

  // ── Blur backgrounds ───────────────────────────────────────────────────────
  const blurLTex = Assets.get(ASSETS.bg1BlurLeft)
  const blurRTex = Assets.get(ASSETS.bg1BlurRight)
  // Scale each blur to fill the full screen height; width scales proportionally
  const blurLH   = sh
  const blurLW   = blurLTex.width * (blurLH / blurLTex.height)
  const blurRH   = sh
  const blurRW   = blurRTex.width * (blurRH / blurRTex.height)

  // ── Circles ────────────────────────────────────────────────────────────────
  // Figma: size-[1180px] centered; circle.svg is 707×707
  const circleTex  = Assets.get(ASSETS.circle)
  const circleSize = sw * (1180 / REF_W)
  const circleX    = (sw - circleSize) / 2
  const circleY    = (sh - circleSize) / 2

  // ── Left card: inbox-alert-chip.svg (246×246) ──────────────────────────────
  // Figma: left=43, top=388, container-size=245.885
  const inboxTex = Assets.get(ASSETS.inboxAlertChip)
  const inboxW   = inboxTex.width  * sc
  const inboxH   = inboxTex.height * sc
  const inboxX   = 43  * sc
  const inboxY   = 388 * vc

  // ── Right card: mails-chip.svg (208×208) ───────────────────────────────────
  // Figma: left=1134, top=160, container-size=207.636
  const mailsTex = Assets.get(ASSETS.mailsChip)
  const mailsW   = mailsTex.width  * sc
  const mailsH   = mailsTex.height * sc
  const mailsX   = 1134 * sc
  const mailsY   = 160  * vc

  // ── Text line 1: every-second-google-text.svg (1116×146) ──────────────────
  // Figma: left=calc(50%+16px) translated -50%, top=calc(50%-173px)
  const everyTex = Assets.get(ASSETS.everySecondText)
  const everyW   = everyTex.width  * sc
  const everyH   = everyTex.height * sc
  const everyX   = sw / 2 + 16 * sc - everyW / 2
  const everyY   = sh / 2 - 173 * vc

  // ── Text line 2: millions-gone-text.svg (1116×146) ────────────────────────
  // Figma: left=calc(50%+16px) translated -50%, top=calc(50%-12px)
  const millTex  = Assets.get(ASSETS.millionsGoneText)
  const millW    = millTex.width  * sc
  const millH    = millTex.height * sc
  const millX    = sw / 2 + 16 * sc - millW / 2
  const millY    = sh / 2 - 12 * vc

  return (
    <pixiContainer>
      {/* Blurs */}
      <pixiSprite texture={blurLTex} width={blurLW} height={blurLH} x={0}           y={0} alpha={p.bgAlpha} />
      <pixiSprite texture={blurRTex} width={blurRW} height={blurRH} x={sw - blurRW} y={0} alpha={p.bgAlpha} />

      {/* Circles */}
      <pixiSprite texture={circleTex} width={circleSize} height={circleSize} x={circleX} y={circleY} alpha={p.bgAlpha} />

      {/* Cards */}
      <pixiSprite texture={inboxTex} width={inboxW} height={inboxH} x={inboxX} y={inboxY} alpha={p.cardAlpha} />
      <pixiSprite texture={mailsTex} width={mailsW} height={mailsH} x={mailsX} y={mailsY} alpha={p.cardAlpha} />

      {/* Central text */}
      <pixiSprite texture={everyTex} width={everyW} height={everyH} x={everyX} y={everyY} alpha={p.textAlpha} blendMode="overlay" />
      <pixiSprite texture={millTex}  width={millW}  height={millH}  x={millX}  y={millY}  alpha={p.textAlpha} blendMode="overlay" />

      {/* Floating chips */}
      {CHIPS.map(([key, figLeft, figTop, figFW, figFH]) => {
        const tex = Assets.get(key)
        const w   = figFW * sc
        const h   = figFH * vc
        return (
          <pixiSprite
            key={key}
            texture={tex}
            width={w}
            height={h}
            x={figLeft * sc}
            y={figTop  * vc}
            alpha={p.chipAlpha}
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
