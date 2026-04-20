import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

// Figma frame: 1376×900. All values are fractions of FW/FH.
const FW = 1376
const FH = 900

const DOORS = [
  { xf: 289/FW,  yf: 590/FH, hf: 207/FH, flip: false },
  { xf: 403/FW,  yf: 576/FH, hf: 162/FH, flip: false },
  { xf: 497/FW,  yf: 569/FH, hf: 120/FH, flip: false },
  { xf: 907/FW,  yf: 569/FH, hf: 121/FH, flip: true  },
  { xf: 1002/FW, yf: 576/FH, hf: 162/FH, flip: true  },
  { xf: 1115/FW, yf: 590/FH, hf: 207/FH, flip: true  },
] as const

function Frame73Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({ bgAlpha: 0, doorsAlpha: 0 })

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
      doorsAlpha: 1,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: forceRender,
    }, "<0.4")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const bgTex = Assets.get(ASSETS.bg73)
  const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
  const bgW = bgTex.width * bgScale
  const bgH = bgTex.height * bgScale
  const bgX = (sw - bgW) / 2
  const bgY = (sh - bgH) / 2

  const panelTex = Assets.get(ASSETS.doorPanel)
  const leafTex  = Assets.get(ASSETS.doorLeaf)

  const insetX = (panelTex.width  - leafTex.width)  / 2 / panelTex.width
  const insetY = (panelTex.height - leafTex.height) / 2 / panelTex.height

  return (
    <pixiContainer>
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />

      {DOORS.map((d, i) => {
        const doorH = sh * d.hf
        const panelW = doorH * (panelTex.width / panelTex.height)
        const leafW  = panelW * (1 - insetX * 2)
        const leafH  = doorH  * (1 - insetY * 2)
        const hingeX = panelW * (1 - insetX)
        const hingeY = doorH  * insetY + leafH / 2
        const panelX = sw * d.xf
        const panelY = sh * d.yf

        return (
          <pixiContainer
            key={i}
            x={d.flip ? panelX + panelW : panelX}
            y={panelY}
            scale={{ x: d.flip ? -1 : 1, y: 1 }}
            alpha={p.doorsAlpha}
          >
            <pixiSprite texture={panelTex} width={panelW} height={doorH} />
            <pixiContainer x={hingeX} y={hingeY}>
              <pixiSprite texture={leafTex} width={leafW} height={leafH} x={-leafW} y={-leafH / 2} />
            </pixiContainer>
          </pixiContainer>
        )
      })}
    </pixiContainer>
  )
}

export function Frame7_3({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return null
  return <Frame73Desktop timeline={timeline} />
}
