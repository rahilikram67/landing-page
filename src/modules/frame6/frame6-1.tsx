import { useEffect, useRef, useState } from "react"
import { useApplication } from "@pixi/react"
import { Assets } from "pixi.js"
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
            blurAlpha: 0.85,
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
    

    const btW = sw * 0.5
    const btH = btW * (bottomTextTex.height / bottomTextTex.width)
    const btY = sh * 0.10

    const divW = sw * 0.8
    const divH = divW * (dividerTex.height / dividerTex.width)
    const divY = sh / 2 - divH / 2

    const revW = sw * 0.82
    const revH = revW * (reviewsTex.height / reviewsTex.width)
    const revY = sh - revH - 20

    return (
        <>
            {/* blur PNGs behind all content, covering full canvas */}
            
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
        </>
    )
}
