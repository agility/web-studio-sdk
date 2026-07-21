export type TDecoratorMap = Map<number, string[]>

export const generateDecoratorMap = () => {
  const fieldMap: TDecoratorMap = new Map()
  // find all the components on the page, plus nested list items - each keyed by its
  // own contentID (a nested list item's own id is `data-agility-nested-listitem`, not
  // `data-agility-component`, since it doesn't carry that attribute)
  const components = document.querySelectorAll(
    "[data-agility-component], [data-agility-nested-listitem]"
  )
  if (!components.length) {
    return
  }
  components.forEach((component) => {
    const contentID = parseInt(
      component.getAttribute("data-agility-component") ||
        component.getAttribute("data-agility-nested-listitem") ||
        ""
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
    fieldMap.set(contentID, fieldNames)
  })
  return fieldMap
}
