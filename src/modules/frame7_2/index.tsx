import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

const ICONS_DEF = [
  { key: ASSETS.iconChatgpt,     fx: -11/1376, fy: 582/900, fw: 180/1376 },
  { key: ASSETS.iconN8n,         fx: 60/1376,  fy: 418/900, fw: 97/1376  },
  { key: ASSETS.iconTest,        fx: 151/1376, fy: 715/900, fw: 130/1376 },
  { key: ASSETS.iconRunway,      fx: 196/1376, fy: 545/900, fw: 71/1376  },
  { key: ASSETS.widgetCodeLeft,  fx: 260/1376, fy: 423/900, fw: 322/1376 },
  { key: ASSETS.iconMake,        fx: 577/1376, fy: 402/900, fw: 78/1376  },
  { key: ASSETS.lock,        fx: 557/1376, fy: 506/900, fw: 256/1376 },
  { key: ASSETS.iconManus,       fx: 767/1376, fy: 463/900, fw: 49/1376  },
  { key: ASSETS.widgetCodeRight, fx: 844/1376, fy: 463/900, fw: 281/1376 },
  { key: ASSETS.iconCursor,      fx: 1025/1376, fy: 446/900, fw: 53/1376 },
  { key: ASSETS.iconColor,       fx: 1105/1376, fy: 473/900, fw: 55/1376 },
  { key: ASSETS.iconPoe,         fx: 1180/1376, fy: 545/900, fw: 121/1376 },
  { key: ASSETS.iconGemini,      fx: 1259/1376, fy: 404/900, fw: 94/1376 },
  { key: ASSETS.iconMidjourney,  fx: 1239/1376, fy: 679/900, fw: 167/1376 },
] as const

export function Frame7_2({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return null
  return <Frame7_2Desktop timeline={timeline} />
}

function Frame7_2Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({
    bgAlpha: 0,
    floorYOff: -0.4,
    textAlpha: 0,
    icons: ICONS_DEF.map(() => ({ alpha: 0, yOff: 1 })),
  })

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
      floorYOff: 0,
      duration: 1.2,
      ease: "bounce.out",
      onUpdate: forceRender,
    }, "<0.3")

    timeline.to(p.icons, {
      alpha: 1,
      yOff: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "bounce.out",
      onUpdate: forceRender,
    }, "<0.2")

    timeline.to(p, {
      textAlpha: 1,
      duration: 1,
      ease: "power2.out",
      onUpdate: forceRender,
    }, ">-0.2")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const bgTex = Assets.get(ASSETS.bg72)
  const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
  const bgW = bgTex.width * bgScale
  const bgH = bgTex.height * bgScale
  const bgX = (sw - bgW) / 2
  const bgY = (sh - bgH) / 2

  const mx = (f: number) => bgX + f * bgW
  const my = (f: number) => bgY + f * bgH
  const mw = (f: number) => f * bgW

  const floorTex = Assets.get(ASSETS.floor72)
  const floorW = mw(783 / 1376)
  const floorH = floorTex.height / floorTex.width * floorW
  const floorX = mx(301 / 1376)
  const floorFinalY = my(539 / 900)
  const floorY = floorFinalY + p.floorYOff * sh

  const permTex = Assets.get(ASSETS.textPermission)
  const permW = mw(602 / 1376)
  const permH = permTex.height / permTex.width * permW
  const permX = mx(386 / 1376)
  const permY = my(181 / 900)

  const toolsTex = Assets.get(ASSETS.textRightTools)
  const toolsW = mw(764 / 1376)
  const toolsH = toolsTex.height / toolsTex.width * toolsW
  const toolsX = mx(305 / 1376)
  const toolsY = my(223 / 900)

  return (
    <pixiContainer>
      <pixiSprite
        texture={bgTex}
        width={bgW}
        height={bgH}
        x={bgX}
        y={bgY}
        alpha={p.bgAlpha}
      />
      <pixiSprite
        texture={floorTex}
        width={floorW}
        height={floorH}
        x={floorX}
        y={floorY}
        alpha={p.bgAlpha}
      />
      {ICONS_DEF.map((def, i) => {
        const tex = Assets.get(def.key)
        const w = mw(def.fw)
        const h = tex.height / tex.width * w
        const x = mx(def.fx)
        const finalY = my(def.fy)
        const y = finalY - p.icons[i].yOff * 60
        return (
          <pixiSprite
            key={def.key}
            texture={tex}
            width={w}
            height={h}
            x={x}
            y={y}
            alpha={p.icons[i].alpha}
          />
        )
      })}
      <pixiSprite
        texture={permTex}
        width={permW}
        height={permH}
        x={permX}
        y={permY}
        alpha={p.textAlpha}
      />
      <pixiSprite
        texture={toolsTex}
        width={toolsW}
        height={toolsH}
        x={toolsX}
        y={toolsY}
        alpha={p.textAlpha}
      />
    </pixiContainer>
  )
}
