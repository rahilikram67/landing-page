import { useEffect, useRef, useState } from "react"
import { useApplication } from "@pixi/react"
import { Assets, BlurFilter, Graphics as PixiGraphics } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

export function Frame6_1({ timeline, ctx }: SceneProps) {
    if (ctx.isMobile) return <Frame6_1Mobile timeline={timeline} />
    return <Frame6_1Desktop timeline={timeline} />
}

const REVIEW_CARDS = [ASSETS.reviewGirl, ASSETS.reviewBoy, ASSETS.reviewBoy2] as const

function Frame6_1Mobile({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    const proxyRef = useRef({ fadeIn: 0, reviewSlide: 0 })
    const [fadeIn, setFadeIn] = useState(0)
    const [reviewSlide, setReviewSlide] = useState(0)

    useEffect(() => {
        if (!timeline || !app.renderer) return

        timeline.to(proxyRef.current, {
            fadeIn: 1,
            ease: "power1.out",
            onUpdate() {
                setFadeIn(proxyRef.current.fadeIn)
            },
        })
        timeline.to(proxyRef.current, {
            reviewSlide: REVIEW_CARDS.length - 1,
            ease: "none",
            onUpdate() {
                setReviewSlide(proxyRef.current.reviewSlide)
            },
        })
    }, [timeline, app.renderer])

    if (!app.renderer) return null

    const sw = app.screen.width
    const sh = app.screen.height
    const cx = sw / 2

    const dividerTex = Assets.get(ASSETS.divider)
    const voiceExpTex = Assets.get(ASSETS.voiceExp)

    const divW = sw * 0.9
    const divH = divW * (dividerTex.height / dividerTex.width)
    const divY = sh / 2 - divH / 2

    const veW = sw * 0.7
    const veH = veW * (voiceExpTex.height / voiceExpTex.width)
    const veY = divY + divH + sh * 0.02

    const cardW = sw * 0.85
    const cardPad = sw * 0.05

    return (
        <>
            <pixiSprite
                texture={dividerTex}
                width={divW}
                height={divH}
                x={cx - divW / 2}
                y={divY}
                alpha={fadeIn}
            />
            <pixiSprite
                texture={voiceExpTex}
                width={veW}
                height={veH}
                x={cx*0.8 - veW / 2}
                y={veY}
                alpha={fadeIn}
            />
            {REVIEW_CARDS.map((cardAsset, i) => {
                const cardTex = Assets.get(cardAsset)
                const cW = cardW
                const cH = cW * (cardTex.height / cardTex.width)
                const cY = sh - cH - sh * 0.16

                const offset = i - reviewSlide
                const x = cx + offset * (cardW + cardPad)
                const dist = Math.abs(offset)
                const cardAlpha = Math.max(0, 1 - dist * 1.5) * fadeIn

                return (
                    <pixiSprite
                        key={`review-${i}`}
                        texture={cardTex}
                        width={cW}
                        height={cH}
                        x={x - cW / 2}
                        y={cY}
                        alpha={cardAlpha}
                    />
                )
            })}
        </>
    )
}

function Frame6_1Desktop({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    const proxyRef = useRef({ textAlpha: 0, dividerAlpha: 0, reviewsAlpha: 0, blurAlpha: 0 })
    const blurFilterRef = useRef<BlurFilter | null>(null)
    const [textAlpha, setTextAlpha] = useState(0)
    const [dividerAlpha, setDividerAlpha] = useState(0)
    const [reviewsAlpha, setReviewsAlpha] = useState(0)
    const [blurAlpha, setBlurAlpha] = useState(0)

    useEffect(() => {
        if (!timeline || !app.renderer) return

        timeline.to(proxyRef.current, {
            textAlpha: 1,
            ease: "power1.out",
            onUpdate() {
                setTextAlpha(proxyRef.current.textAlpha)
            },
        }, ">")
        timeline.to(proxyRef.current, {
            dividerAlpha: 1,
            ease: "power1.out",
            onUpdate() {
                setDividerAlpha(proxyRef.current.dividerAlpha)
            },
        }, ">-0.5")
        timeline.to(proxyRef.current, {
            reviewsAlpha: 1,
            ease: "power1.out",
            onUpdate() {
                setReviewsAlpha(proxyRef.current.reviewsAlpha)
            },
        }, ">-0.3")
        timeline.to(proxyRef.current, {
            blurAlpha: 1,
            ease: "power2.out",
            onUpdate() {
                setBlurAlpha(proxyRef.current.blurAlpha)
            },
        }, ">")
    }, [timeline, app.renderer])

    if (!app.renderer) return null

    const sw = app.screen.width
    const sh = app.screen.height
    const cx = sw / 2

    const bottomTextTex = Assets.get(ASSETS.circleBottomText)
    const dividerTex = Assets.get(ASSETS.divider)
    const reviewsTex = Assets.get(ASSETS.reviews)
    const chip1Tex = Assets.get(ASSETS.reviewChip1)
    const chip2Tex = Assets.get(ASSETS.reviewChip2)
    const chip3Tex = Assets.get(ASSETS.reviewChip3)

    // Chip positions from Figma frame (1376×900 reference)
    // chip1: x=327/1376, y=739/900 — bottom-left, under first review card
    // chip2: x=666/1376, y=492/900 — center, above review cards (visual analysis)
    // chip3: x=808/1376, y=757/900 — bottom-right, under third review card
    const c1W = sw * (277 / 1376)
    const c1H = c1W * (chip1Tex.height / chip1Tex.width)
    const c1X = sw * (327 / 1376)
    const c1Y = sh * (837 / 900)

    const c2W = sw * (272 / 1376)
    const c2H = c2W * (chip2Tex.height / chip2Tex.width)
    const c2X = sw * (666 / 1376)
    const c2Y = sh * (580 / 900)

    const c3W = sw * (241 / 1376)
    const c3H = c3W * (chip3Tex.height / chip3Tex.width)
    const c3X = sw * (808 / 1376)
    const c3Y = sh * (837 / 900)

    const btW = sw * 0.5
    const btH = btW * (bottomTextTex.height / bottomTextTex.width)
    const btY = sh * 0.10

    const divW = sw * 0.8
    const divH = divW * (dividerTex.height / dividerTex.width)
    const divY = sh / 2 - divH / 2

    const revW = sw * 0.82
    const revH = revW * (reviewsTex.height / reviewsTex.width)
    const revY = sh - revH - 20

    // wave shape: peaks high on left+right, dips lower in center, oversize to avoid hard clip edges
    const drawBlur = (gfx: PixiGraphics) => {
        if (!blurFilterRef.current) {
            blurFilterRef.current = new BlurFilter({ strength: 90, quality: 5 })
        }
        gfx.clear()
        gfx.moveTo(-150, sh + 150)
        gfx.lineTo(-150, sh * 0.28)
        gfx.bezierCurveTo(sw * 0.01, sh * 1.4, sw * 1.0, sh * 1, sw * 1.2, sh * 0.5)
        gfx.lineTo(sw + 150, sh + 150)
        gfx.closePath()
        gfx.fill(0xA035D0)
        gfx.filters = [blurFilterRef.current]
    }

    return (
        <>
            {/* wave glow behind all content */}
            <pixiGraphics draw={drawBlur} alpha={blurAlpha} />
            <pixiSprite
                texture={bottomTextTex}
                width={btW}
                height={btH}
                x={cx - btW / 2}
                y={btY}
                alpha={textAlpha}
            />
            <pixiSprite
                texture={dividerTex}
                width={divW}
                height={divH}
                x={cx - divW / 2}
                y={divY}
                alpha={dividerAlpha}
            />
            <pixiSprite
                texture={reviewsTex}
                width={revW}
                height={revH}
                x={cx - revW / 2}
                y={revY}
                alpha={reviewsAlpha}
            />
            <pixiSprite
                texture={chip1Tex}
                width={c1W}
                height={c1H}
                x={c1X}
                y={c1Y}
                alpha={blurAlpha}
            />
            <pixiSprite
                texture={chip2Tex}
                width={c2W}
                height={c2H}
                x={c2X}
                y={c2Y}
                alpha={blurAlpha}
            />
            <pixiSprite
                texture={chip3Tex}
                width={c3W}
                height={c3H}
                x={c3X}
                y={c3Y}
                alpha={blurAlpha}
            />
        </>
    )
}
