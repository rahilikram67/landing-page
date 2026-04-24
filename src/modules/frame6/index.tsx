import { useEffect, useRef, useReducer } from "react"
import { useApplication } from "@pixi/react"
import { Assets, BlurFilter, Graphics as PixiGraphics } from "pixi.js"
import type { SceneProps } from "../../App"
import { ASSETS } from "@/assets/manifest"

export function Frame6({ timeline, ctx }: SceneProps) {
    if (ctx.isMobile) return <Frame6Mobile timeline={timeline} />
    return <Frame6Desktop timeline={timeline} />
}

const REVIEW_CARDS = [ASSETS.reviewGirl, ASSETS.reviewBoy, ASSETS.reviewBoy2] as const

function Frame6Mobile({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    const [, forceRender] = useReducer(x => x + 1, 0)
    const proxyRef = useRef({ fadeIn: 0, reviewSlide: 0, blurAlpha: 0 })
    const blurFilterRef = useRef<BlurFilter | null>(null)
    // Stable draw function reference — only recreated when screen dimensions change
    const drawBlurFnRef = useRef<((gfx: PixiGraphics) => void) | null>(null)
    const prevDimsRef = useRef({ sw: -1, sh: -1 })

    useEffect(() => {
        if (!timeline || !app.renderer) return

        timeline.to(proxyRef.current, {
            fadeIn: 1,
            ease: "power1.out",
            onUpdate: forceRender,
        })
        timeline.to(proxyRef.current, {
            reviewSlide: REVIEW_CARDS.length - 1,
            ease: "none",
            onUpdate: forceRender,
        })
        timeline.to(proxyRef.current, {
            blurAlpha: 1,
            ease: "power2.out",
            onUpdate: forceRender,
        }, ">")
    }, [timeline, app.renderer])

    if (!app.renderer) return null

    const sw = app.screen.width
    const sh = app.screen.height
    const pr = proxyRef.current
    const cx = sw / 2

    // Rebuild draw function only when screen dimensions change (not every frame)
    if (prevDimsRef.current.sw !== sw || prevDimsRef.current.sh !== sh) {
        prevDimsRef.current = { sw, sh }
        drawBlurFnRef.current = (gfx: PixiGraphics) => {
            if (!blurFilterRef.current) {
                blurFilterRef.current = new BlurFilter({ strength: 40, quality: 5 })
            }
            gfx.clear()
            gfx.moveTo(-80, sh + 80)
            gfx.lineTo(-80, sh - 150)
            gfx.bezierCurveTo(sw * 0.25, sh + 20, sw * 0.5, sh + 40, sw * 0.5, sh + 40)
            gfx.bezierCurveTo(sw * 0.5, sh + 40, sw * 0.75, sh + 20, sw + 80, sh - 150)
            gfx.lineTo(sw + 80, sh + 80)
            gfx.closePath()
            gfx.fill(0xA035D0)
            gfx.filters = [blurFilterRef.current]
        }
    }

    const dividerTex = Assets.get(ASSETS.divider)
    const voiceExpTex = Assets.get(ASSETS.voiceExp)

    const divW = sw * 0.9
    const divH = divW * (dividerTex.height / dividerTex.width)
    const divY = sh * 0.6

    const veW = sw * 0.7
    const veH = veW * (voiceExpTex.height / voiceExpTex.width)
    const veY = divY + divH + sh * 0.02

    const cardW = sw * 0.85
    const cardPad = sw * 0.05

    return (
        <>
            <pixiGraphics draw={drawBlurFnRef.current!} alpha={pr.blurAlpha} />
            <pixiSprite
                texture={dividerTex}
                width={divW}
                height={divH}
                x={cx - divW / 2}
                y={divY}
                alpha={pr.fadeIn}
            />
            <pixiSprite
                texture={voiceExpTex}
                width={veW}
                height={veH}
                x={cx*0.8 - veW / 2}
                y={veY}
                alpha={pr.fadeIn}
            />
            {REVIEW_CARDS.map((cardAsset, i) => {
                const cardTex = Assets.get(cardAsset)
                const cW = cardW
                const cH = cW * (cardTex.height / cardTex.width)
                const cY = sh - cH - sh * 0.05

                const offset = i - pr.reviewSlide
                const x = cx + offset * (cardW + cardPad)
                const dist = Math.abs(offset)
                const cardAlpha = Math.max(0, 1 - dist * 1.5) * pr.fadeIn

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

function Frame6Desktop({ timeline }: { timeline: GSAPTimeline }) {
    const { app } = useApplication()
    const [, forceRender] = useReducer(x => x + 1, 0)
    const proxyRef = useRef({ textAlpha: 0, dividerAlpha: 0, reviewsAlpha: 0, blurAlpha: 0 })
    const blurFilterRef = useRef<BlurFilter | null>(null)
    // Stable draw function reference — only recreated when screen dimensions change
    const drawBlurFnRef = useRef<((gfx: PixiGraphics) => void) | null>(null)
    const prevDimsRef = useRef({ sw: -1, sh: -1 })

    useEffect(() => {
        if (!timeline || !app.renderer) return

        timeline.to(proxyRef.current, {
            textAlpha: 1,
            ease: "power1.out",
            onUpdate: forceRender,
        }, ">")
        timeline.to(proxyRef.current, {
            dividerAlpha: 1,
            ease: "power1.out",
            onUpdate: forceRender,
        }, ">-0.5")
        timeline.to(proxyRef.current, {
            reviewsAlpha: 1,
            ease: "power1.out",
            onUpdate: forceRender,
        }, ">-0.3")
        timeline.to(proxyRef.current, {
            blurAlpha: 1,
            ease: "power2.out",
            onUpdate: forceRender,
        }, ">")
    }, [timeline, app.renderer])

    if (!app.renderer) return null

    const sw = app.screen.width
    const sh = app.screen.height
    const pr = proxyRef.current
    const cx = sw / 2

    // Rebuild draw function only when screen dimensions change (not every frame)
    if (prevDimsRef.current.sw !== sw || prevDimsRef.current.sh !== sh) {
        prevDimsRef.current = { sw, sh }
        drawBlurFnRef.current = (gfx: PixiGraphics) => {
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
    }

    const bottomTextTex = Assets.get(ASSETS.circleBottomText)
    const dividerTex = Assets.get(ASSETS.divider)
    const reviewsTex = Assets.get(ASSETS.reviews)
    const chip1Tex = Assets.get(ASSETS.reviewChip1)
    const chip2Tex = Assets.get(ASSETS.reviewChip2)
    const chip3Tex = Assets.get(ASSETS.reviewChip3)

    const btW = sw * 0.5
    const btH = btW * (bottomTextTex.height / bottomTextTex.width)
    const btY = sh * 0.10

    const divW = sw * 0.8
    const divH = divW * (dividerTex.height / dividerTex.width)
    const divY = sh / 2 - divH / 2

    const revW = sw * 0.82
    const revH = revW * (reviewsTex.height / reviewsTex.width)
    const revX = cx - revW / 2
    const revY = sh - revH - 20

    // All chip sizes and positions are expressed as fractions of revW / revH so they
    // stay locked to the reviews image at any canvas size or aspect ratio.
    // Figma reference frame: 1376×900, reviews section 1151×319 at revX≈124, revY≈568.
    // chip1 (bottom-left, below 1st card):  Figma x=327→(327-124)/1151≈0.18, y=739→(739-568)/319≈0.55
    // chip2 (center, above cards):          Figma x=561→(561-124)/1151≈0.38, y=510→(510-568)/319≈-0.18
    // chip3 (bottom-right, below 3rd card): Figma x=808→(808-124)/1151≈0.59, y=757→(757-568)/319≈0.59
    const c1W = revW * 0.245
    const c1H = c1W * (chip1Tex.height / chip1Tex.width)
    const c1X = revX + revW * 0.18
    const c1Y = revY + revH * 0.88

    const c2W = revW * 0.241
    const c2H = c2W * (chip2Tex.height / chip2Tex.width)
    const c2X = revX + revW * 0.38
    const c2Y = revY + revH * 0.12

    const c3W = revW * 0.214
    const c3H = c3W * (chip3Tex.height / chip3Tex.width)
    const c3X = revX + revW * 0.59
    const c3Y = revY + revH * 0.88

    return (
        <>
            {/* wave glow behind all content */}
            <pixiGraphics draw={drawBlurFnRef.current!} alpha={pr.blurAlpha} />
            <pixiSprite
                texture={bottomTextTex}
                width={btW}
                height={btH}
                x={cx - btW / 2}
                y={btY}
                alpha={pr.textAlpha}
            />
            <pixiSprite
                texture={dividerTex}
                width={divW}
                height={divH}
                x={cx - divW / 2}
                y={divY}
                alpha={pr.dividerAlpha}
            />
            <pixiSprite
                texture={reviewsTex}
                width={revW}
                height={revH}
                x={revX}
                y={revY}
                alpha={pr.reviewsAlpha}
            />
            <pixiSprite
                texture={chip1Tex}
                width={c1W}
                height={c1H}
                x={c1X}
                y={c1Y}
                alpha={pr.blurAlpha}
            />
            <pixiSprite
                texture={chip2Tex}
                width={c2W}
                height={c2H}
                x={c2X}
                y={c2Y}
                alpha={pr.blurAlpha}
            />
            <pixiSprite
                texture={chip3Tex}
                width={c3W}
                height={c3H}
                x={c3X}
                y={c3Y}
                alpha={pr.blurAlpha}
            />
        </>
    )
}
