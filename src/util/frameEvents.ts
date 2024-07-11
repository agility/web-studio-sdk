import { TFrameEvents, invokeFrameEvent } from "./invokeFrameEvent"
import { getGuid } from "./getGuid"

interface IReadyEventArgs {
  //send along the current width, height, and url;
  windowWidth?: number
  windowHeight?: number
  url?: string
}
interface INavigationEventArgs {
  url: string
  pageID: number | null
  contentID: number | null
}
interface IEditComponentEventArgs {
  contentID: number | null
}
interface IEditFieldEventArgs {
  fieldName: string
  contentID: number | null
}
interface IScrollEventArgs {
  x: number
  y: number
  windowWidth: number
  windowHeight: number
}
interface IWindowResizeEventArgs {
  windowWidth: number
  windowHeight: number
}
interface IRefreshEventArgs {
  url: string
}
// union type of all possible event arguments
export type TFrameEventArgs =
  | IReadyEventArgs
  | INavigationEventArgs
  | IEditComponentEventArgs
  | IEditFieldEventArgs
  | IScrollEventArgs
  | IWindowResizeEventArgs
  | IRefreshEventArgs
  | null

export const dispatchReadyEvent = ({
  windowWidth,
  windowHeight,
  url,
}: IReadyEventArgs) =>
  invokeFrameEvent("ready", { windowWidth, windowHeight, url })

export const dispatchNavigationEvent = ({
  url,
  pageID,
  contentID,
}: INavigationEventArgs) => {
  invokeFrameEvent("navigation", { url, pageID, contentID })
}

export const dispatchEditComponentEvent = ({
  contentID,
}: IEditComponentEventArgs) => {
  invokeFrameEvent("edit-component", { contentID })
}

export const dispatchEditFieldEvent = ({
  fieldName,
  contentID,
}: IEditFieldEventArgs) => {
  invokeFrameEvent("edit-field", { fieldName, contentID })
}

export const dispatchScrollEvent = ({
  x,
  y,
  windowWidth,
  windowHeight,
}: IScrollEventArgs) => {
  invokeFrameEvent("sdk-scroll", { x, y, windowWidth, windowHeight })
}

export const dispatchWindowResizeEvent = ({
  windowWidth,
  windowHeight,
}: IWindowResizeEventArgs) => {
  invokeFrameEvent("sdk-window-resize", { windowWidth, windowHeight })
}

export const dispatchRefreshEvent = ({ url }: IRefreshEventArgs) => {
  invokeFrameEvent("sdk-refresh", { url })
}
