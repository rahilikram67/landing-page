import { useEffect, useReducer, useRef } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

function Frame73Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)

  const proxy = useRef({ bgAlpha: 0, terrainAlpha: 0, sunAlpha: 0 })

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
      duration: 1.2,
      ease: "power1.out",
      onUpdate: forceRender,
    }, "<0.35")

    timeline.to(p, {
      sunAlpha: 1,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: forceRender,
    }, "<0.5")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const fit = (tex: { width: number; height: number }) => {
    const s = Math.max(sw / tex.width, sh / tex.height)
    const w = tex.width * s
    const h = tex.height * s
    return { w, h, x: (sw - w) / 2, y: (sh - h) / 2 }
  }

  const bg = fit(Assets.get(ASSETS.bg73))

  return (
    <pixiContainer>
      <pixiSprite texture={Assets.get(ASSETS.bg73)} width={bg.w} height={bg.h} x={bg.x} y={bg.y} alpha={p.bgAlpha} />
    </pixiContainer>
  )
}

export function Frame7_3({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return null
  return <Frame73Desktop timeline={timeline} />
}
