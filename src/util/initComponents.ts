import {
  dispatchEditComponentEvent,
  dispatchEditFieldEvent,
} from "./frameEvents"

const PENCIL_ICON_HTML =
  '<img src="https://cdn.aglty.io/content-manager/images/studio-edit.svg" alt="Edit" />'

// Used for the edit button on a genuine `[data-agility-component]` root (not a nested
// list item, not a field) - a distinct icon from the default pencil.
const COMPONENT_EDIT_ICON_HTML =
  '<i><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 stroke-[1px] transition-all text-white group-hover:text-white"><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"></path><path d="M12 12l8 -4.5"></path><path d="M12 12l0 9"></path><path d="M12 12l-8 -4.5"></path></svg></i>'

const addEditButton = (
  el: Element,
  buttonClass: string,
  iconHtml: string,
  onClick: (e: MouseEvent) => void
) => {
  const button = document.createElement("button")
  button.classList.add(buttonClass)
  button.setAttribute("type", "button")
  button.setAttribute("title", "Edit")
  button.innerHTML = iconHtml
  button.addEventListener("click", onClick as EventListener)
  el.appendChild(button)
}

/**
 * Wires up a single editable component root - a normal `[data-agility-component]` or a
 * nested list item (`[data-agility-nested-listitem]`, a list item with no per-instance
 * container of its own) - adding its own edit button, and one for every field nested
 * inside it. `isNestedListItem` tells Content Manager to route to it with an extra
 * `listitem-` segment instead of treating `contentID` as a standalone item.
 */
const decorateComponent = (
  component: Element,
  pageID: string | null,
  contentID: string | null,
  isNestedListItem: boolean
) => {
  if (component.classList.contains("agility-component")) return
  component.classList.add("agility-component")

  // a genuine data-agility-component root (not a nested list item) gets the distinct
  // component-edit icon; nested list items and fields keep the default pencil.
  const componentIconHtml = isNestedListItem ? PENCIL_ICON_HTML : COMPONENT_EDIT_ICON_HTML
  addEditButton(component, "agility-component-edit", componentIconHtml, (e) => {
    if (!contentID) return
    // prevent the click from bubbling up to the component itself - important for when the component is a link or button.
    e.preventDefault()
    e.stopPropagation()
    dispatchEditComponentEvent({
      contentID: parseInt(contentID),
      pageID: pageID ? parseInt(pageID) : -1,
      isNestedListItem,
    })
  })

  //now find all the fields within this component...
  component.querySelectorAll("[data-agility-field]").forEach((field) => {
    field.classList.add("agility-field")
    const fieldName = field.getAttribute("data-agility-field")

    addEditButton(field, "agility-field-edit", PENCIL_ICON_HTML, (e) => {
      if (!contentID || !fieldName) return
      e.preventDefault()
      e.stopPropagation()
      dispatchEditFieldEvent({
        contentID: parseInt(contentID),
        fieldName,
        pageID: pageID ? parseInt(pageID) : -1,
        isNestedListItem,
      })
    })
  })
}

/**
 * Initialize the components on the site
 */

export const initComponents = () => {
  //find all the pages
  const pages = document.querySelectorAll("[data-agility-page]")

  pages.forEach((page) => {
    const pageID = page.getAttribute("data-agility-page")

    // normal page-level components
    page.querySelectorAll("[data-agility-component]").forEach((component) => {
      const contentID = component.getAttribute("data-agility-component")
      decorateComponent(component, pageID, contentID, false)
    })

    // list items nested inside a component's linked-content-list field - these have no
    // per-instance container of their own, so they're tagged with
    // data-agility-nested-listitem (the item's own contentID) instead of
    // data-agility-component.
    page.querySelectorAll("[data-agility-nested-listitem]").forEach((component) => {
      const contentID = component.getAttribute("data-agility-nested-listitem")
      decorateComponent(component, pageID, contentID, true)
    })
  })
}
