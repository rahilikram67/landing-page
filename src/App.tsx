import { useEffect, useRef, useState } from "react"
import { Frame5 } from "./modules/frame5"
import { Frame6_1 } from "./modules/frame6/frame6-1"
import { Application, extend } from "@pixi/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { loadAssets } from "./assets/manifest"
import { Container, Sprite, Graphics } from "pixi.js"

extend({ Sprite, Container, Graphics })

gsap.registerPlugin(ScrollTrigger)


export interface SceneCtx {
  isMobile: boolean
  // isTablet: boolean
  isDesktop: boolean
}

export interface SceneProps {
  timeline: GSAPTimeline
  ctx: SceneCtx
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [sceneProps, setSceneProps] = useState<SceneProps | null>(null)
  const [assetsReady, setAssetsReady] = useState(false)

  useEffect(() => {
    loadAssets().then(() => setAssetsReady(true))
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
            end: isDesktop ? "+=300%" : "+=200%",
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
        className="relative w-full h-screen mx-auto max-w-[1440px] overflow-hidden max-h-[851px]"
      >
        {assetsReady && sceneProps && <Application
          resizeTo={containerRef}
          backgroundAlpha={0}
          antialias
          autoStart
          className="absolute inset-0 size-full pointer-events-none"
        >
          <pixiContainer>
            <Frame5 timeline={sceneProps.timeline} ctx={sceneProps.ctx} />
            <Frame6_1 timeline={sceneProps.timeline} ctx={sceneProps.ctx} />
          </pixiContainer>
        </Application>}
      </div>
    </>
  )
}

export default App
