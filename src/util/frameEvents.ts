import { TFrameEvents, invokeFrameEvent } from "./invokeFrameEvent"
import { getGuid } from "./getGuid"
import { off } from "process"
import { IUpdatedCommentDictionary } from "./initializePreview"
import { TDecoratorMap } from "./generateDecoratorMap"

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
export interface ICommentDictionaryUpdatedEventArgs {
  updatedCommentDictionary: IUpdatedCommentDictionary
}
export interface IWindowResizeEventArgs {
  windowWidth: number
  windowHeight: number
}
export interface IRefreshEventArgs {
  url: string
}

export interface ISetCommentCoordsEventArgs {
  percentageOffsetX?: number
  percentageOffsetY?: number
  uniqueSelector: string
  elementIndex: number
  isDragEndEvent?: boolean
  threadId?: string
  calcFallbackX?: number
  calcFallbackY?: number
  originX?: number
  originY?: number
}

export interface IDecoratorMapUpdatedEventArgs {
  decoratorMap: TDecoratorMap
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
  | ISetCommentCoordsEventArgs
  | ICommentDictionaryUpdatedEventArgs
  | IDecoratorMapUpdatedEventArgs
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

export const dispatchSetCommentCoordsEvent = ({
  percentageOffsetX,
  percentageOffsetY,
  uniqueSelector,
  elementIndex,
  isDragEndEvent,
  threadId,
  calcFallbackX,
  calcFallbackY,
  originX,
  originY
}: ISetCommentCoordsEventArgs) => {
  invokeFrameEvent(isDragEndEvent? "set-comment-coords-on-drag-end": "set-comment-coords", {
    percentageOffsetX,
    percentageOffsetY,
    uniqueSelector,
    elementIndex,
    isDragEndEvent,
    threadId,
    calcFallbackX,
    calcFallbackY,
    originX,
    originY
  })
}
export const dispatchCommentDictionaryUpdatedEvent = ({
  updatedCommentDictionary,
}: ICommentDictionaryUpdatedEventArgs) => {
  invokeFrameEvent("comment-dictionary-updated", { updatedCommentDictionary })
}
export const dispatchRefreshEvent = ({ url }: IRefreshEventArgs) => {
  invokeFrameEvent("sdk-refresh", { url })
}
export const dispatchDecoratorMapUpdatedEvent = ({
  decoratorMap,
}: IDecoratorMapUpdatedEventArgs) => {
  invokeFrameEvent("decorator-map-updated", { decoratorMap })
}
