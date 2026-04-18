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


    // Figma visual: door spans from ~y=4% to y=93% of frame, ~21% wide
    const doorH = sh * 0.6
    // Door panel (border frame) — same bounds as leaf, layered on top
    const doorPanelTex = Assets.get(ASSETS.doorPanel)
    const doorPanelW = doorH * (doorPanelTex.width / doorPanelTex.height)
    const doorPanelX = cx - doorPanelW / 2
    const doorY = sh * 0.28
    // Door leaf (filled blue panel) — centered, tall
    const doorLeafTex = Assets.get(ASSETS.doorLeaf)

    const doorLeafW = doorH * (doorLeafTex.width / doorLeafTex.height)
    const doorX = cx - doorLeafW / 2




    // Texts — centered, positioned from Figma (y=150 and y=196 in 1376×900 frame)
    const youWerentTex = Assets.get(ASSETS.youWerentLost)
    const youW = sw * (436 / 1376)
    const youH = youW * (youWerentTex.height / youWerentTex.width)
    const youX = cx - youW / 2
    const youY = sh * (150 / 900)

    const justWaitingTex = Assets.get(ASSETS.justWaiting)
    const jwW = sw * (503 / 1376)
    const jwH = jwW * (justWaitingTex.height / justWaitingTex.width)
    const jwX = cx - jwW / 2
    const jwY = sh * (196 / 900)

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
                height={doorH}
                x={doorX}
                y={doorY}
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
