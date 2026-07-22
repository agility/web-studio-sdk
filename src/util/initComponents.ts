import {
  dispatchEditComponentEvent,
  dispatchEditFieldEvent,
} from "./frameEvents"

const addEditButton = (
  el: Element,
  buttonClass: string,
  onClick: (e: MouseEvent) => void
) => {
  const button = document.createElement("button")
  button.classList.add(buttonClass)
  button.setAttribute("type", "button")
  button.setAttribute("title", "Edit")
  button.addEventListener("click", onClick as EventListener)
  el.appendChild(button)

  const img = document.createElement("img")
  img.src = "https://cdn.aglty.io/content-manager/images/studio-edit.svg"
  img.alt = "Edit"
  button.appendChild(img)
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

  addEditButton(component, "agility-component-edit", (e) => {
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

    addEditButton(field, "agility-field-edit", (e) => {
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
