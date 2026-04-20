import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

const DOOR_H_FRAC = 0.55
const DOOR_Y_FRAC = 0.22
const DOOR_GAP_FRAC = 0.01

const LEFT_X_FRACS  = [0.04, 0.16, 0.28]
const RIGHT_X_FRACS = [0.60, 0.72, 0.84]

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

  const doorH = sh * DOOR_H_FRAC
  const doorY = sh * DOOR_Y_FRAC
  const panelW = doorH * (panelTex.width / panelTex.height)

  const insetX = (panelTex.width  - leafTex.width)  / 2 / panelTex.width
  const insetY = (panelTex.height - leafTex.height) / 2 / panelTex.height
  const leafW  = panelW * (1 - insetX * 2)
  const leafH  = doorH  * (1 - insetY * 2)
  const hingeX = panelW * (1 - insetX)
  const hingeY = doorH  * insetY + leafH / 2

  const allXFracs = [...LEFT_X_FRACS, ...RIGHT_X_FRACS]

  return (
    <pixiContainer>
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />
      {allXFracs.map((fx, i) => {
        const panelX = sw * fx - (i >= 3 ? 0 : panelW * DOOR_GAP_FRAC)
        return (
          <pixiContainer key={i} x={panelX} y={doorY} alpha={p.doorsAlpha}>
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
