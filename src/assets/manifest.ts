import { Assets } from "pixi.js"


// desktop
import bg5 from "./desktop/bg5.png"
import greenPlanet from "./desktop/green-planet.svg"
import greenPlanetText from "./desktop/green-planet-text.svg"
import redPlanet from "./desktop/red-planet.svg"
import redPlanetText from "./desktop/red-planet-text.svg"
import beigePlanet from "./desktop/beige-planet.svg"
import beigePlanetText from "./desktop/beige-planet-text.svg"
import circle from "./desktop/circle.svg"
import circleBottomText from "./desktop/circle-bottom-text.svg"
import divider from "./desktop/divider.svg"
import reviews from "./desktop/reviews.png"
import reviewChip1 from "./desktop/review-chip1.svg"
import reviewChip2 from "./desktop/review-chip-2.svg"
import reviewChip3 from "./desktop/review-chip-3.svg"
import bg71 from "./desktop/bg71.svg"
import doorLeaf from "./desktop/door-leaf.svg"
import doorPanel from "./desktop/door-panel.svg"
import doorHandle from "./desktop/door-handle.svg"
import youWerentLost from "./desktop/you-werent-lost.svg"
import justWaiting from "./desktop/just-wainting.svg"
import bg72 from "./desktop/bg72.svg"
import floor72 from "./desktop/floor72.svg"
import lock from "./desktop/lock.svg"
import widgetCodeLeft from "./desktop/widget-code-left.svg"
import widgetCodeRight from "./desktop/widget-code-right.svg"
import iconN8n from "./desktop/icon-n8n.svg"
import iconChatgpt from "./desktop/icon-chatgpt.svg"
import iconTest from "./desktop/icon-test.svg"
import iconRunway from "./desktop/icon-runway.svg"
import iconMake from "./desktop/icon-make.svg"
import iconManus from "./desktop/icon-manus.svg"
import iconCursor from "./desktop/icon-cursor.png"
import iconColor from "./desktop/icon-color.png"
import iconPoe from "./desktop/icon-poe.svg"
import iconGemini from "./desktop/icon-gemini.svg"
import iconMidjourney from "./desktop/icon-midjourney.svg"
import textPermission from "./desktop/text-permission.svg"
import textRightTools from "./desktop/text-right-tools.svg"
import bg73 from "./desktop/bg73.png"
import behindEarly from "./desktop/behind-early.png"
import halfSun from "./desktop/half-sun.png"
import bg74 from "./desktop/bg74.svg"
import explorerText from "./desktop/explorer-text.svg"


// mobile
import mobileBg5 from "./mobile/bg5.png"
import mobileCircleBottomText from "./mobile/circle-bottom-text.svg"
import reviewBoy from "./mobile/review-boy.png"
import reviewBoy2 from "./mobile/review-boy2.png"
import reviewGirl from "./mobile/review-girl.png"
import voiceExp from "./mobile/voice-exp.png"
import mobileBg71 from "./mobile/bg71.svg"
import mobileDoorLeaf from "./mobile/door-leaf.svg"
import mobileDoorPanel from "./mobile/door-panel.svg"
import mobilePerson from "./mobile/person.svg"
import mobileBg72 from "./mobile/bg72.svg"
import mobileBg73 from "./mobile/bg73.png"
import mobileBg74 from "./mobile/bg74.svg"


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
  doorHandle: "doorHandle",
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
  mobileBg73: "mobileBg73",
  mobileBg74: "mobileBg74",
  bg73: "bg73",
  behindEarly: "behindEarly",
  halfSun: "halfSun",
  bg74: "bg74",
  explorerText: "explorerText",
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
      { alias: ASSETS.doorHandle, src: doorHandle },
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
      { alias: ASSETS.bg73, src: bg73 },
      { alias: ASSETS.behindEarly, src: behindEarly },
      { alias: ASSETS.halfSun, src: halfSun },
      { alias: ASSETS.bg74, src: bg74 },
      { alias: ASSETS.explorerText, src: explorerText },
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
      { alias: ASSETS.doorHandle, src: doorHandle },
      { alias: ASSETS.youWerentLost, src: youWerentLost },
      { alias: ASSETS.justWaiting, src: justWaiting },
      { alias: ASSETS.person, src: mobilePerson },
      { alias: ASSETS.mobileBg72, src: mobileBg72 },
      { alias: ASSETS.mobileBg73, src: mobileBg73 },
      { alias: ASSETS.mobileBg74, src: mobileBg74 },
      { alias: ASSETS.explorerText, src: explorerText },
      { alias: ASSETS.behindEarly, src: behindEarly },
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
