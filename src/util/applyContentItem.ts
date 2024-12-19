/**
 * Apply a content item to a component
 */
export const applyContentItem = (contentItem: any) => {
  const components = document.querySelectorAll("[data-agility-component]")
  components.forEach((component) => {
    const contentID = parseInt(
      component.getAttribute("data-agility-component") || ""
    )
    if (contentID !== contentItem.contentID) return

    //now find all the fields within this component...
    component.querySelectorAll("[data-agility-field]").forEach((field) => {
      const fieldName = field.getAttribute("data-agility-field") || ""

      //find the field in the content item...
      const fieldNameInContentItem = Object.keys(contentItem.values).find(
        (key) => key.toLowerCase() === fieldName.toLowerCase()
      )
      const fieldValue = contentItem.values[fieldNameInContentItem || ""]

      // get the agility field button
      const fieldEditButton = field.querySelector(".agility-field-edit")

      //apply the field value to the field...
      if (typeof fieldValue === "string") {
        if (
          fieldValue &&
          fieldValue.startsWith("<a ") &&
          fieldValue.endsWith("</a>")
        ) {
          //*** link field
          field.innerHTML = fieldValue
        } else {
          if (field.hasAttribute("data-agility-html")) {
            //*** html field
            field.innerHTML = fieldValue
          } else {
            //*** regular field...
            field.textContent = fieldValue
          }
        }

        if (!fieldEditButton) {
          console.warn("No edit button found for field", fieldName)
          return
        }

        // make sure to add the edit button back
        field.appendChild(fieldEditButton)
      } else if (fieldValue.url) {
        //***  image field
        const img = field.querySelector(
          "img:not(.agility-field-edit img)"
        ) as HTMLImageElement

        if (img && img.src) {
          // update the srcset for the picture source elements
          field.querySelectorAll("source").forEach((source) => {
            const oldSrc = source.srcset
            const oldSrcParts = oldSrc.split("?")
            const newSrc = fieldValue.url + "?" + oldSrcParts[1]
            source.srcset = newSrc
          })

          //try to match the current image src to the new one...
          const currentSrc = img.src
          const currentSrcParts = currentSrc.split("?")
          const newSrc = fieldValue.url + "?" + currentSrcParts[1]

          img.loading = "eager"
          img.alt = fieldValue.label
          img.src = newSrc
        }
      } else {
        console.log(
          "%cWeb Studio SDK\n Cannot apply field value of field",
          "font-weight: bold",
          fieldName,
          "value: ",
          fieldValue
        )
      }
    })
  })
}
