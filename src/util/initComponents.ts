import {
  dispatchEditComponentEvent,
  dispatchEditFieldEvent,
} from "./frameEvents"

interface ComponentIds {
  /** A normal component's own contentID. Null for a nested list item - it has no
   * per-instance container of its own, so `referenceName` identifies the list instead. */
  contentID: number | null
  /** The list item's own contentID, set only for a nested list item. */
  listItemID?: number | null
  /** The reference name of the linked-content-list field a nested list item belongs
   * to, set only for a nested list item. */
  referenceName?: string | null
}

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
 * Wires up a single editable component root (either a normal `[data-agility-component]`
 * or a nested list item) - adds its own edit button, and one for every field nested
 * inside it.
 */
const decorateComponent = (
  component: Element,
  pageID: string | null,
  { contentID, listItemID, referenceName }: ComponentIds
) => {
  if (component.classList.contains("agility-component")) return
  component.classList.add("agility-component")

  addEditButton(component, "agility-component-edit", (e) => {
    if (!contentID && !referenceName) return
    // prevent the click from bubbling up to the component itself - important for when the component is a link or button.
    e.preventDefault()
    e.stopPropagation()
    dispatchEditComponentEvent({
      contentID: contentID ? parseInt(String(contentID)) : null,
      pageID: pageID ? parseInt(pageID) : -1,
      listItemID: listItemID != null ? parseInt(String(listItemID)) : undefined,
      referenceName: referenceName ?? undefined,
    })
  })

  //now find all the fields within this component...
  component.querySelectorAll("[data-agility-field]").forEach((field) => {
    field.classList.add("agility-field")
    const fieldName = field.getAttribute("data-agility-field")

    addEditButton(field, "agility-field-edit", (e) => {
      if ((!contentID && !referenceName) || !fieldName) return
      e.preventDefault()
      e.stopPropagation()
      dispatchEditFieldEvent({
        contentID: contentID ? parseInt(String(contentID)) : null,
        fieldName,
        pageID: pageID ? parseInt(pageID) : -1,
        listItemID: listItemID != null ? parseInt(String(listItemID)) : undefined,
        referenceName: referenceName ?? undefined,
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
      decorateComponent(component, pageID, { contentID: contentID ? parseInt(contentID) : null })
    })

    // list items nested inside a component's linked-content-list field - these have no
    // per-instance container of their own, so instead of a contentID they carry the
    // field's reference name (`data-agility-nested-item`) alongside their own contentID
    // (`data-agility-nested-listitem`), since Content Manager resolves the list's
    // ContentView from the reference name directly.
    page.querySelectorAll("[data-agility-nested-listitem]").forEach((component) => {
      const referenceName = component.getAttribute("data-agility-nested-item")
      const nestedListItemID = component.getAttribute("data-agility-nested-listitem")
      decorateComponent(component, pageID, {
        contentID: null,
        referenceName,
        listItemID: nestedListItemID ? parseInt(nestedListItemID) : null,
      })
    })
  })
}
