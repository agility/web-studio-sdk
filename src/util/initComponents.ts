import {
  dispatchEditComponentEvent,
  dispatchEditFieldEvent,
} from "./frameEvents"

/**
 * Initialize the components on the page
 */

export const initComponents = () => {
  //find all the components on the page...
  const components = document.querySelectorAll("[data-agility-component]")
  components.forEach((component) => {
    const contentID = component.getAttribute("data-agility-component")
    const pageID = component.getAttribute("data-agility-page")
    if (!component.classList.contains("agility-component")) {
      component.classList.add("agility-component")

      //edit button
      const divCompEdit = document.createElement("button")
      divCompEdit.classList.add("agility-component-edit")
      divCompEdit.setAttribute("type", "button")
      divCompEdit.setAttribute("title", "Edit")
      divCompEdit.addEventListener("click", () => {
        if (!contentID) return
        dispatchEditComponentEvent({
          contentID: parseInt(contentID),
          pageID: pageID ? parseInt(pageID) : -1,
        })
      })
      component.appendChild(divCompEdit)

      //edit svg
      const imgEdit = document.createElement("img")
      imgEdit.src =
        "https://cdn.aglty.io/content-manager/images/studio-edit.svg"
      imgEdit.alt = "Edit"
      divCompEdit.appendChild(imgEdit)

      //now find all the fields within this component...
      component.querySelectorAll("[data-agility-field]").forEach((field) => {
        field.classList.add("agility-field")
        const fieldName = field.getAttribute("data-agility-field")

        //edit button
        const divFieldEdit = document.createElement("button")
        divFieldEdit.classList.add("agility-field-edit")
        divFieldEdit.setAttribute("type", "button")
        divFieldEdit.setAttribute("title", "Edit")
        divFieldEdit.addEventListener("click", () => {
          if (!contentID || !fieldName) return
          dispatchEditFieldEvent({
            contentID: parseInt(contentID),
            fieldName,
            pageID: pageID ? parseInt(pageID) : -1,
          })
        })
        field.appendChild(divFieldEdit)

        //edit svg
        const imgEditField = document.createElement("img")
        imgEditField.src =
          "https://cdn.aglty.io/content-manager/images/studio-edit.svg"
        imgEditField.alt = "Edit"
        divFieldEdit.appendChild(imgEditField)
      })
    }
  })
}
