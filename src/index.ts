import { initializePreview } from "./util"

/**
 * Agility Preview SDK
 * This works by putting agility-data-* attributes on various elements in your markup.
 */

let isInitialized = false

const setIsInitialized = (state: boolean) => {
  isInitialized = state
}

if (document.readyState !== "loading") {
  initializePreview({ setIsInitialized })
} else {
  //wait for the page to load
  window.addEventListener("readystatechange", (ev: any) => {
    if (
      ev.target.readyState === "complete" ||
      ev.target.readyState === "interactive"
    ) {
      initializePreview({ setIsInitialized })
    }
  })
}
