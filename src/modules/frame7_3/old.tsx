// import { useEffect, useReducer, useRef } from "react"
// import { useApplication } from "@pixi/react"
// import { Assets } from "pixi.js"
// import type { SceneProps } from "../../App"
// import { ASSETS } from "@/assets/manifest"

// function Frame73Desktop({ timeline }: { timeline: GSAPTimeline }) {
//   const { app } = useApplication()
//   const [, forceRender] = useReducer(x => x + 1, 0)

//   const proxy = useRef({
//     bgAlpha: 0,
//     sunY: 1,
//     textAlpha: 0,
//   })

//   useEffect(() => {
//     if (!timeline || !app.renderer) return
//     const p = proxy.current

//     timeline.to(p, {
//       bgAlpha: 1,
//       duration: 1.2,
//       ease: "power1.out",
//       onUpdate: forceRender,
//     }, ">")

//     timeline.to(p, {
//       sunY: 0,
//       duration: 1.6,
//       ease: "power2.out",
//       onUpdate: forceRender,
//     }, "<0.4")

//     timeline.to(p, {
//       textAlpha: 1,
//       duration: 1.0,
//       ease: "power1.out",
//       onUpdate: forceRender,
//     }, "<0.6")
//   }, [timeline, app.renderer])

//   if (!app.renderer) return null

//   const sw = app.screen.width
//   const sh = app.screen.height
//   const p = proxy.current

//   const bgTex = Assets.get(ASSETS.bg73)
//   const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
//   const bgW = bgTex.width * bgScale
//   const bgH = bgTex.height * bgScale
//   const bgX = (sw - bgW) / 2
//   const bgY = (sh - bgH) / 2

//   const sunTex = Assets.get(ASSETS.sun)
//   const sunW = sw * 0.20
//   const sunH = sunTex.height / sunTex.width * sunW
//   const sunX = (sw - sunW) / 2
//   const sunYFinal = sh - sunH * 0.55
//   const sunYStart = sh + sunH
//   const sunY = sunYStart + (sunYFinal - sunYStart) * (1 - p.sunY)

//   const textTex = Assets.get(ASSETS.behindEarly)
//   const textW = sw * 0.347
//   const textH = textTex.height / textTex.width * textW
//   const textX = (sw - textW) / 2
//   const textY = sh * 0.08

//   return (
//     <pixiContainer>
//       <pixiSprite texture={bgTex} width={bgW} height={bgH} x={bgX} y={bgY} alpha={p.bgAlpha} />
//       <pixiSprite texture={sunTex} width={sunW} height={sunH} x={sunX} y={sunY-400} alpha={p.bgAlpha} />
//       <pixiSprite texture={textTex} width={textW} height={textH} x={textX} y={textY} alpha={p.textAlpha} />
//     </pixiContainer>
//   )
// }

// export function Frame7_3({ timeline, ctx }: SceneProps) {
//   if (ctx.isMobile) return null
//   return <Frame73Desktop timeline={timeline} />
// }
