import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

const ICONS_DEF = [
  { key: ASSETS.iconChatgpt,     fx: -0.0080, fy: 0.6467, fw: 0.1308 },
  { key: ASSETS.iconN8n,         fx:  0.0436, fy: 0.4644, fw: 0.0705 },
  { key: ASSETS.iconTest,        fx:  0.1097, fy: 0.7944, fw: 0.0945 },
  { key: ASSETS.iconRunway,      fx:  0.1424, fy: 0.6056, fw: 0.0516 },
  { key: ASSETS.widgetCodeLeft,  fx:  0.1890, fy: 0.4700, fw: 0.2340 },
  { key: ASSETS.iconMake,        fx:  0.4193, fy: 0.4467, fw: 0.0567 },
  { key: ASSETS.lock,            fx:  0.4048, fy: 0.5622, fw: 0.1860 },
  { key: ASSETS.iconManus,       fx:  0.5574, fy: 0.5144, fw: 0.0356 },
  { key: ASSETS.widgetCodeRight, fx:  0.6134, fy: 0.5144, fw: 0.2042 },
  { key: ASSETS.iconCursor,      fx:  0.7449, fy: 0.4956, fw: 0.0385 },
  { key: ASSETS.iconColor,       fx:  0.8031, fy: 0.5256, fw: 0.0400 },
  { key: ASSETS.iconPoe,         fx:  0.8576, fy: 0.6056, fw: 0.0880 },
  { key: ASSETS.iconGemini,      fx:  0.9149, fy: 0.4489, fw: 0.0683 },
  { key: ASSETS.iconMidjourney,  fx:  0.9007, fy: 0.7544, fw: 0.1214 },
] as const

const FLOOR   = { fx: 0.2188, fy: 0.5989, fw: 0.5691 }
const PERM    = { fx: 0.2807, fy: 0.2011, fw: 0.4375 }
const TOOLS   = { fx: 0.2216, fy: 0.2478, fw: 0.5552 }

// Mobile positions as fractions of 375×812 frame
const ICONS_DEF_MOBILE = [
  { key: ASSETS.iconRunway,      fx: 0.413, fy: 0.421, fw: 0.101 },
  { key: ASSETS.widgetCodeLeft,  fx: 0.443, fy: 0.602, fw: 0.501 },
  { key: ASSETS.widgetCodeRight, fx: 0.909, fy: 0.421, fw: 0.579 },
  { key: ASSETS.iconChatgpt,     fx: 0.392, fy: 0.909, fw: 0.248 },
  { key: ASSETS.iconTest,        fx: 0.392, fy: 0.713, fw: 0.109 },
  { key: ASSETS.iconN8n,         fx: 0.605, fy: 0.809, fw: 0.131 },
  { key: ASSETS.iconPoe,         fx: 0.928, fy: 0.899, fw: 0.203 },
  { key: ASSETS.iconGemini,      fx: 1.272, fy: 0.788, fw: 0.147 },
  { key: ASSETS.iconMidjourney,  fx: 1.277, fy: 0.910, fw: 0.200 },
  { key: ASSETS.iconMake,        fx: 0.683, fy: 0.488, fw: 0.136 },
  { key: ASSETS.iconManus,       fx: 1.213, fy: 0.660, fw: 0.093 },
] as const

const FLOOR_M  = { fx: 0.480, fy: 0.687, fw: 0.901 }
const LOCK_M   = { fx: 0.773, fy: 0.670, fw: 0.293 }
const PERM_M   = { fx: 0.072, fy: 0.243, fw: 0.848 }
const TOOLS_M  = { fx: 0.072, fy: 0.282, fw: 0.848 }

