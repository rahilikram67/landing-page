import { useEffect, useRef, useState } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

export function Frame7({ timeline, ctx }: SceneProps) {
    if (ctx.isMobile) return null
    return <Frame7Desktop timeline={timeline} />
}

function Frame7Desktop({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    const proxyRef = useRef({ bgAlpha: 0, doorAlpha: 0, textAlpha: 0 })
    const [bgAlpha, setBgAlpha] = useState(0)
    const [doorAlpha, setDoorAlpha] = useState(0)
    const [textAlpha, setTextAlpha] = useState(0)

    useEffect(() => {
        if (!timeline || !app.renderer) return

        // Background fades in first
        timeline.to(proxyRef.current, {
            bgAlpha: 1,
            ease: "power1.out",
            onUpdate() {
                setBgAlpha(proxyRef.current.bgAlpha)
            },
        }, ">")

        // Door fades in while background is still coming in
        timeline.to(proxyRef.current, {
            doorAlpha: 1,
            ease: "power1.out",
            onUpdate() {
                setDoorAlpha(proxyRef.current.doorAlpha)
            },
        }, ">-0.4")

        // Texts fade in last
        timeline.to(proxyRef.current, {
            textAlpha: 1,
            ease: "power2.out",
            onUpdate() {
                setTextAlpha(proxyRef.current.textAlpha)
            },
        }, ">-0.3")
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
            {/* Door panel (outer border/glow frame) */}
            <pixiSprite
                texture={doorPanelTex}
                width={doorPanelW}
                height={doorH}
                x={doorPanelX}
                y={doorY}
                alpha={doorAlpha}
            />
            {/* Door leaf (inner fill) — packed inside the panel */}
            <pixiSprite
                texture={doorLeafTex}
                width={doorLeafW}
                height={doorLeafH}
                x={doorX}
                y={doorLeafY}
                alpha={doorAlpha}
            />
            {/* "You weren't lost." */}
            <pixiSprite
                texture={youWerentTex}
                width={youW}
                height={youH}
                x={youX}
                y={youY}
                alpha={textAlpha}
            />
            {/* "Just waiting" */}
            <pixiSprite
                texture={justWaitingTex}
                width={jwW}
                height={jwH}
                x={jwX}
                y={jwY}
                alpha={textAlpha}
            />
        </>
    )
}
