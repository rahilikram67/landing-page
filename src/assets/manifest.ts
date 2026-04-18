import { Assets } from "pixi.js"


// desktop
import bg5 from "./desktop/bg-5.png"
import greenPlanet from "./desktop/green-planet.png"
import greenPlanetText from "./desktop/green-planet-text.png"
import redPlanet from "./desktop/red-planet.png"
import redPlanetText from "./desktop/red-planet-text.png"
import beigePlanet from "./desktop/beige-planet.png"
import beigePlanetText from "./desktop/beige-planet-text.png"
import circle from "./desktop/circle.png"
import circleBottomText from "./desktop/circle-bottom-text.png"
import divider from "./desktop/divider.png"
import reviews from "./desktop/reviews.png"
import reviewChip1 from "./desktop/review-chip1.png"
import reviewChip2 from "./desktop/review-chip-2.png"
import reviewChip3 from "./desktop/review-chip-3.png"
import bg71 from "./desktop/bg7-1.png"
import doorLeaf from "./desktop/door-leaf.png"
import doorPanel from "./desktop/door-panel.png"
import youWerentLost from "./desktop/you-werent-lost..png"
import justWaiting from "./desktop/just-wainting.png"

// mobile
import mobileBg5 from "./mobile/bg5.png"
import mobileCircleBottomText from "./mobile/circle-bottom-text.png"
import reviewBoy from "./mobile/review-boy.png"
import reviewBoy2 from "./mobile/review-boy2.png"
import reviewGirl from "./mobile/review-girl.png"
import voiceExp from "./mobile/voice-exp.png"
import mobileBg71 from "./mobile/bg7-1.png"
import mobileDoorLeaf from "./mobile/door-leaf.png"
import mobileDoorPanel from "./mobile/door-panel.png"
import mobilePerson from "./mobile/person.png"


export const ASSETS = {
  bg5: "bg5",
  greenPlanet: "greenPlanet",
  greenPlanetText: "greenPlanetText",
  redPlanet: "redPlanet",
  redPlanetText: "redPlanetText",
  beigePlanet: "beigePlanet",
  beigePlanetText: "beigePlanetText",
  circle: "circle",
  circleBottomText: "circleBottomText",
  divider: "divider",
  reviews: "reviews",
  pinkBlurBottom: "pinkBlurBottom",
  blueBlurTop: "blueBlurTop",
  reviewChip1: "reviewChip1",
  reviewChip2: "reviewChip2",
  reviewChip3: "reviewChip3",
  reviewBoy: "reviewBoy",
  reviewBoy2: "reviewBoy2",
  reviewGirl: "reviewGirl",
  voiceExp: "voiceExp",
  bg71: "bg71",
  doorLeaf: "doorLeaf",
  doorPanel: "doorPanel",
  youWerentLost: "youWerentLost",
  justWaiting: "justWaiting",
  person: "person",
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
      { alias: ASSETS.circleBottomText, src: circleBottomText },
      { alias: ASSETS.divider, src: divider },
      { alias: ASSETS.reviews, src: reviews },
      { alias: ASSETS.reviewChip1, src: reviewChip1 },
      { alias: ASSETS.reviewChip2, src: reviewChip2 },
      { alias: ASSETS.reviewChip3, src: reviewChip3 },
      { alias: ASSETS.bg71, src: bg71 },
      { alias: ASSETS.doorLeaf, src: doorLeaf },
      { alias: ASSETS.doorPanel, src: doorPanel },
      { alias: ASSETS.youWerentLost, src: youWerentLost },
      { alias: ASSETS.justWaiting, src: justWaiting },
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
      { alias: ASSETS.circleBottomText, src: mobileCircleBottomText },
      { alias: ASSETS.divider, src: divider },
      { alias: ASSETS.reviewBoy, src: reviewBoy },
      { alias: ASSETS.reviewBoy2, src: reviewBoy2 },
      { alias: ASSETS.reviewGirl, src: reviewGirl },
      { alias: ASSETS.voiceExp, src: voiceExp },
      { alias: ASSETS.bg71, src: mobileBg71 },
      { alias: ASSETS.doorLeaf, src: mobileDoorLeaf },
      { alias: ASSETS.doorPanel, src: mobileDoorPanel },
      { alias: ASSETS.youWerentLost, src: youWerentLost },
      { alias: ASSETS.justWaiting, src: justWaiting },
      { alias: ASSETS.person, src: mobilePerson },
    ])

    const bundle = isMobile() ? "mobile" : "desktop"
    loadPromise = Assets.loadBundle(bundle).then(() => {})
  }
  return loadPromise
}
