import {
  initCSSAndPreviewPanel,
  initComponents,
  applyContentItem,
  getGuid,
  invokeFrameEvent,
  handleCollaborationToggle,
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
          console.log("content id", contentID)
        }

        //TODO: send this event data to the parent window
        let fullUrl = location.href
        if (fullUrl.indexOf("?") > -1) {
          fullUrl = fullUrl.substring(0, fullUrl.indexOf("?"))
        }
        console.log(
          "%cWeb Studio SDK:\n SPA navigation event:",
          "font-weight:bold",
          { fullUrl, pageID, contentID }
        )
        const args: INavigationEventArgs = {
          url: fullUrl,
          pageID,
          contentID,
          windowScrollableHeight: document.documentElement.scrollHeight,
          windowHeight: window.innerHeight,
        }
        // console.log("sdk args", args)
        // console.dir(args)
        dispatchNavigationEvent(args)
        //init the components that may have reloaded...
        initComponents()
      }, 1500)
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
      console.log(
        "%cWeb Studio SDK\n Window Resize Event",
        "font-weight: bold",
        args
      )
      dispatchWindowResizeEvent(args)
    }, 250)
  })

  let scrollTimeout: any
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      const args: IScrollEventArgs = {
        windowScrollableHeight: document.documentElement.scrollHeight,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        scrollY: window.scrollY,
        scrollX: window.scrollX,
      }
      dispatchScrollEvent(args)
      console.log(
        "%cWeb Studio SDK\n Window Scroll Event",
        "font-weight: bold",
        args
      )
    }, 250)
  })

  // listen for messages from the parent window
  window.addEventListener("message", ({ data }) => {
    const { source, messageType, guid, arg } = data

    //filter out the messages
    if (source !== "agility-instance" || guid !== agilityGuid) return

    switch (messageType) {
      // parent window received the ready event from the sdk
      case "ready":
        console.log("%cWeb Studio SDK\n Initialized Event", "font-weight: bold")

        //init the css and preview panel
        console.log(
          "%cWeb Studio SDK\n initializing the css and Preview panel",
          "font-weight: bold"
        )
        initCSSAndPreviewPanel()

        //set the components
        initComponents()

        break
      //received the content-change event from the parent
      case "content-change": {
        const contentItem = arg
        applyContentItem(contentItem)
        break
      }
      // recieved a refresh event from the parent
      case "refresh":
        console.log(
          "'%cWeb Studio SDK\n %cRefresh Event', 'font-weight: bold', 'color: green'",
          location.href
        )
        setTimeout(() => {
          location.replace(location.href)
        }, 1000)
        break
      case "collaboration-mode-toggled":
        console.log(
          "%cWeb Studio SDK\n Collaboration Mode Toggled",
          "font-weight: bold"
        )
        const isCollaborating = arg
        handleCollaborationToggle(isCollaborating)
        break
      default:
        console.log(
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
