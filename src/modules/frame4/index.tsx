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

// ─── Desktop ──────────────────────────────────────────────────────────────────

function Frame4Desktop({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)
  const rotRef = useRef(0)

  const proxy = useRef({
    bgBlur1Alpha: 0,
    bgBlur2Alpha: 0,
    centerAlpha: 0,
    iconsAlpha:  0,
    text1Alpha:  0,
    text2Alpha:  0,
    exitAlpha:   1,
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

    // bg-blur-4-f1 fades in first
    timeline.to(p, {
      bgBlur1Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">")

    // bg-blur-4-f2 fades in second, over the first
    timeline.to(p, {
      bgBlur2Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">0.3")

    // Center image fades in
    timeline.to(p, {
      centerAlpha: 1,
      duration: 0.8,
      ease: "power1.out",
      onUpdate: forceRender,
    }, "<0.2")

    // Icons fade in
    timeline.to(p, {
      iconsAlpha: 1,
      duration: 0.8,
      ease: "power1.out",
      onUpdate: forceRender,
    }, "<0.4")

    // Text 1 (developers-coder) fades in
    timeline.to(p, {
      text1Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">0.2")

    // Text 2 (explorers) fades in over text 1
    timeline.to(p, {
      text2Alpha: 1,
      duration: 0.7,
      ease: "power1.out",
      onUpdate: forceRender,
    }, ">0.8")

    // Exit: fade out whole scene
    timeline.to(p, {
      exitAlpha: 0,
      duration: 1.0,
      ease: "power1.inOut",
      onUpdate: forceRender,
    }, ">")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p  = proxy.current

  const bgBlur1Tex = Assets.get(ASSETS.bgBlurF4_1)
  const bgBlur2Tex = Assets.get(ASSETS.bgBlurF4_2)
  const centerTex  = Assets.get(ASSETS.boyQuestions)
  const text1Tex   = Assets.get(ASSETS.developersCoder)
  const text2Tex   = Assets.get(ASSETS.explorersText)

  // Center image — 58% of screen height, horizontally centred
  const centerH  = sh * 0.58
  const centerW  = (centerTex.width / centerTex.height) * centerH
  const centerX  = (sw - centerW) / 2
  const centerCy = sh * 0.42           // orbital / visual centre Y
  const centerY  = centerCy - centerH / 2

  // Orbit ellipse around the centre
  const orbitRx  = sw * 0.30
  const orbitRy  = sh * 0.27
  const iconBase = Math.min(sw, sh) * 0.085

  // Text images — fade in/out over each other, centred below the figure
  const text1W = sw * 0.42
  const text1H = (text1Tex.height / text1Tex.width) * text1W
  const text2W = sw * 0.34
  const text2H = (text2Tex.height / text2Tex.width) * text2W
  const textY  = centerY + centerH + sh * 0.02

  return (
    <pixiContainer alpha={p.exitAlpha}>
      {/* Backgrounds — fade in one by one */}
      <pixiSprite texture={bgBlur1Tex} width={sw} height={sh} alpha={p.bgBlur1Alpha} />
      <pixiSprite texture={bgBlur2Tex} width={sw} height={sh} alpha={p.bgBlur2Alpha} />

      {/* Center hero image */}
      <pixiSprite
        texture={centerTex}
        width={centerW}
        height={centerH}
        x={centerX}
        y={centerY}
        alpha={p.centerAlpha}
      />

      {/* Icons infinitely revolving in an elliptical orbit */}
      {ICON_KEYS.map((key, i) => {
        const tex    = Assets.get(key)
        const angle  = rotRef.current + (i / ICON_COUNT) * Math.PI * 2
        const iconW  = iconBase
        const iconH  = (tex.height / tex.width) * iconW
        const ix     = sw / 2 + Math.cos(angle) * orbitRx - iconW / 2
        const iy     = centerCy + Math.sin(angle) * orbitRy - iconH / 2
        return (
          <pixiSprite
            key={key}
            texture={tex}
            width={iconW*1.5}
            height={iconH*1.5}
            x={ix}
            y={iy}
            alpha={p.iconsAlpha}
          />
        )
      })}

      {/* Text images — crossfade below the figure */}
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

// ─── Mobile ───────────────────────────────────────────────────────────────────

function Frame4Mobile({ timeline }: { timeline: GSAPTimeline }) {
  const { app } = useApplication()
  const [, forceRender] = useReducer(x => x + 1, 0)
  const rotRef = useRef(0)

  const proxy = useRef({
    bgBlur1Alpha: 0,
    bgBlur2Alpha: 0,
    centerAlpha: 0,
    iconsAlpha:  0,
    text1Alpha:  0,
    text2Alpha:  0,
    exitAlpha:   1,
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
    timeline.to(p, { centerAlpha:  1, duration: 0.8, ease: "power1.out", onUpdate: forceRender }, "<0.2")
    timeline.to(p, { iconsAlpha:   1, duration: 0.8, ease: "power1.out", onUpdate: forceRender }, "<0.4")
    timeline.to(p, { text1Alpha:   1, duration: 0.7, ease: "power1.out", onUpdate: forceRender }, ">0.2")
    timeline.to(p, { text2Alpha:   1, duration: 0.7, ease: "power1.out", onUpdate: forceRender }, ">0.8")
    timeline.to(p, { exitAlpha:    0, duration: 1.0, ease: "power1.inOut", onUpdate: forceRender }, ">")
  }, [timeline, app.renderer])

  if (!app.renderer) return null

  const sw = app.screen.width
  const sh = app.screen.height
  const p  = proxy.current

  const bgBlur1Tex = Assets.get(ASSETS.bgBlurF4_1)
  const bgBlur2Tex = Assets.get(ASSETS.bgBlurF4_2)
  const centerTex  = Assets.get(ASSETS.boyQuestions)
  const text1Tex   = Assets.get(ASSETS.developersCoder)
  const text2Tex   = Assets.get(ASSETS.explorersText)

  // Mobile: center image width-based sizing
  const centerW  = sw * 0.70
  const centerH  = (centerTex.height / centerTex.width) * centerW
  const centerX  = (sw - centerW) / 2
  const centerCy = sh * 0.38
  const centerY  = centerCy - centerH / 2

  const orbitRx  = sw * 0.40
  const orbitRy  = sh * 0.28
  const iconBase = sw * 0.13

  const text1W = sw * 0.82
  const text1H = (text1Tex.height / text1Tex.width) * text1W
  const text2W = sw * 0.66
  const text2H = (text2Tex.height / text2Tex.width) * text2W
  const textY  = centerY + centerH + sh * 0.02

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

      {ICON_KEYS.map((key, i) => {
        const tex   = Assets.get(key)
        const angle = rotRef.current + (i / ICON_COUNT) * Math.PI * 2
        const iconW = iconBase
        const iconH = (tex.height / tex.width) * iconW
        const ix    = sw / 2 + Math.cos(angle) * orbitRx - iconW / 2
        const iy    = centerCy + Math.sin(angle) * orbitRy - iconH / 2
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
