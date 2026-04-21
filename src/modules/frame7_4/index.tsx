import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

function Frame74Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({ bgAlpha: 0, textAlpha: 0 })

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    timeline.to(p, {
      bgAlpha: 1,
      duration: 1.4,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">")

    timeline.to(p, {
      textAlpha: 1,
      duration: 1.2,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const bgTex = Assets.get(ASSETS.bg74)
  const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
  const bgW = bgTex.width * bgScale
  const bgH = bgTex.height * bgScale
  const bgX = (sw - bgW) / 2
  const bgY = (sh - bgH) / 2

  const textTex = Assets.get(ASSETS.explorerText)
  const textW = sw * 0.428
  const textH = textTex.height / textTex.width * textW
  const textX = (sw - textW) / 2 - sw * 0.014
  const textY = sh * 0.198

  return (
    <pixiContainer>
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />
      <pixiSprite texture={textTex} width={textW} height={textH} x={textX} y={textY} alpha={p.textAlpha} />
    </pixiContainer>
  )
}

function Frame74Mobile({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({ bgAlpha: 0, textAlpha: 0 })

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    timeline.to(p, {
      bgAlpha: 1,
      duration: 1.4,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">")

    timeline.to(p, {
      textAlpha: 1,
      duration: 1.2,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const bgTex = Assets.get(ASSETS.mobileBg74)
  const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
  const bgW = bgTex.width * bgScale
  const bgH = bgTex.height * bgScale
  const bgX = (sw - bgW) / 2
  const bgY = (sh - bgH) / 2

  // From Figma: text w=343 in a 375px screen (x=24), y=207 in 812px screen
  const textTex = Assets.get(ASSETS.explorerText)
  const textW = sw * 0.915
  const textH = textTex.height / textTex.width * textW
  const textX = sw * 0.064
  const textY = sh * 0.255

  return (
    <pixiContainer>
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />
      <pixiSprite texture={textTex} width={textW} height={textH} x={textX} y={textY} alpha={p.textAlpha} />
    </pixiContainer>
  )
}

export function Frame7_4({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return <Frame74Mobile timeline={timeline} />
  return <Frame74Desktop timeline={timeline} />
}
