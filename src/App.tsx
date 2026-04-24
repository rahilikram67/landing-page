import { useEffect, useRef, useState } from "react"
import { Frame12 } from "./modules/frame1_2"
import { Frame3 }  from "./modules/frame3"
import { Frame4 }  from "./modules/frame4"
import { Frame5 } from "./modules/frame5"
import { Frame6 } from "./modules/frame6"
import { Frame7_1 } from "./modules/frame7_1"
import { Frame7_2 } from "./modules/frame7_2"
import { Frame7_3 } from "./modules/frame7_3"
import { Frame7_4 } from "./modules/frame7_4"
import { Frame8 } from "./modules/frame8"
import { Application, extend } from "@pixi/react"
import type { ComponentType } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { loadAssets } from "./assets/manifest"
import { Container, Sprite, Graphics,Text } from "pixi.js"
import 'pixi.js/advanced-blend-modes'
import Lenis from "lenis"
extend({ Sprite, Container, Graphics,Text })

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })


export interface SceneCtx {
  isMobile: boolean
  // isTablet: boolean
  isDesktop: boolean
}

export interface SceneProps {
  timeline: GSAPTimeline
  ctx: SceneCtx
}

const SCENES: ComponentType<SceneProps>[] = [
  Frame12,
  Frame3,
  Frame4,
  Frame5,
  Frame6,
  Frame7_1,
  Frame7_2,
  Frame7_3,
  Frame7_4,
  Frame8,
]

// 100% scroll height per scene, plus a base 100% for the initial view
const DESKTOP_SCROLL = `+=${SCENES.length * 120}%`
const MOBILE_SCROLL  = `+=${SCENES.length * 80}%`

function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [sceneProps, setSceneProps] = useState<SceneProps | null>(null)
  const [assetsReady, setAssetsReady] = useState(false)

  useEffect(() => {
    loadAssets().then(() => setAssetsReady(true))
  }, [])

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches

    if (isTouch) {
      ScrollTrigger.normalizeScroll(true)
      return
    }

    const lenis = new Lenis({ lerp: 0.08 })

    lenis.on("scroll", ScrollTrigger.update)

    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      {
        isMobile: "(max-width: 767px)",
        // isTablet: "(min-width: 768px) and (max-width: 1024px)",
        isDesktop: "(min-width: 768px)",
        // isDesktop: "(min-width: 1024px)",
      },
      (context) => {
        const { isMobile, isDesktop } = context.conditions as {
          isMobile: boolean
          isDesktop: boolean
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#scroll-container",
            start: "top top",
            end: isDesktop ? DESKTOP_SCROLL : MOBILE_SCROLL,
            pin: true,
            scrub: 1,
          },
        })

        setSceneProps({
          timeline: tl,
          ctx: {
            isMobile,/*isTablet,*/isDesktop,
          },
        })

        return () => {
          tl.kill()
          setSceneProps(null)
        }
      }
    )

    return () => {
      mm.kill()
      ScrollTrigger.killAll()
    }
  }, [])

  return (
    <>
      {/* Scroll container — pin target for ScrollTrigger */}
      <div
        id="scroll-container"
        ref={containerRef}
        className="relative w-full h-screen mt-auto mx-auto max-w-[1440px] overflow-hidden md:max-h-[851px]"
      >
        {assetsReady && sceneProps && <Application
          resizeTo={containerRef}
          backgroundAlpha={1}
          background="#fff"
          antialias
          autoStart
          className="absolute inset-0 size-full"
          useBackBuffer={true}
        >
          <pixiContainer>
            {SCENES.map((Scene, i) => (
              <Scene key={i} timeline={sceneProps.timeline} ctx={sceneProps.ctx} />
            ))}
          </pixiContainer>
        </Application>}

        {!(assetsReady && sceneProps) && (
          <div className="flex items-center justify-center">
            <div className="text-white text-2xl font-bold">Loading...</div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
