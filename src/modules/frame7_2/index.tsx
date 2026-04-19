import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

const FW = 1376
const FH = 900

const ICONS_DEF = [
  { key: ASSETS.iconChatgpt,     fx: -11, fy: 582, fw: 180 },
  { key: ASSETS.iconN8n,         fx: 60,  fy: 418, fw: 97  },
  { key: ASSETS.iconTest,        fx: 151, fy: 715, fw: 130 },
  { key: ASSETS.iconRunway,      fx: 196, fy: 545, fw: 71  },
  { key: ASSETS.widgetCodeLeft,  fx: 260, fy: 423, fw: 322 },
  { key: ASSETS.iconMake,        fx: 577, fy: 402, fw: 78  },
  { key: ASSETS.widgetVr,        fx: 557, fy: 506, fw: 256 },
  { key: ASSETS.iconManus,       fx: 767, fy: 463, fw: 49  },
  { key: ASSETS.widgetCodeRight, fx: 844, fy: 463, fw: 281 },
  { key: ASSETS.iconCursor,      fx: 1025, fy: 446, fw: 53 },
  { key: ASSETS.iconColor,       fx: 1105, fy: 473, fw: 55 },
  { key: ASSETS.iconPoe,         fx: 1180, fy: 545, fw: 121 },
  { key: ASSETS.iconGemini,      fx: 1259, fy: 404, fw: 94 },
  { key: ASSETS.iconMidjourney,  fx: 1239, fy: 679, fw: 167 },
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

  const rx = sw / FW
  const ry = sh / FH

  const bgTex = Assets.get(ASSETS.bg72)
  const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
  const bgW = bgTex.width * bgScale
  const bgH = bgTex.height * bgScale
  const bgX = (sw - bgW) / 2
  const bgY = (sh - bgH) / 2

  const floorTex = Assets.get(ASSETS.floor72)
  const floorW = 783 * rx
  const floorH = floorTex.height / floorTex.width * floorW
  const floorX = 301 * rx
  const floorFinalY = 539 * ry
  const floorY = floorFinalY + p.floorYOff * sh

  const permTex = Assets.get(ASSETS.textPermission)
  const permW = 602 * rx
  const permH = permTex.height / permTex.width * permW
  const permX = 386 * rx
  const permY = 181 * ry

  const toolsTex = Assets.get(ASSETS.textRightTools)
  const toolsW = 764 * rx
  const toolsH = toolsTex.height / toolsTex.width * toolsW
  const toolsX = 305 * rx
  const toolsY = 223 * ry

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
        const w = def.fw * rx
        const h = tex.height / tex.width * w
        const x = def.fx * rx
        const finalY = def.fy * ry
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
