import {
  initCSSAndPreviewPanel,
  initComponents,
  applyContentItem,
  getGuid,
  invokeFrameEvent,
} from "./"
import {
  dispatchNavigationEvent,
  dispatchReadyEvent,
  dispatchScrollEvent,
  dispatchWindowResizeEvent,
  INavigationEventArgs,
  IScrollEventArgs,
} from "./frameEvents"

interface initializePreviewArgs {
  setIsInitialized: (state: boolean) => void
}

// throttle function to limit the number of times a function can be called
const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
) => {
  let lastFunc: ReturnType<typeof setTimeout> | undefined
  let lastRan: number | undefined

  return function (this: unknown, ...args: Parameters<T>) {
    const context = this
    // if we haven't run the function yet, run it and set the lastRan time
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      // if we have run the function, clear the lastFunc timeout and set a new one
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function () {
        // if the time since the last ran is greater than the limit, run the function
        if (Date.now() - lastRan! >= limit) {
          func.apply(context, args)
          // set the lastRan time to now
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  } as T
}

export const initializePreview = ({
  setIsInitialized,
}: initializePreviewArgs) => {
  setIsInitialized(true)

  //ONLY proceed if we are in an iframe with a legit parent
  // The parent window should be the PreviewIFrame
  if (!window.parent || !window.parent.postMessage) return
  if (window.self === window.top) return

  const agilityGuid = getGuid("initialize preview")

  let currentPath = ""
  // run this on the first load always
  setInterval(() => {
    //see if the path has changed (popstate is not reliable here...)

    if (location.pathname !== currentPath) {
      currentPath = location.pathname
      setTimeout(() => {
        const agilityPageIDElem = document.querySelector("[data-agility-page]")
        const agilityDynamicContentElem = document.querySelector(
          "[data-agility-dynamic-content]"
        )
        let pageID: any = -1
        let contentID: any = -1
        if (agilityPageIDElem) {
          pageID = parseInt(
            agilityPageIDElem.getAttribute("data-agility-page") || ""
          )
        }
        //don't proceed if we don't have a pageID
        if (isNaN(pageID) || pageID < 1) {
          console.warn(
            "%cWeb Studio SDK\n - no pageID found on the `data-agility-page` element. \nMake sure you have an element set up like this: data-agility-page='{{agilitypageid}}' .",
            "font-weight: bold"
          )
          return
        }

        if (agilityDynamicContentElem) {
          contentID = agilityDynamicContentElem.getAttribute(
            "data-agility-dynamic-content"
          )
        }

        //TODO: send this event data to the parent window
        let fullUrl = location.href
        if (fullUrl.indexOf("?") > -1) {
          fullUrl = fullUrl.substring(0, fullUrl.indexOf("?"))
        }

        const args: INavigationEventArgs = {
          url: fullUrl,
          pageID,
          contentID,
          windowScrollableHeight: document.documentElement.scrollHeight,
          windowHeight: window.innerHeight,
        }

        dispatchNavigationEvent(args)
        //init the components that may have reloaded...
        initComponents()
      }, 750)
    }
  }, 100)
  //Add a listener for resize and scroll events on our window which will fire either the `sdk-window-resize` or `sdk-window-scroll` events to the parent window we will also need to debounce these events
  let resizeTimeout: any
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      const args = {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        windowScrollableHeight: document.documentElement.scrollHeight,
      }

      dispatchWindowResizeEvent(args)
    }, 250)
  })

  const throttledScrollHandler = throttle(() => {
    const args: IScrollEventArgs = {
      windowScrollableHeight: document.documentElement.scrollHeight,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      scrollY: window.scrollY,
      scrollX: window.scrollX,
    }
    dispatchScrollEvent(args)
  }, 10)

  window.addEventListener("scroll", throttledScrollHandler)

  window.addEventListener("message", ({ data }) => {
    const { source, messageType, guid, arg } = data

    //filter out the messages
    if (source !== "agility-instance" || guid !== agilityGuid) return

    switch (messageType) {
      case "ready":
        initCSSAndPreviewPanel()
        //set the components
        initComponents()

        break

      case "content-change": {
        const contentItem = arg
        applyContentItem(contentItem)
        break
      }

      case "refresh":
        setTimeout(() => {
          location.replace(location.href)
        }, 1000)
        break

      default:
        console.warn(
          "%cWeb Studio SDK\n Unknown message type on website:",
          "font-weight: bold",
          messageType,
          arg
        )
        break
    }
  })

  // if we have the width, height and url of our window, and we're ready send it to the parent
  const windowWidth = window.innerWidth
  const windowHeight = window.outerHeight
  // check if the document has loaded with any of the data-agility attributes
  const hasPageDecorators = document.querySelector("[data-agility-page]")
  const hasComponentDecorators = document.querySelector(
    "[data-agility-component]"
  )
  const hasFieldDecorators = document.querySelector("[data-agility-field]")

  dispatchReadyEvent({
    windowWidth,
    windowHeight,
    hasPageDecorators: !!hasPageDecorators,
    hasComponentDecorators: !!hasComponentDecorators,
    hasFieldDecorators: !!hasFieldDecorators,
    windowScrollableHeight: document.documentElement.scrollHeight,
  })
}
