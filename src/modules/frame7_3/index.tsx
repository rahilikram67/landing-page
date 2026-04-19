import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

function Frame73Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({ bgAlpha: 0, terrainAlpha: 0 })

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
      terrainAlpha: 1,
      duration: 1.4,
      ease: "power1.out",
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

  const terrainTex = Assets.get(ASSETS.terrain)
  const terrainScale = Math.max(sw / terrainTex.width, sh / terrainTex.height)
  const terrainW = terrainTex.width * terrainScale
  const terrainH = terrainTex.height * terrainScale
  const terrainX = (sw - terrainW) / 2
  const terrainY = (sh - terrainH) / 2

  return (
    <pixiContainer>
      <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />
      <pixiSprite texture={terrainTex} width={terrainW} height={terrainH} x={terrainX} y={terrainY} alpha={p.terrainAlpha} />
    </pixiContainer>
  )
}

export function Frame7_3({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return null
  return <Frame73Desktop timeline={timeline} />
}
