import {
  initCSSAndPreviewPanel,
  initComponents,
  applyContentItem,
  getGuid,
  invokeFrameEvent,
} from "./"
import {
  getDeepestElementAtCoordinates,
  getUniqueSelector,
} from "./commentUtils"
import {
  dispatchAddCommentLocationEvent,
  dispatchCommentDictionaryUpdatedEvent,
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
interface ICommentDictionary {
  [threadID: string]: {
    guid: string
    layoutID: number
    location: string
    originX: number
    originY: number
    subMetadata: string
    title: string
    tx: number
    ty: number
    visual: Boolean
  }
}
export interface IUpdatedCommentDictionary {
  [threadID: string]: {
    guid: string
    layoutID: number
    location: string
    originX: number
    originY: number
    subMetadata: string
    title: string
    tx: number
    ty: number
    visual: Boolean
    uniqueSelector?: string
    offsetX?: number
    offsetY?: number
  }
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
  //ONLY proceed if we are in an iframe with a legit parent
  // The parent window should be the PreviewIFrame
  if (!window.parent || !window.parent.postMessage) return
  if (window.self === window.top) return

  setIsInitialized(true)

  const agilityGuid = getGuid("initialize preview")

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

      case "comment-create":
        const { originX, originY, threadID } = arg
        const x = originX
        const y = originY
        const element = document.elementFromPoint(x, y)

        if (element) {
          const deepestEle = getDeepestElementAtCoordinates(element, x, y)

          if (deepestEle) {
            //deepestEle.setAttribute('data-ag-thread-id', k)
            const uniqueSelector = getUniqueSelector(deepestEle)
            // get the x and y offsets for the elemnt and send them to the parent
            const rect = deepestEle.getBoundingClientRect()
            // subtract the left and top of the rectangle from the x and y coordinates to get the offset values
            const offsetX = x - rect.left
            const offsetY = y - rect.top
            arg.uniqueSelector = uniqueSelector
            dispatchAddCommentLocationEvent({
              threadID,
              offsetX,
              offsetY,
              fullCommentMetadata: arg,
              uniqueSelector,
            })
          }
        } else {
          console.log("No element found at the specified coordinates.")
        }
      case "update-comment-dictionary": {
        const { commentDictionary } = arg
        // we've received the comment dictionary from the parent, it will be formatted as an ICommmentDictionary. We need to then map over each entry and go through the same process as the comment-create message event and then return an updated dictionary of type IUpdatedCommentDictionary to the parent with the uniqueSelector, offsetX and offsetY added to each entry
        const updatedCommentDictionary: IUpdatedCommentDictionary = {}
        for (const [key, value] of Object.entries(
          commentDictionary as ICommentDictionary
        )) {
          const { originX, originY } = value
          const x = originX
          const y = originY
          const element = document.elementFromPoint(x, y)
          if (element) {
            const deepestEle = getDeepestElementAtCoordinates(element, x, y)
            if (deepestEle) {
              const uniqueSelector = getUniqueSelector(deepestEle)
              const rect = deepestEle.getBoundingClientRect()
              const offsetX = x - rect.left
              const offsetY = y - rect.top
              updatedCommentDictionary[key] = {
                ...value,
                uniqueSelector,
                offsetX,
                offsetY,
              }
            }
          }
        }
        console.log("commentDictionary", commentDictionary)
        // send the updated dictionary back to the parent
        dispatchCommentDictionaryUpdatedEvent({ updatedCommentDictionary })
      }
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
