import { useEffect, useRef, useReducer } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

const ICON_KEYS = [
  ASSETS.iconClaude,
  ASSETS.iconChatgpt,
  ASSETS.iconGemini,
  ASSETS.iconMidjourney,
  ASSETS.iconN8n,
  ASSETS.iconPerplexity,
  ASSETS.iconPoe,
] as const

const ICON_COUNT = ICON_KEYS.length

// depth scale range: icons at the bottom appear 2.5× larger than at the top
const DEPTH_MIN = 0.55
const DEPTH_MAX = 1.45

function depthScale(angle: number) {
  // sin = +1 at bottom (front) → max scale; sin = -1 at top (back) → min scale
  return DEPTH_MIN + (DEPTH_MAX - DEPTH_MIN) * (Math.sin(angle) + 1) / 2
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

function Frame4Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)
  const rotRef = useRef(0)

  const proxy = useRef({
    bgBlur1Alpha: 0,
    bgBlur2Alpha: 0,
    centerAlpha: 0,
    iconsAlpha: 0,
    text1Alpha: 0,
    text1OffsetY: 0,
    text2Alpha: 0,
    chipsAlpha: 0,
    exitAlpha: 1,
  })

  // Continuous orbit rotation — independent of scroll progress
  useEffect(() => {
    if (!app.renderer) return
    let rafId = 0
    const step = () => {
      rotRef.current += 0.003
      forceRender()
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [app.renderer])

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    // bg1 fades in
    timeline.to(p, { bgBlur1Alpha: 1, duration: 0.7, ease: "power1.out", onUpdate: forceRender }, ">")

    // bg2 fades in over bg1


    // Center image fades in
    timeline.to(p, { centerAlpha: 1, duration: 0.8, ease: "power1.out", onUpdate: forceRender }, "<0.2")

    // Icons fade in
    timeline.to(p, { iconsAlpha: 1, duration: 0.8, ease: "power1.out", onUpdate: forceRender }, "<0.4")

    // Text1 fades in, holds 1 s, then slides down and fades out
    timeline.to(p, { text1Alpha: 1, duration: 0.6, ease: "power1.out", onUpdate: forceRender }, ">")
    timeline.to(p, { text1Alpha: 0, text1OffsetY: 40, duration: 0.5, ease: "power1.in", onUpdate: forceRender }, ">")

    // Text2 + chips fade in as text1 exits
    timeline.to(p, { text2Alpha: 1, duration: 0.6, ease: "power1.out", onUpdate: forceRender }, "<")
    timeline.to(p, { bgBlur2Alpha: 1, duration: 0.7, ease: "power1.out", onUpdate: forceRender }, ">")
    timeline.to(p, { chipsAlpha: 1, duration: 0.6, ease: "power1.out", onUpdate: forceRender }, "<")

    // Exit: fade out whole scene
    timeline.to(p, { exitAlpha: 0,    duration: 1.0, ease: "power1.inOut", onUpdate: forceRender }, ">")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const bgBlur1Tex = Assets.get(ASSETS.bgBlurF4_1)
  const bgBlur2Tex = Assets.get(ASSETS.bgBlurF4_2)
  const centerTex = Assets.get(ASSETS.boyQuestions)
  const text1Tex = Assets.get(ASSETS.developersCoder)
  const text2Tex = Assets.get(ASSETS.explorersText)
  const buildEcomTex = Assets.get(ASSETS.buildEcomChip)
  const generatedInvTex = Assets.get(ASSETS.generatedInvestorChip)
  const saved12Tex = Assets.get(ASSETS.saved12Chip)

  // Center image — 58 % of screen height, horizontally centred
  const centerH = sh * 0.58
  const centerW = (centerTex.width / centerTex.height) * centerH
  const centerX = (sw - centerW) / 2
  const centerCy = sh * 0.42
  const centerY = centerCy - centerH / 2

  // Orbit ellipse
  const orbitRx = sw * 0.26
  const orbitRy = sh * 0.25
  const iconBase = Math.min(sw, sh) * 0.12

  // Text images — same position, swap via alpha
  const text1W = sw * 0.42
  const text1H = (text1Tex.height / text1Tex.width) * text1W
  const text2W = sw * 0.34
  const text2H = (text2Tex.height / text2Tex.width) * text2W
  const textY = centerY + centerH + sh * 0.02

  // Chips — positions derived from Figma (1440 × 942 canvas)
  // chip: generated-investor — left side, vertical centre
  const chip1W = sw * 0.2938
  const chip1H = (generatedInvTex.height / generatedInvTex.width) * chip1W
  const chip1X = sw * 0.0743
  const chip1Y = sh * 0.494
  // chip: build-ecom — upper right
  const chip2W = sw * 0.2292
  const chip2H = (buildEcomTex.height / buildEcomTex.width) * chip2W
  const chip2X = sw * 0.5924
  const chip2Y = sh * 0.330
  // chip: saved-12 — lower right
  const chip3W = sw * 0.2382
  const chip3H = (saved12Tex.height / saved12Tex.width) * chip3W
  const chip3X = sw * 0.6806
  const chip3Y = sh * 0.615

  // Sort icons by depth so back icons render under front icons
  const iconOrder = Array.from({ length: ICON_COUNT }, (_, i) => i)
    .sort((a, b) => {
      const angleA = rotRef.current + (a / ICON_COUNT) * Math.PI * 2
      const angleB = rotRef.current + (b / ICON_COUNT) * Math.PI * 2
      return Math.sin(angleA) - Math.sin(angleB)  // back-to-front
    })

  return (
    <>
      {/* Backgrounds — fade in one by one */}
      <pixiSprite texture={bgBlur1Tex} width={sw} height={sh} alpha={p.bgBlur1Alpha} />
      <pixiSprite texture={bgBlur2Tex} width={sw} height={sh} alpha={p.bgBlur2Alpha} />

      <pixiContainer alpha={p.exitAlpha}>
        {/* Center hero image */}
        <pixiSprite
          texture={centerTex}
          width={centerW}
          height={centerH}
          x={centerX}
          y={centerY}
          alpha={p.centerAlpha}
        />

        {/* Icons — back-to-front order, depth-scaled so bottom = bigger */}
        {iconOrder.map(i => {
          const key = ICON_KEYS[i]
          const tex = Assets.get(key)
          const angle = rotRef.current + (i / ICON_COUNT) * Math.PI * 2
          const ds = depthScale(angle)
          const iconW = iconBase * ds
          const iconH = (tex.height / tex.width) * iconW
          const ix = sw / 2 + Math.cos(angle) * orbitRx - iconW / 2
          const iy = centerCy + Math.sin(angle) * orbitRy - iconH / 2
          return (
            <pixiSprite
              key={key}
              texture={tex}
              width={iconW}
              height={iconH}
              x={ix}
              y={iy}
              alpha={p.iconsAlpha}
            />
          )
        })}

        {/* Texts — text1 fades in then out, text2 fades in at the same spot */}
        <pixiSprite
          texture={text1Tex}
          width={text1W}
          height={text1H}
          x={(sw - text1W) / 2}
          y={textY + p.text1OffsetY}
          alpha={p.text1Alpha}
        />
        <pixiSprite
          texture={text2Tex}
          width={text2W}
          height={text2H}
          x={(sw - text2W) / 2}
          y={textY}
          alpha={p.text2Alpha}
        />

        {/* Chips — fade in with text2 */}
        <pixiSprite
          texture={generatedInvTex}
          width={chip1W}
          height={chip1H}
          x={chip1X}
          y={chip1Y}
          alpha={p.chipsAlpha}
        />
        <pixiSprite
          texture={buildEcomTex}
          width={chip2W}
          height={chip2H}
          x={chip2X}
          y={chip2Y}
          alpha={p.chipsAlpha}
        />
        <pixiSprite
          texture={saved12Tex}
          width={chip3W}
          height={chip3H}
          x={chip3X}
          y={chip3Y}
          alpha={p.chipsAlpha}
        />
      </pixiContainer>
    </>
  )
}

// ─── Mobile ───────────────────────────────────────────────────────────────────

function Frame4Mobile({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)
  const rotRef = useRef(0)

  const proxy = useRef({
    bgBlur1Alpha: 0,
    bgBlur2Alpha: 0,
    centerAlpha: 0,
    iconsAlpha: 0,
    text1Alpha: 0,
    text2Alpha: 0,
    exitAlpha: 1,
  })

  useEffect(() => {
    if (!app.renderer) return
    let rafId = 0
    const step = () => {
      rotRef.current += 0.003
      forceRender()
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [app.renderer])

  useEffect(() => {
    if (!timeline || !app.renderer) return
    const p = proxy.current

    timeline.to(p, { bgBlur1Alpha: 1, duration: 0.7, ease: "power1.out", onUpdate: forceRender }, ">")
    timeline.to(p, { bgBlur2Alpha: 1, duration: 0.7, ease: "power1.out", onUpdate: forceRender }, ">0.3")
    timeline.to(p, { centerAlpha: 1, duration: 0.8, ease: "power1.out", onUpdate: forceRender }, "<0.2")
    timeline.to(p, { iconsAlpha: 1, duration: 0.8, ease: "power1.out", onUpdate: forceRender }, "<0.4")
    timeline.to(p, { text1Alpha: 1, duration: 0.6, ease: "power1.out", onUpdate: forceRender }, ">0.2")
    timeline.to(p, { text1Alpha: 0, duration: 0.5, ease: "power1.in", onUpdate: forceRender }, ">1.0")
    timeline.to(p, { text2Alpha: 1, duration: 0.6, ease: "power1.out", onUpdate: forceRender }, "<0.2")
    timeline.to(p, { exitAlpha: 0, duration: 1.0, ease: "power1.inOut", onUpdate: forceRender }, ">")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p = proxy.current

  const bgBlur1Tex = Assets.get(ASSETS.bgBlurF4_1)
  const bgBlur2Tex = Assets.get(ASSETS.bgBlurF4_2)
  const centerTex = Assets.get(ASSETS.boyQuestions)
  const text1Tex = Assets.get(ASSETS.developersCoder)
  const text2Tex = Assets.get(ASSETS.explorersText)

  const centerW = sw * 0.70
  const centerH = (centerTex.height / centerTex.width) * centerW
  const centerX = (sw - centerW) / 2
  const centerCy = sh * 0.38
  const centerY = centerCy - centerH / 2

  const orbitRx = sw * 0.40
  const orbitRy = sh * 0.14
  const iconBase = sw * 0.13

  const text1W = sw * 0.82
  const text1H = (text1Tex.height / text1Tex.width) * text1W
  const text2W = sw * 0.66
  const text2H = (text2Tex.height / text2Tex.width) * text2W
  const textY = sh * 0.80

  const iconOrder = Array.from({ length: ICON_COUNT }, (_, i) => i)
    .sort((a, b) => {
      const angleA = rotRef.current + (a / ICON_COUNT) * Math.PI * 2
      const angleB = rotRef.current + (b / ICON_COUNT) * Math.PI * 2
      return Math.sin(angleA) - Math.sin(angleB)
    })

  return (
    <pixiContainer alpha={p.exitAlpha}>
      <pixiSprite texture={bgBlur1Tex} width={sw} height={sh} alpha={p.bgBlur1Alpha} />
      <pixiSprite texture={bgBlur2Tex} width={sw} height={sh} alpha={p.bgBlur2Alpha} />

      <pixiSprite
        texture={centerTex}
        width={centerW}
        height={centerH}
        x={centerX}
        y={centerY}
        alpha={p.centerAlpha}
      />

      {iconOrder.map(i => {
        const key = ICON_KEYS[i]
        const tex = Assets.get(key)
        const angle = rotRef.current + (i / ICON_COUNT) * Math.PI * 2
        const ds = depthScale(angle)
        const iconW = iconBase * ds
        const iconH = (tex.height / tex.width) * iconW
        const ix = sw / 2 + Math.cos(angle) * orbitRx - iconW / 2
        const iy = centerCy + Math.sin(angle) * orbitRy - iconH / 2
        return (
          <pixiSprite
            key={key}
            texture={tex}
            width={iconW}
            height={iconH}
            x={ix}
            y={iy}
            alpha={p.iconsAlpha}
          />
        )
      })}

      <pixiSprite
        texture={text1Tex}
        width={text1W}
        height={text1H}
        x={(sw - text1W) / 2}
        y={textY}
        alpha={p.text1Alpha}
      />
      <pixiSprite
        texture={text2Tex}
        width={text2W}
        height={text2H}
        x={(sw - text2W) / 2}
        y={textY}
        alpha={p.text2Alpha}
      />
    </pixiContainer>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function Frame4({ timeline, ctx }: SceneProps) {
  if (ctx.isMobile) return <Frame4Mobile timeline={timeline} />
  return <Frame4Desktop timeline={timeline} />
}
