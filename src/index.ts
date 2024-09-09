import { initComponents, initializePreview } from "./util"
import {
  dispatchNavigationEvent,
  INavigationEventArgs,
} from "./util/frameEvents"

/**
 * Agility Preview SDK
 * This works by putting agility-data-* attributes on various elements in your markup.
 */

let isInitialized = false

const setIsInitialized = (state: boolean) => {
  isInitialized = state
}
const onLocationChange = () => {
  const agilityPageIDElem = document.querySelector("[data-agility-page]")
  const agilityDynamicContentElem = document.querySelector(
    "[data-agility-dynamic-content]"
  )
  //initialize pageID and contentID
  let pageID: any = -1
  let contentID: any = -1

  //if agilityPageIDElem exists, get the pageID from its data attribute
  if (agilityPageIDElem) {
    pageID = parseInt(agilityPageIDElem.getAttribute("data-agility-page") || "")
  }

  //don't proceed if we don't have a valid pageID
  if (isNaN(pageID) || pageID < 1) {
    console.warn(
      "%cWeb Studio SDK\n - no pageID found on the `data-agility-page` element. \nMake sure you have an element set up like this: data-agility-page='{{agilitypageid}}' .",
      "font-weight: bold"
    )
    return
  }

  //if agilityDynamicContentElem exists, get the contentID from its data attribute
  if (agilityDynamicContentElem) {
    contentID = agilityDynamicContentElem.getAttribute(
      "data-agility-dynamic-content"
    )
  }

  //prepare the full URL without query parameters
  let fullUrl = location.href
  if (fullUrl.indexOf("?") > -1) {
    fullUrl = fullUrl.substring(0, fullUrl.indexOf("?"))
  }

  //create the navigation event arguments
  const args: INavigationEventArgs = {
    url: fullUrl,
    pageID,
    contentID,
    windowScrollableHeight: document.documentElement.scrollHeight,
    windowHeight: window.innerHeight,
  }

  //dispatch the navigation event
  dispatchNavigationEvent(args)
  //initialize the components that may have reloaded
  initComponents()
}

if (document.readyState !== "loading") {
  console.log("document.readyState !== loading")
  let lastLocation = location.href
  // add an observer to watch for location changes
  const locationObserver = new MutationObserver(() => {
    if (lastLocation !== location.href) {
      lastLocation = location.href
      console.log("lastLocation !== location.href calling ")
      onLocationChange()
    }
  })
  // start observing the body
  locationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })
  // add an observer to monitor when the components have loaded in with the agility-data-* attributes and values
  const componentsObserver = new MutationObserver(() => {
    if (isInitialized) {
      console.log("isInitialized , initComponents")
      initComponents()
    }
  })
  // start observing the body
  componentsObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })

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
