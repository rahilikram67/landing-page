import { Assets } from "pixi.js"

import bg5 from "./desktop/bg-5.png"
import greenPlanet from "./desktop/green-planet.png"
import greenPlanetText from "./desktop/green-planet-text.png"
import redPlanet from "./desktop/red-planet.png"
import redPlanetText from "./desktop/red-planet-text.png"
import beigePlanet from "./desktop/beige-planet.png"
import beigePlanetText from "./desktop/beige-planet-text.png"
import circle from "./desktop/circle.png"

import mobileBg5 from "./mobile/bg5.png"


export const ASSETS = {
  bg5: "bg5",
  greenPlanet: "greenPlanet",
  greenPlanetText: "greenPlanetText",
  redPlanet: "redPlanet",
  redPlanetText: "redPlanetText",
  beigePlanet: "beigePlanet",
  beigePlanetText: "beigePlanetText",
  circle: "circle",
} as const

const MOBILE_BREAKPOINT = 768

export function isMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

let loadPromise: Promise<void> | null = null

export function loadAssets() {
  if (!loadPromise) {
    Assets.addBundle("desktop", [
      { alias: ASSETS.bg5, src: bg5 },
      { alias: ASSETS.greenPlanet, src: greenPlanet },
      { alias: ASSETS.greenPlanetText, src: greenPlanetText },
      { alias: ASSETS.redPlanet, src: redPlanet },
      { alias: ASSETS.redPlanetText, src: redPlanetText },
      { alias: ASSETS.beigePlanet, src: beigePlanet },
      { alias: ASSETS.beigePlanetText, src: beigePlanetText },
      { alias: ASSETS.circle, src: circle },
    ])

    Assets.addBundle("mobile", [
      { alias: ASSETS.bg5, src: mobileBg5 },
      { alias: ASSETS.circle, src: circle },
      { alias: ASSETS.greenPlanet, src: greenPlanet },
      { alias: ASSETS.greenPlanetText, src: greenPlanetText },
      { alias: ASSETS.redPlanet, src: redPlanet },
      { alias: ASSETS.redPlanetText, src: redPlanetText },
      { alias: ASSETS.beigePlanet, src: beigePlanet },
      { alias: ASSETS.beigePlanetText, src: beigePlanetText },
    ])

    const bundle = isMobile() ? "mobile" : "desktop"
    loadPromise = Assets.loadBundle(bundle).then(() => {})
  }
  return loadPromise
}
