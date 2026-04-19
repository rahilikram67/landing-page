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
import bg72 from "./desktop/bg72.png"
import floor72 from "./desktop/floor72.png"
import lock from "./desktop/lock.png"
import widgetCodeLeft from "./desktop/widget-code-left.png"
import widgetCodeRight from "./desktop/widget-code-right.png"
import iconN8n from "./desktop/icon-n8n.png"
import iconChatgpt from "./desktop/icon-chatgpt.png"
import iconTest from "./desktop/icon-test.png"
import iconRunway from "./desktop/icon-runway.png"
import iconMake from "./desktop/icon-make.png"
import iconManus from "./desktop/icon-manus.png"
import iconCursor from "./desktop/icon-cursor.png"
import iconColor from "./desktop/icon-color.png"
import iconPoe from "./desktop/icon-poe.png"
import iconGemini from "./desktop/icon-gemini.png"
import iconMidjourney from "./desktop/icon-midjourney.png"
import textPermission from "./desktop/text-permission.png"
import textRightTools from "./desktop/text-right-tools.png"

// mobile
import mobileBg5 from "./mobile/bg5.png"
import mobileCircleBottomText from "./mobile/circle-bottom-text.png"
import reviewBoy from "./mobile/review-boy.png"
import reviewBoy2 from "./mobile/review-boy2.png"
import reviewGirl from "./mobile/review-girl.png"
import voiceExp from "./mobile/voice-exp.png"
import mobileBg71 from "./mobile/bg71.png"
import mobileDoorLeaf from "./mobile/door-leaf.png"
import mobileDoorPanel from "./mobile/door-panel.png"
import mobilePerson from "./mobile/person.png"
import mobileBg72 from "./mobile/bg72.png"


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
  bg72: "bg72",
  floor72: "floor72",
  lock: "lock",
  widgetCodeLeft: "widgetCodeLeft",
  widgetCodeRight: "widgetCodeRight",
  iconN8n: "iconN8n",
  iconChatgpt: "iconChatgpt",
  iconTest: "iconTest",
  iconRunway: "iconRunway",
  iconMake: "iconMake",
  iconManus: "iconManus",
  iconCursor: "iconCursor",
  iconColor: "iconColor",
  iconPoe: "iconPoe",
  iconGemini: "iconGemini",
  iconMidjourney: "iconMidjourney",
  textPermission: "textPermission",
  textRightTools: "textRightTools",
  mobileBg72: "mobileBg72",
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
      { alias: ASSETS.bg72, src: bg72 },
      { alias: ASSETS.floor72, src: floor72 },
      { alias: ASSETS.lock, src: lock },
      { alias: ASSETS.widgetCodeLeft, src: widgetCodeLeft },
      { alias: ASSETS.widgetCodeRight, src: widgetCodeRight },
      { alias: ASSETS.iconN8n, src: iconN8n },
      { alias: ASSETS.iconChatgpt, src: iconChatgpt },
      { alias: ASSETS.iconTest, src: iconTest },
      { alias: ASSETS.iconRunway, src: iconRunway },
      { alias: ASSETS.iconMake, src: iconMake },
      { alias: ASSETS.iconManus, src: iconManus },
      { alias: ASSETS.iconCursor, src: iconCursor },
      { alias: ASSETS.iconColor, src: iconColor },
      { alias: ASSETS.iconPoe, src: iconPoe },
      { alias: ASSETS.iconGemini, src: iconGemini },
      { alias: ASSETS.iconMidjourney, src: iconMidjourney },
      { alias: ASSETS.textPermission, src: textPermission },
      { alias: ASSETS.textRightTools, src: textRightTools },
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
      { alias: ASSETS.mobileBg72, src: mobileBg72 },
      { alias: ASSETS.textPermission, src: textPermission },
      { alias: ASSETS.textRightTools, src: textRightTools },
      { alias: ASSETS.floor72, src: floor72 },
      { alias: ASSETS.lock, src: lock },
      { alias: ASSETS.widgetCodeLeft, src: widgetCodeLeft },
      { alias: ASSETS.widgetCodeRight, src: widgetCodeRight },
      { alias: ASSETS.iconN8n, src: iconN8n },
      { alias: ASSETS.iconChatgpt, src: iconChatgpt },
      { alias: ASSETS.iconTest, src: iconTest },
      { alias: ASSETS.iconRunway, src: iconRunway },
      { alias: ASSETS.iconMake, src: iconMake },
      { alias: ASSETS.iconManus, src: iconManus },
      { alias: ASSETS.iconPoe, src: iconPoe },
      { alias: ASSETS.iconGemini, src: iconGemini },
      { alias: ASSETS.iconMidjourney, src: iconMidjourney },
    ])

    const bundle = isMobile() ? "mobile" : "desktop"
    loadPromise = Assets.loadBundle(bundle).then(() => {})
  }
  return loadPromise
}
