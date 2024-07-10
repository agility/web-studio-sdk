import { getGuid } from "./getGuid"

export const invokeFrameEvent = (messageType: string, arg: any) => {
  const agilityGuid = getGuid(`invoke frame event`)
  console.log(messageType)
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
