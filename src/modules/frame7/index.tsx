import { useEffect, useRef, useState } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

const SMOOTH_EASE = "power2.inOut"
const DOOR_OPEN_DURATION = 2.5
const SCENE7_FADE_IN_DURATION = 1.2

export function Frame7({ timeline, ctx }: SceneProps) {
    if (ctx.isMobile) return <Frame7Mobile timeline={timeline} />
    return <Frame7Desktop timeline={timeline} />
}



function Frame7Desktop({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    // doorRotY = simulated rotateY in radians, 0 (closed/facing viewer) → PI (open/180° flipped).
    // scale.x derived as cos(doorRotY) → sweeps 1 → 0 → -1 (edge-on at midpoint, mirrored at end).
    const proxyRef = useRef({ bgAlpha: 0, doorAlpha: 0, textAlpha: 0, doorRotY: 0, textYShift: 0, zoom: 0 })
    const [bgAlpha, setBgAlpha] = useState(0)
    const [doorAlpha, setDoorAlpha] = useState(0)
    const [textAlpha, setTextAlpha] = useState(0)
    const [doorRotY, setDoorRotY] = useState(0)
    const [zoom, setZoom] = useState(0)

    useEffect(() => {
        if (!timeline || !app.renderer) return

        // Background fades in first
        timeline.to(proxyRef.current, {
            bgAlpha: 1,
            duration: SCENE7_FADE_IN_DURATION,
            ease: "power1.out",
            onUpdate() { setBgAlpha(proxyRef.current.bgAlpha) },
        }, ">")

        // Door fades in while background is still coming in
        timeline.to(proxyRef.current, {
            doorAlpha: 1,
            duration: SCENE7_FADE_IN_DURATION,
            ease: "power1.out",
            onUpdate() { setDoorAlpha(proxyRef.current.doorAlpha) },
        }, "<")

        // Texts fade in last
        timeline.to(proxyRef.current, {
            textAlpha: 1,
            duration: SCENE7_FADE_IN_DURATION,
            ease: "power2.out",
            onUpdate() {
                setTextAlpha(proxyRef.current.textAlpha)
            },
        }, "<")

        // --- Door open: leaf collapses from right edge (rotateY equivalent) ---
        // and text floats up (-120% of its block height) simultaneously.
        // textYShift is a unit value [0 → -1]; actual pixel offset is computed in render.
        

        timeline.to(proxyRef.current, {
            doorRotY: Math.PI,
            duration: DOOR_OPEN_DURATION,
            ease: SMOOTH_EASE,
            onUpdate() {
                setDoorRotY(-proxyRef.current.doorRotY)
            },
        }, ">")

        timeline.to(proxyRef.current, {
            zoom: 1.5,
            duration: DOOR_OPEN_DURATION,
            ease: SMOOTH_EASE,
            onUpdate() { 
                setZoom(proxyRef.current.zoom) 
            },
        }, "<")
    }, [timeline, app.renderer])

    if (!app.renderer) return null

    const sw = app.screen.width
    const sh = app.screen.height
    const cx = sw / 2

    const bgTex = Assets.get(ASSETS.bg71)
    const bgScale = Math.max(sw / bgTex.width, sh / bgTex.height)
    const bgW = bgTex.width * bgScale
    const bgH = bgTex.height * bgScale
    const bgX = (sw - bgW) / 2
    const bgY = (sh - bgH) / 2


    const doorY = sh * 0.28

    // Door panel sets the outer bounding box
    const doorPanelTex = Assets.get(ASSETS.doorPanel)
    const doorH = sh * 0.6
    const doorPanelW = doorH * (doorPanelTex.width / doorPanelTex.height)
    const doorPanelX = cx - doorPanelW / 2

    // Door leaf fits inside the panel with a proportional inset on all sides.
    // leafInset absorbs the combined *0.92 scale + pixel offset that was needed
    // (doorPanelW * 0.115 ≈ (1 - 0.84*0.92) / 2 of panel width per side).
    const doorLeafTex = Assets.get(ASSETS.doorLeaf)
    const leafInset = doorPanelW * 0.115
    const doorLeafW = doorPanelW - leafInset * 2
    const doorLeafH = doorLeafW * (doorLeafTex.height / doorLeafTex.width)
    const doorX = cx - doorLeafW / 2                    // always centered
    const doorLeafY = doorY + (doorH - doorLeafH) / 2  // always centered




    // Texts — centered, positioned from Figma (y=150 and y=196 in 1376×900 frame)
    // Texts float above the door panel.
    // In Figma (doorY=252, doorH=540): "You weren't lost." is 102px above doorY (19% of doorH)
    // and "Just waiting" is 56px above doorY (10% of doorH). Expressing as doorH fractions
    // keeps the gap proportional at any canvas size / aspect ratio.
    const youWerentTex = Assets.get(ASSETS.youWerentLost)
    const youW = sw * 0.317
    const youH = youW * (youWerentTex.height / youWerentTex.width)
    const youX = cx - youW / 2
    const youY = doorY - doorH * 0.3

    const justWaitingTex = Assets.get(ASSETS.justWaiting)
    const jwW = sw * 0.366
    const jwH = jwW * (justWaitingTex.height / justWaitingTex.width)
    const jwX = cx - jwW / 2
    const jwY = doorY - doorH * 0.20

    // Text block height for the -120% shift equivalent

    // Equivalent to CSS `rotateY` around a vertical right-hinge.
    // scale.x = cos(rotY) sweeps 1 → 0 → -1 (full face → edge-on → mirrored back face).
    // No skew/rotation needed: a planar rotateY projects onto 2D as pure horizontal
    // foreshortening — the free edge traces a 3D semicircle but its on-screen X is cos(rotY)·W.
    const doorScaleX = Math.cos(doorRotY)

    const panelCx = cx
    const panelCy = doorY + doorH / 2
    const targetScale = Math.max(sw / doorPanelW, sh / doorH)
    const zoomScale = 1 + zoom * (targetScale - 1)

    return (
        <pixiContainer
            pivot={{ x: panelCx, y: panelCy }}
            position={{ x: panelCx + (cx - panelCx) * zoom, y: panelCy + (sh / 2 - panelCy) * zoom }}
            scale={zoomScale}
        >
            <pixiSprite
                texture={bgTex}
                width={bgW}
                height={bgH}
                x={bgX}
                y={bgY}
                alpha={bgAlpha}
            />
            <pixiSprite
                texture={doorPanelTex}
                width={doorPanelW}
                height={doorH}
                x={doorPanelX}
                y={doorY}
                alpha={doorAlpha}
            />
            <pixiSprite
                texture={doorLeafTex}
                width={doorLeafW}
                height={doorLeafH}
                anchor={{ x: 1, y: 0.5 }}
                x={doorX + doorLeafW}
                y={doorLeafY + doorLeafH / 2}
                scale={{ x: doorScaleX, y: 1 }}
                alpha={doorAlpha}
            />
            <pixiSprite
                texture={youWerentTex}
                width={youW}
                height={youH}
                x={youX}
                y={youY}
                alpha={textAlpha}
            />
            <pixiSprite
                texture={justWaitingTex}
                width={jwW}
                height={jwH}
                x={jwX}
                y={jwY}
                alpha={textAlpha}
            />
        </pixiContainer>
    )
}

function Frame7Mobile({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    const proxyRef = useRef({ bgAlpha: 0, doorAlpha: 0, textAlpha: 0, doorRotY: 0, zoom: 0 })
    const [bgAlpha, setBgAlpha] = useState(0)
    const [doorAlpha, setDoorAlpha] = useState(0)
    const [textAlpha, setTextAlpha] = useState(0)
    const [doorRotY, setDoorRotY] = useState(0)
    const [zoom, setZoom] = useState(0)

    useEffect(() => {
        if (!timeline || !app.renderer) return

        timeline.to(proxyRef.current, {
            bgAlpha: 1,
            duration: SCENE7_FADE_IN_DURATION,
            ease: "power1.out",
            onUpdate() { setBgAlpha(proxyRef.current.bgAlpha) },
        }, ">")

        timeline.to(proxyRef.current, {
            doorAlpha: 1,
            duration: SCENE7_FADE_IN_DURATION,
            ease: "power1.out",
            onUpdate() { setDoorAlpha(proxyRef.current.doorAlpha) },
        }, "<")

        timeline.to(proxyRef.current, {
            textAlpha: 1,
            duration: SCENE7_FADE_IN_DURATION,
            ease: "power2.out",
            onUpdate() { setTextAlpha(proxyRef.current.textAlpha) },
        }, "<")

        timeline.to(proxyRef.current, {
            doorRotY: Math.PI,
            duration: DOOR_OPEN_DURATION,
            ease: SMOOTH_EASE,
            onUpdate() { setDoorRotY(-proxyRef.current.doorRotY) },
        }, ">")

        timeline.to(proxyRef.current, {
            zoom: 1.5,
            duration: DOOR_OPEN_DURATION,
            ease: SMOOTH_EASE,
            onUpdate() { setZoom(proxyRef.current.zoom) },
        }, "<")
    }, [timeline, app.renderer])

    if (!app.renderer) return null

    const sw = app.screen.width
    const sh = app.screen.height
    const cx = sw / 2

    // Mobile Figma reference: 375 × 812
    const bgTex = Assets.get(ASSETS.bg71)
    const bgRatio = bgTex.height / bgTex.width
    const bgW = sw
    const bgH = bgW * bgRatio
    const bgX = 0
    const bgY = sh - bgH

    const doorPanelTex = Assets.get(ASSETS.doorPanel)
    const doorH = sh * 0.42
    const doorPanelW = doorH * (doorPanelTex.width / doorPanelTex.height)
    const doorPanelX = cx - doorPanelW / 2
    const doorY = sh * 0.40

    const doorLeafTex = Assets.get(ASSETS.doorLeaf)
    const leafInset = doorPanelW * 0.115
    const doorLeafW = doorPanelW - leafInset * 2
    const doorLeafH = doorLeafW * (doorLeafTex.height / doorLeafTex.width)
    const doorX = cx - doorLeafW / 2
    const doorLeafY = doorY + (doorH - doorLeafH) / 2

    // Text block from Figma: x=86, y=234 in 375×812 → relative to door
    const youWerentTex = Assets.get(ASSETS.youWerentLost)
    const youW = sw * 0.557
    const youH = youW * (youWerentTex.height / youWerentTex.width)
    const youX = cx - youW / 2
    const youY = doorY - doorH * 0.25

    const justWaitingTex = Assets.get(ASSETS.justWaiting)
    const jwW = sw * 0.557
    const jwH = jwW * (justWaitingTex.height / justWaitingTex.width)
    const jwX = cx - jwW / 2
    const jwY = doorY - doorH * 0.13

    const doorScaleX = Math.cos(doorRotY)

    const panelCx = cx
    const panelCy = doorY + doorH / 2
    const targetScale = Math.max(sw / doorPanelW, sh / doorH)
    const zoomScale = 1 + zoom * (targetScale - 1)

    return (
        <pixiContainer
            pivot={{ x: panelCx, y: panelCy }}
            position={{ x: panelCx + (cx - panelCx) * zoom, y: panelCy + (sh / 2 - panelCy) * zoom }}
            scale={zoomScale}
        >
            <pixiSprite
                texture={bgTex}
                width={bgW}
                height={bgH}
                x={bgX}
                y={bgY}
                alpha={bgAlpha}
            />
            <pixiSprite
                texture={doorPanelTex}
                width={doorPanelW}
                height={doorH}
                x={doorPanelX}
                y={doorY}
                alpha={doorAlpha}
            />
            <pixiSprite
                texture={doorLeafTex}
                width={doorLeafW}
                height={doorLeafH}
                anchor={{ x: 1, y: 0.5 }}
                x={doorX + doorLeafW}
                y={doorLeafY + doorLeafH / 2}
                scale={{ x: doorScaleX, y: 1 }}
                alpha={doorAlpha}
            />
            <pixiSprite
                texture={youWerentTex}
                width={youW}
                height={youH}
                x={youX}
                y={youY}
                alpha={textAlpha}
            />
            <pixiSprite
                texture={justWaitingTex}
                width={jwW}
                height={jwH}
                x={jwX}
                y={jwY}
                alpha={textAlpha}
            />
        </pixiContainer>
    )
}
