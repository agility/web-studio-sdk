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
  | "add-comment-metadata"
  | "comment-dictionary-updated"

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
