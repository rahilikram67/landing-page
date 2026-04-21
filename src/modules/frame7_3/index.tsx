import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

const DOORS = [
  { xf: 0.2628, yf: 0.5022, hf: 0.1344, flip: false },
  { xf: 0.6892, yf: 0.5022, hf: 0.1344, flip: true  },
  { xf: 0.1771, yf: 0.5100, hf: 0.1800, flip: false },
  { xf: 0.7582, yf: 0.5100, hf: 0.1800, flip: true  },
  { xf: 0.0769, yf: 0.5256, hf: 0.2300, flip: false },
  { xf: 0.8402, yf: 0.5256, hf: 0.2300, flip: true  },
] as const

const DOOR_OPEN_DURATION = 2.5
const SMOOTH_EASE = "power2.inOut"

function Frame73Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({ bgAlpha: 0, doorsAlpha: 0, doorRotY: 0, textAlpha: 0 })

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

    timeline.to(p, {
      textAlpha: 1,
      duration: 1.2,
      ease: "power1.out",
      onUpdate: forceRender,
    }, "<0.3")

    timeline.to(p, {
      doorRotY: Math.PI,
      duration: DOOR_OPEN_DURATION,
      ease: SMOOTH_EASE,
      onUpdate: forceRender,
    }, ">")
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

  const panelTex  = Assets.get(ASSETS.doorPanel)
  const leafTex   = Assets.get(ASSETS.doorLeaf)
  const handleTex = Assets.get(ASSETS.doorHandle)

  const insetX = (panelTex.width  - leafTex.width)  / 2 / panelTex.width
  const insetY = (panelTex.height - leafTex.height) / 2 / panelTex.height

  const doorScaleX = Math.cos(p.doorRotY)

  const textTex = Assets.get(ASSETS.behindEarly)
  const textW = sw * 0.35
  const textH = textTex.height / textTex.width * textW
  const textX = (sw - textW) / 2
  const textY = sh * 0.08

  return (
    <pixiContainer>
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />

      {DOORS.map((d, i) => {
        const doorH = sh * d.hf
        const panelW = doorH * (panelTex.width / panelTex.height)
        const leafW  = panelW * (1 - insetX * 2)
        const leafH  = doorH  * (1 - insetY * 2)
        const hingeX = panelW * insetX
        const hingeY = doorH  * insetY + leafH / 2
        const panelX = sw * d.xf
        const panelY = sh * d.yf

        const handleW = leafW * 0.18
        const handleH = handleTex.height / handleTex.width * handleW
        const handleX = leafW * 0.12
        const handleY = leafH * 0.5 - handleH / 2

        return (
          <pixiContainer
            key={i}
            x={d.flip ? panelX + panelW : panelX}
            y={panelY}
            scale={{ x: d.flip ? -1 : 1, y: 1 }}
            alpha={p.doorsAlpha}
          >
            <pixiSprite texture={panelTex} width={panelW} height={doorH} />
            <pixiContainer x={hingeX} y={hingeY} scale={{ x: doorScaleX, y: 1 }}>
              <pixiSprite texture={leafTex} width={leafW} height={leafH} x={0} y={-leafH / 2} />
              <pixiSprite texture={handleTex} width={handleW} height={handleH} x={leafW - handleX - handleW} y={-leafH / 2 + handleY} />
            </pixiContainer>
          </pixiContainer>
        )
      })}
      <pixiSprite texture={textTex} width={textW} height={textH} x={textX} y={textY} alpha={p.textAlpha} />
    </pixiContainer>
  )
}

const MOBILE_DOORS = [
  { xf: 0.48, yf: 0.524, hf: 0.1200 },
  { xf: 0.28, yf: 0.535, hf: 0.1611 },
  { xf: 0.03, yf: 0.555, hf: 0.2053 },
] as const

function Frame73Mobile({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({ bgAlpha: 0, doorsAlpha: 0, textAlpha: 0, doorRotY: 0 })

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

    timeline.to(p, {
      textAlpha: 1,
      duration: 1.2,
      ease: "power1.out",
      onUpdate: forceRender,
    }, "<0.3")

    timeline.to(p, {
      doorRotY: Math.PI,
      duration: DOOR_OPEN_DURATION,
      ease: SMOOTH_EASE,
      onUpdate: forceRender,
    }, ">")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const bgTex = Assets.get(ASSETS.mobileBg73)
  const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
  const bgW = bgTex.width * bgScale
  const bgH = bgTex.height * bgScale
  const bgX = (sw - bgW) / 2
  const bgY = (sh - bgH) / 2

  const panelTex  = Assets.get(ASSETS.doorPanel)
  const leafTex   = Assets.get(ASSETS.doorLeaf)
  const handleTex = Assets.get(ASSETS.doorHandle)

  const insetX = (panelTex.width  - leafTex.width)  / 2 / panelTex.width
  const insetY = (panelTex.height - leafTex.height) / 2 / panelTex.height

  const doorScaleX = Math.cos(p.doorRotY)

  const textTex = Assets.get(ASSETS.behindEarly)
  const textW = sw * 0.72
  const textH = textTex.height / textTex.width * textW
  const textX = (sw - textW) / 2
  const textY = sh * 0.06

  return (
    <pixiContainer>
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />

      {MOBILE_DOORS.map((d, i) => {
        const doorH = sh * d.hf
        const panelW = doorH * (panelTex.width / panelTex.height)
        const leafW  = panelW * (1 - insetX * 2)
        const leafH  = doorH  * (1 - insetY * 2)
        const hingeX = panelW * insetX
        const hingeY = doorH  * insetY + leafH / 2
        const panelX = sw * d.xf
        const panelY = sh * d.yf

        const handleW = leafW * 0.18
        const handleH = handleTex.height / handleTex.width * handleW
        const handleX = leafW * 0.12
        const handleY = leafH * 0.5 - handleH / 2

        return (
          <pixiContainer key={i} x={panelX} y={panelY} alpha={p.doorsAlpha}>
            <pixiSprite texture={panelTex} width={panelW} height={doorH} />
            <pixiContainer x={hingeX} y={hingeY} scale={{ x: doorScaleX, y: 1 }}>
              <pixiSprite texture={leafTex} width={leafW} height={leafH} x={0} y={-leafH / 2} />
              <pixiSprite texture={handleTex} width={handleW} height={handleH} x={leafW - handleX - handleW} y={-leafH / 2 + handleY} />
            </pixiContainer>
          </pixiContainer>
        )
      })}
      <pixiSprite texture={textTex} width={textW} height={textH} x={textX} y={textY} alpha={p.textAlpha} />
    </pixiContainer>
  )
}

export function Frame7_3({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return <Frame73Mobile timeline={timeline} />
  return <Frame73Desktop timeline={timeline} />
}
