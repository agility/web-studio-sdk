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
  pageID: number | null
}
export interface IEditFieldEventArgs {
  fieldName: string
  contentID: number | null
  pageID: number | null
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

export interface IAddCommentLocationEventArgs {
  fullCommentMetadata: any
  threadID: string
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
  | IAddCommentLocationEventArgs
  | null

export const dispatchReadyEvent = ({
  windowWidth,
  windowHeight,
  url,
  windowScrollableHeight,
  hasComponentDecorators,
  hasFieldDecorators,
  hasPageDecorators,
}: IReadyEventArgs) => {
  invokeFrameEvent("ready", {
    windowWidth,
    windowHeight,
    url,
    windowScrollableHeight,
    hasComponentDecorators,
    hasFieldDecorators,
    hasPageDecorators,
  })
}

export const dispatchNavigationEvent = (args: INavigationEventArgs) => {
  invokeFrameEvent("navigation", args)
}

export const dispatchEditComponentEvent = ({
  contentID,
  pageID,
}: IEditComponentEventArgs) => {
  invokeFrameEvent("edit-component", { contentID, pageID })
}

export const dispatchEditFieldEvent = ({
  fieldName,
  contentID,
  pageID,
}: IEditFieldEventArgs) => {
  invokeFrameEvent("edit-field", { fieldName, contentID, pageID })
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

export const dispatchAddCommentLocationEvent = ({
  fullCommentMetadata,
  threadID,
}: IAddCommentLocationEventArgs) => {
  console.info("dispatchAddCommentLocationEvent", fullCommentMetadata)
  invokeFrameEvent("comment-relocate", { threadID, fullCommentMetadata })
}

export const dispatchRefreshEvent = ({ url }: IRefreshEventArgs) => {
  invokeFrameEvent("sdk-refresh", { url })
}
