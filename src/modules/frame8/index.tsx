import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

// Figma reference: 1376 × 900, content block 924 × 417 centered
// Content top y = (900 - 417) / 2 = 241.5
// Logo height = 201, gap = 5 → text top y = 447.5  (447.5/900 = 0.497)
// Text height (SVG) = 86 → buttons top y = 447.5 + 86 + 40 = 573.5  (573.5/900 = 0.637)
// Buttons centered in 924 px content; btn-explore w=151, gap=15.6, btn-teach w=150
// Buttons group left in frame = (1376-924)/2 + (924-316.6)/2 + 20.1 ≈ 539.7  (0.392)
// btn-teach left ≈ 539.7 + 151 + 15.6 = 706.3  (0.513)

const BTN_EXPLORE_URL = "/"
const BTN_TEACH_URL   = "/"

function Frame8Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({ bgAlpha: 0, contentAlpha: 0, btnAlpha: 0 })

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    timeline.to(p, {
      bgAlpha: 1,
      duration: 1.2,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">")

    timeline.to(p, {
      contentAlpha: 1,
      duration: 1.2,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">")

    timeline.to(p, {
      btnAlpha: 1,
      duration: 1.0,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p  = proxy.current

  // Background — cover scale
  const bgTex   = Assets.get(ASSETS.bg8)
  const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
  const bgW     = bgTex.width  * bgScale
  const bgH     = bgTex.height * bgScale
  const bgX     = (sw - bgW) / 2
  const bgY     = (sh - bgH) / 2

  // "Start exploring. / The future is already here" — SVG 525 × 86
  const textTex = Assets.get(ASSETS.startExploreText)
  const textW   = sw * 0.382
  const textH   = textTex.height / textTex.width * textW
  const textX   = (sw - textW) / 2
  const textY   = sh * 0.497

  // Buttons — SVG btn-explore 151 × 34, btn-teach 150 × 34
  const beTex  = Assets.get(ASSETS.btnExplore)
  const btTex  = Assets.get(ASSETS.btnTeach)

  const btnScale = sw / 1376            // scale linearly with viewport width
  const beW  = beTex.width  * btnScale
  const beH  = beTex.height * btnScale
  const btW  = btTex.width  * btnScale
  const btH  = btTex.height * btnScale
  const gap  = 15.636 * btnScale

  const btnGroupW = beW + gap + btW
  const btnX0     = (sw - btnGroupW) / 2  // center the pair
  const btnY      = sh * 0.637

  return (
    <pixiContainer>
       
      {/* Background */}
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />

      {/* Subtitle text */}
      <pixiSprite texture={textTex} width={textW} height={textH} x={textX} y={textY} alpha={p.contentAlpha} />

      {/* Buttons */}
      <pixiSprite
        texture={beTex}
        width={beW}
        height={beH}
        x={btnX0}
        y={btnY}
        alpha={p.btnAlpha}
        eventMode="static"
        cursor="pointer"
        onClick={() => { window.location.href = BTN_EXPLORE_URL }}
      />
      <pixiSprite
        texture={btTex}
        width={btW}
        height={btH}
        x={btnX0 + beW + gap}
        y={btnY}
        alpha={p.btnAlpha}
        eventMode="static"
        cursor="pointer"
        onClick={() => { window.location.href = BTN_TEACH_URL }}
      />
    </pixiContainer>
  )
}

export function Frame8({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return null
  return <Frame8Desktop timeline={timeline} />
}
