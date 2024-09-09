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
  // add an observer to watch for location changes
  const observer = new MutationObserver((target, options) => {
      onLocationChange()
  })

  // start observing the body
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-agility-page", "data-agility-dynamic-content", "data-agility-guid", "data-agility-field", "data-agility-component", "data-agility-html", "data-agility-previewbar"]
  })
  
  initializePreview({ setIsInitialized })
}
