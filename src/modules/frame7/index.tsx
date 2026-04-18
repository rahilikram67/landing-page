import { useEffect, useRef, useState } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

export function Frame7({ timeline, ctx }: SceneProps) {
    if (ctx.isMobile) return null
    return <Frame7Desktop timeline={timeline} />
}

const SMOOTH_EASE = "power2.inOut"
const DOOR_OPEN_DURATION = 2.5
const SCENE7_FADE_IN_DURATION = 1.2

function Frame7Desktop({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    // doorRotY = simulated rotateY in radians, 0 (closed/facing viewer) → PI (open/180° flipped).
    // scale.x derived as cos(doorRotY) → sweeps 1 → 0 → -1 (edge-on at midpoint, mirrored at end).
    const proxyRef = useRef({ bgAlpha: 0, doorAlpha: 0, textAlpha: 0, doorRotY: 0, textYShift: 0, zoomProgress: 0 })
    const [bgAlpha, setBgAlpha] = useState(0)
    const [doorAlpha, setDoorAlpha] = useState(0)
    const [textAlpha, setTextAlpha] = useState(0)
    const [doorRotY, setDoorRotY] = useState(0)
    const [textYShift, setTextYShift] = useState(0)
    const [zoomProgress, setZoomProgress] = useState(0)

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
        }, ">-0.4")

        // Texts fade in last
        timeline.to(proxyRef.current, {
            textAlpha: 1,
            duration: SCENE7_FADE_IN_DURATION,
            ease: "power2.out",
            onUpdate() {
                setTextAlpha(proxyRef.current.textAlpha)
            },
        }, ">-0.3")

        // --- Door open: leaf collapses from right edge (rotateY equivalent) ---
        // and text floats up (-120% of its block height) simultaneously.
        // textYShift is a unit value [0 → -1]; actual pixel offset is computed in render.
        timeline.addLabel("doorOpenStart", ">")

        timeline.to(proxyRef.current, {
            doorRotY: Math.PI,
            duration: DOOR_OPEN_DURATION,
            ease: SMOOTH_EASE,
            onUpdate() {
                setDoorRotY(-proxyRef.current.doorRotY)
            },
        }, "doorOpenStart")

        timeline.to(proxyRef.current, {
            textYShift: -1,
            duration: DOOR_OPEN_DURATION,
            ease: SMOOTH_EASE,
            onUpdate() { setTextYShift(proxyRef.current.textYShift) },
        }, "doorOpenStart")

        // Camera zoom: panel grows from 1× to fill the canvas as the door opens.
        // Stored as 0→1 progress; actual scale is computed in render so it stays
        // responsive to canvas resize.
        timeline.to(proxyRef.current, {
            zoomProgress: 1,
            duration: DOOR_OPEN_DURATION,
            ease: SMOOTH_EASE,
            onUpdate() { setZoomProgress(proxyRef.current.zoomProgress) },
        }, "doorOpenStart")
    }, [timeline, app.renderer])

    if (!app.renderer) return null

    const sw = app.screen.width
    const sh = app.screen.height
    const cx = sw / 2

    // Figma frame reference: 1376×900
    // BG bleeds slightly beyond the frame: x=-25, y=-50, w=1425, h=950
    const bgTex = Assets.get(ASSETS.bg71)
    const bgW = sw * (1425 / 1376)
    const bgH = sh * (950 / 900)
    const bgX = sw * (-25 / 1376)
    const bgY = sh * (-50 / 900)


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
    const textBlockH = (jwY + jwH) - youY
    const textOffset = textYShift * textBlockH * 1.2

    // Equivalent to CSS `rotateY` around a vertical right-hinge.
    // scale.x = cos(rotY) sweeps 1 → 0 → -1 (full face → edge-on → mirrored back face).
    // No skew/rotation needed: a planar rotateY projects onto 2D as pure horizontal
    // foreshortening — the free edge traces a 3D semicircle but its on-screen X is cos(rotY)·W.
    const doorScaleX = Math.cos(doorRotY)

    // Camera zoom: the door-panel container scales around the panel's centre until the
    // panel covers the entire canvas. maxZoom is computed from current canvas dims so it
    // stays correct after resize. Container pivot == position so children render in
    // screen-space coords at scale=1.
    const panelCenterX = cx
    const panelCenterY = doorY + doorH / 2
    const maxZoom = Math.max(sw / doorPanelW, sh / doorH) * 1.05
    const panelScale = 1 + zoomProgress * (maxZoom - 1)

    return (
        <>
            {/* Background scene */}
            <pixiSprite
                texture={bgTex}
                width={bgW}
                height={bgH}
                x={bgX}
                y={bgY}
                alpha={bgAlpha}
            />
            {/* Door panel + leaf wrapped in a container so they zoom together as a unit.
                position == pivot means children render at their world coords at scale=1,
                and the whole group scales around the panel centre as zoom progresses. */}
            <pixiContainer
                x={panelCenterX}
                y={panelCenterY}
                pivot={{ x: panelCenterX, y: panelCenterY }}
                scale={panelScale}
            >
                {/* Door panel (outer border/glow frame) */}
                <pixiSprite
                    texture={doorPanelTex}
                    width={doorPanelW}
                    height={doorH}
                    x={doorPanelX}
                    y={doorY}
                    alpha={doorAlpha}
                />
                {/* Door leaf — CSS rotateY equivalent around the right hinge.
                    anchor right-center = transformOrigin: right center.
                    scale.x = cos(rotY) sweeps 1 → 0 → -1, mirroring the door at 180°. */}
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
            </pixiContainer>
            {/* "You weren't lost." — floats up with door open (y: '-120%' equivalent) */}
            <pixiSprite
                texture={youWerentTex}
                width={youW}
                height={youH}
                x={youX}
                y={youY + textOffset}
                alpha={textAlpha}
            />
            {/* "Just waiting" */}
            <pixiSprite
                texture={justWaitingTex}
                width={jwW}
                height={jwH}
                x={jwX}
                y={jwY + textOffset}
                alpha={textAlpha}
            />
        </>
    )
}
