export type TDecoratorMap = Map<number, { [key: number]: string[] }>

export const generateDecoratorMap = () => {
  // get the pageID from the document
  const agilityPageIDElem = document.querySelector("[data-agility-page]")
  const pageID = parseInt(
    agilityPageIDElem?.getAttribute("data-agility-page") || ""
  )
  if (!pageID) {
    console.log("Web Studio SDK - no page ID found")
    return
  }
  const fieldMap: TDecoratorMap = new Map()
  // find all the components on the page
  const components = document.querySelectorAll("[data-agility-component]")
  if (!components.length) {
    return
  }
  components.forEach((component) => {
    const contentID = parseInt(
      component.getAttribute("data-agility-component") || ""
    )
    if (!contentID) {
      return
    }
    // find all the fields within this component...
    const fields = component.querySelectorAll("[data-agility-field]")
    if (!fields.length) {
      return
    }
    // parse the fields names and add them to the fieldMap
    let fieldNames: string[] = []
    fields.forEach((field) => {
      const fieldName = field.getAttribute("data-agility-field") || ""
      if (!fieldName) {
        return
      }
      fieldNames.push(fieldName)
    })
    fieldMap.set(pageID, { [contentID]: fieldNames })
  })
  return fieldMap
}
