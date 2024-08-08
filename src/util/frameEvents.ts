import { TFrameEvents, invokeFrameEvent } from "./invokeFrameEvent"
import { getGuid } from "./getGuid"

export interface IReadyEventArgs {
  //send along the current width, height, and url and status of decorators
  windowWidth?: number
  windowScrollableHeight?: number
  windowHeight?: number
  url?: string
  hasPageDecorators?: boolean
  hasComponentDecorators?: boolean
  hasFieldDecorators?: boolean
}
export interface INavigationEventArgs {
  url: string
  pageID: number | null
  contentID: number | null
  windowScrollableHeight?: number
  windowHeight?: number
}
export interface IEditComponentEventArgs {
  contentID: number | null
}
export interface IEditFieldEventArgs {
  fieldName: string
  contentID: number | null
}
export interface IScrollEventArgs {
  scrollX: number
  scrollY: number
  windowScrollableHeight: number
  windowWidth: number
  windowHeight: number
}
export interface IWindowResizeEventArgs {
  windowWidth: number
  windowHeight: number
}
export interface IRefreshEventArgs {
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
  windowScrollableHeight,
  hasComponentDecorators,
  hasFieldDecorators,
  hasPageDecorators,
}: IReadyEventArgs) =>
  invokeFrameEvent("ready", {
    windowWidth,
    windowHeight,
    url,
    windowScrollableHeight,
    hasComponentDecorators,
    hasFieldDecorators,
    hasPageDecorators,
  })

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
  scrollY,
  scrollX,
  windowWidth,
  windowHeight,
}: IScrollEventArgs) => {
  invokeFrameEvent("sdk-scroll", {
    scrollX,
    scrollY,
    windowWidth,
    windowHeight,
  })
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