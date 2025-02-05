import { TFrameEventArgs } from "./frameEvents"
import { getGuid } from "./getGuid"

export type TFrameEvents =
  | "ready"
  | "navigation"
  | "edit-component"
  | "edit-field"
  | "sdk-scroll"
  | "sdk-window-resize"
  | "sdk-refresh"
  | "set-comment-coords"
  | "comment-dictionary-updated"
  | "decorator-map-updated"
  | "set-comment-coords-on-drag-end"

export const invokeFrameEvent = (
  messageType: TFrameEvents,
  arg: TFrameEventArgs
) => {
  const agilityGuid = getGuid(`invoke frame event`)

  //send a message to the parent window to let it know we are ready
  window.parent.postMessage(
    {
      source: "agility-preview-center",
      guid: agilityGuid,
      messageType,
      arg,
    },
    "*"
  )
}
