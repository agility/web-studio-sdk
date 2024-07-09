import {
  initCSSAndPreviewPanel,
  initComponents,
  applyContentItem,
  getGuid,
  invokeFrameEvent,
} from "./"

interface initializePreviewArgs {
  setIsInitialized: (state: boolean) => void
}

export const initializePreview = ({
  setIsInitialized,
}: initializePreviewArgs) => {
  setIsInitialized(true)

  //ONLY proceed if we are in an iframe with a legit parent
  if (!window.parent || !window.parent.postMessage) return
  if (window.self === window.top) return

  const agilityGuid = getGuid("initialize preview")

  let currentPath = location.pathname
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
            "*** Agility Preview Center *** - no pageID found on the `data-agility-page` element. \nMake sure you can an element is set up like this: data-agility-page='{{agilitypageid}}' ."
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
        console.log(
          "*** Agility Preview Center ***: SPA navigation event:",
          fullUrl
        )
        invokeFrameEvent("navigation", { url: fullUrl, pageID, contentID })

        //init the components that may have reloaded...
        initComponents()
      }, 1500)
    }
  }, 100)

  window.addEventListener("message", ({ data }) => {
    const { source, messageType, guid, arg } = data

    //filter out the messages
    if (source !== "agility-instance" || guid !== agilityGuid) return

    switch (messageType) {
      case "ready":
        console.log("*** Agility Preview Center *** Initialized 👍")

        //init the css and preview panel
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
        console.log(
          "*** Agility Preview Center *** Refreshing page...",
          location.href
        )
        setTimeout(() => {
          location.replace(location.href)
        }, 1000)
        break

      default:
        console.log(
          "*** Agility Preview Center *** Unknown message type on website:",
          messageType,
          arg
        )
        break
    }
  })

  //send a message to the parent window to let it know we are ready
  invokeFrameEvent("ready", null)
}
