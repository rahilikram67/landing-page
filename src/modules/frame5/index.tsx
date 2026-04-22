import { useEffect, useRef, useState } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import gsap from "gsap"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

const CIRCLE_SCALES = [1.1, 0.90, 0.70]

const PLANETS = [
    { planet: ASSETS.beigePlanet, text: ASSETS.beigePlanetText, scale: 1.0 },
    { planet: ASSETS.greenPlanet, text: ASSETS.greenPlanetText, scale: 0.8 },
    { planet: ASSETS.redPlanet, text: ASSETS.redPlanetText, scale: 1.2 },
] as const

const ORBIT_DURATION = 30

export function Frame5({ timeline, ctx }: SceneProps) {
    if (ctx.isMobile) return <Frame5Mobile timeline={timeline} />
    return <Frame5Desktop timeline={timeline} />
}

function Frame5Mobile({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    const proxyRef = useRef({ slide: 0, yShift: 0, fadeOut: 1, fadeIn: 0 })
    const [slide, setSlide] = useState(0)
    const [yShift, setYShift] = useState(0)
    const [fadeOut, setFadeOut] = useState(1)
    const [fadeIn, setFadeIn] = useState(0)

    useEffect(() => {
        if (!timeline || !app.renderer) return

        timeline.to(proxyRef.current, {
            fadeIn: 1,
            duration: 1.2,
            ease: "power1.out",
            onUpdate() { setFadeIn(proxyRef.current.fadeIn) },
        }, ">")

        timeline.to(proxyRef.current, {
            slide: PLANETS.length,
            ease: "none",
            onUpdate() {
                setSlide(proxyRef.current.slide)
            },
        }, ">-0.2")

        const target = app.screen.height * 0.54
        timeline.to(proxyRef.current, {
            yShift: -target,
            ease: "power2.inOut",
            onUpdate() {
                setYShift(proxyRef.current.yShift)
            },
        })
        timeline.to(proxyRef.current, {
            fadeOut: 0,
            ease: "power1.in",
            onUpdate() {
                setFadeOut(proxyRef.current.fadeOut)
            },
        }, ">-0.3")
    }, [timeline, app.renderer])

    if (!app.renderer) return null

    const bgTexture = Assets.get(ASSETS.bg5)
    const circleTexture = Assets.get(ASSETS.circle)

    const sw = app.screen.width
    const sh = app.screen.height
    const cx = sw / 2
    const cy = sh / 2 + yShift
    const planetCy = sh * 0.4 + yShift
    const baseSize = Math.min(sw, sh) * 1.7
    const planetSize = sw * 0.5
    const textWidth = sw * 0.7
    const gap = sh * 0.01

    return (
        <pixiContainer alpha={fadeIn}>
            <pixiSprite
                texture={bgTexture}
                width={sw}
                height={sh}
                x={0}
                y={0}
            />
            {CIRCLE_SCALES.map((scale, i) => {
                const size = baseSize * scale
                return (
                    <pixiSprite
                        key={`circle-${i}`}
                        texture={circleTexture}
                        width={size}
                        height={size}
                        x={cx - size / 2}
                        y={cy - size / 2}
                    />
                )
            })}
            {PLANETS.map(({ planet, text, scale }, i) => {
                const offset = i - slide
                const x = cx + offset * sw

                const dist = Math.abs(offset)
                const slideAlpha = Math.max(0, 1 - dist * 1.5)
                const alpha = slideAlpha * fadeOut

                const pTex = Assets.get(planet)
                const tTex = Assets.get(text)

                const pAspect = pTex.width / pTex.height
                const pW = (pAspect >= 1 ? planetSize : planetSize * pAspect) * scale
                const pH = (pAspect >= 1 ? planetSize / pAspect : planetSize) * scale
                const tW = textWidth
                const tH = textWidth * (tTex.height / tTex.width)

                return (
                    <pixiContainer key={`planet-${i}`}>
                        <pixiSprite
                            texture={pTex}
                            width={pW}
                            height={pH}
                            x={x - pW / 2}
                            y={planetCy - pH / 2}
                            alpha={alpha}
                        />
                        <pixiSprite
                            texture={tTex}
                            width={tW}
                            height={tH}
                            x={x - tW / 2}
                            y={planetCy + pH / 2 + gap}
                            alpha={alpha}
                        />
                    </pixiContainer>
                )
            })}
            {(() => {
                const btTex = Assets.get(ASSETS.circleBottomText)
                const offset = PLANETS.length - slide
                const x = cx + offset * sw
                // const dist = Math.abs(offset)
                // const slideAlpha = Math.max(0, 1 - dist * 1.5)
                // const alpha = slideAlpha * fadeOut
                const btW = sw * 0.85
                const btH = btW * (btTex.height / btTex.width)
                const btBaseY = planetCy * 1.2 - btH / 2
                const btY = Math.max(btBaseY, -btH * 0.36)
                return (
                    <pixiSprite
                        texture={btTex}
                        width={btW}
                        height={btH}
                        x={x - btW / 2}
                        y={btY}
                        // alpha={alpha}
                    />
                )
            })()}
        </pixiContainer>
    )
}

function Frame5Desktop({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    const proxyRef = useRef({ angle: 0, yShift: 0, opacity: 1, fadeIn: 0 })
    const orbitTweenRef = useRef<gsap.core.Tween | null>(null)
    const [angleOffset, setAngleOffset] = useState(0)
    const [yShift, setYShift] = useState(0)
    const [opacity, setOpacity] = useState(1)
    const [fadeIn, setFadeIn] = useState(0)

    useEffect(() => {
        const tween = gsap.to(proxyRef.current, {
            angle: Math.PI * 2,
            duration: ORBIT_DURATION,
            repeat: -1,
            ease: "none",
            onUpdate() {
                setAngleOffset(proxyRef.current.angle)
            },
        })
        orbitTweenRef.current = tween
        return () => { tween.kill() }
    }, [])

    useEffect(() => {
        if (!timeline || !app.renderer) return

        timeline.to(proxyRef.current, {
            fadeIn: 1,
            duration: 1.2,
            ease: "power1.out",
            onUpdate() { setFadeIn(proxyRef.current.fadeIn) },
        }, ">")

        const target = app.screen.height * 0.7
        timeline.to(proxyRef.current, {
            yShift: -target,
            ease: "power2.inOut",
            onStart() {
                orbitTweenRef.current?.timeScale(0.5)
            },
            onReverseComplete() {
                orbitTweenRef.current?.timeScale(1).resume()
            },
            onUpdate() {
                setYShift(proxyRef.current.yShift)
            },
        })
        timeline.to(proxyRef.current, {
            opacity: 0,
            ease: "power1.in",
            onComplete() {
                orbitTweenRef.current?.pause()
            },
            onReverseComplete() {
                orbitTweenRef.current?.resume()
            },
            onUpdate() {
                setOpacity(proxyRef.current.opacity)
            },
        }, ">-0.3")
    }, [timeline, app.renderer])

    if (!app.renderer) return null

    const bgTexture = Assets.get(ASSETS.bg5)
    const circleTexture = Assets.get(ASSETS.circle)

    const cx = app.screen.width / 2
    const cy = app.screen.height / 2 + yShift
    const baseSize = Math.min(app.screen.width, app.screen.height) * 0.7

    const orbitRadius = baseSize * 0.45
    const planetSize = baseSize * 0.3
    const textWidth = baseSize * 0.4
    const gap = baseSize * 0.01

    return (
        <pixiContainer alpha={fadeIn}>
            <pixiSprite
                texture={bgTexture}
                width={app.screen.width}
                height={app.screen.height}
                x={0}
                y={0}
            />
            {CIRCLE_SCALES.map((scale, i) => {
                const size = baseSize * scale
                return (
                    <pixiSprite
                        key={`circle-${i}`}
                        texture={circleTexture}
                        width={size}
                        height={size}
                        x={cx - size / 2}
                        y={cy - size / 2}
                    />
                )
            })}
            {PLANETS.map(({ planet, text, scale }, i) => {
                const baseAngle = -Math.PI / 2 + (i * 2 * Math.PI) / 3
                const angle = baseAngle + angleOffset
                const px = cx + orbitRadius * Math.cos(angle)
                const py = cy + orbitRadius * Math.sin(angle)

                const pTex = Assets.get(planet)
                const tTex = Assets.get(text)

                const pAspect = pTex.width / pTex.height
                const pW = (pAspect >= 1 ? planetSize : planetSize * pAspect) * scale
                const pH = (pAspect >= 1 ? planetSize / pAspect : planetSize) * scale
                const tW = textWidth
                const tH = textWidth * (tTex.height / tTex.width)

                const groupH = pH + gap + tH
                const planetX = px - pW / 2
                const planetY = py - groupH / 2
                const textX = px - tW / 2
                const textY = planetY + pH + gap

                return (
                    <pixiContainer key={`planet-${i}`}>
                        <pixiSprite
                            texture={pTex}
                            width={pW}
                            height={pH}
                            x={planetX}
                            y={planetY}
                            alpha={opacity}
                        />
                        <pixiSprite
                            texture={tTex}
                            width={tW}
                            height={tH}
                            x={textX}
                            y={textY}
                            alpha={opacity}
                        />
                    </pixiContainer>
                )
            })}
        </pixiContainer>
    )
}