export function Frame7_2({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return <Frame72Mobile timeline={timeline} />
  return <Frame72Desktop timeline={timeline} />
}

function Frame72Desktop({ timeline }: { timeline: GSAPTimeline }) {
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
  const floorW = mw(FLOOR.fw)
  const floorH = floorTex.height / floorTex.width * floorW
  const floorX = mx(FLOOR.fx)
  const floorY = my(FLOOR.fy) + p.floorYOff * sh

  const permTex = Assets.get(ASSETS.textPermission)
  const permW = mw(PERM.fw)
  const permH = permTex.height / permTex.width * permW

  const toolsTex = Assets.get(ASSETS.textRightTools)
  const toolsW = mw(TOOLS.fw)
  const toolsH = toolsTex.height / toolsTex.width * toolsW

  return (
    <pixiContainer>
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />
      <pixiSprite texture={floorTex} width={floorW} height={floorH} x={floorX} y={floorY} alpha={p.bgAlpha} />
      {ICONS_DEF.map((def, i) => {
        const tex = Assets.get(def.key)
        const w = mw(def.fw)
        const h = tex.height / tex.width * w
        const x = mx(def.fx)
        const y = my(def.fy) - p.icons[i].yOff * 60
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
      <pixiSprite texture={permTex} width={permW} height={permH} x={mx(PERM.fx)} y={my(PERM.fy)} alpha={p.textAlpha} />
      <pixiSprite texture={toolsTex} width={toolsW} height={toolsH} x={mx(TOOLS.fx)} y={my(TOOLS.fy)} alpha={p.textAlpha} />
    </pixiContainer>
  )
}

function Frame72Mobile({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({
    bgAlpha: 0,
    floorYOff: -0.4,
    textAlpha: 0,
    icons: ICONS_DEF_MOBILE.map(() => ({ alpha: 0, yOff: 1 })),
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

  const bgTex = Assets.get(ASSETS.mobileBg72)
  const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
  const bgW = bgTex.width * bgScale
  const bgH = bgTex.height * bgScale
  const bgX = (sw - bgW) / 2
  const bgY = (sh - bgH) / 2

  const mx = (f: number) => f * sw
  const my = (f: number) => f * sh
  const mw = (f: number) => f * sw

  const floorTex = Assets.get(ASSETS.floor72)
  const floorW = mw(FLOOR_M.fw)
  const floorH = floorTex.height / floorTex.width * floorW
  const floorX = mx(FLOOR_M.fx)
  const floorY = my(FLOOR_M.fy) + p.floorYOff * sh

  const lockTex = Assets.get(ASSETS.lock)
  const lockW = mw(LOCK_M.fw)
  const lockH = lockTex.height / lockTex.width * lockW

  const permTex = Assets.get(ASSETS.textPermission)
  const permW = mw(PERM_M.fw)
  const permH = permTex.height / permTex.width * permW

  const toolsTex = Assets.get(ASSETS.textRightTools)
  const toolsW = mw(TOOLS_M.fw)
  const toolsH = toolsTex.height / toolsTex.width * toolsW

  return (
    <pixiContainer>
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />
      <pixiSprite texture={floorTex} width={floorW} height={floorH} x={floorX} y={floorY} alpha={p.bgAlpha} />
      <pixiSprite texture={lockTex} width={lockW} height={lockH} x={mx(LOCK_M.fx)} y={my(LOCK_M.fy)} alpha={p.bgAlpha} />
      {ICONS_DEF_MOBILE.map((def, i) => {
        const tex = Assets.get(def.key)
        const w = mw(def.fw)
        const h = tex.height / tex.width * w
        const x = mx(def.fx)
        const y = my(def.fy) - p.icons[i].yOff * 60
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
      <pixiSprite texture={permTex} width={permW} height={permH} x={mx(PERM_M.fx)} y={my(PERM_M.fy)} alpha={p.textAlpha} />
      <pixiSprite texture={toolsTex} width={toolsW} height={toolsH} x={mx(TOOLS_M.fx)} y={my(TOOLS_M.fy)} alpha={p.textAlpha} />
    </pixiContainer>
  )
}
