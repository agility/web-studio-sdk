export type TDecoratorMap = Map<number, string[]>

export const generateDecoratorMap = () => {
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
    fieldMap.set(contentID, fieldNames)
  })
  return fieldMap
}
