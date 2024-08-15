export const handleCollaborationToggle = (isCollaborating: boolean) => {
  // if we've recieved a message from the parent window that collaboration mode is active we need to apply the agility-field-hidden class to any element's that have the agility-field class

  const fields = document.querySelectorAll("[data-agility-field]")
  const components = document.querySelectorAll("[data-agility-component]")

  if (isCollaborating) {
    fields.forEach((field) => {
      field.classList.add("agility-field-commenting")
    })
    components.forEach((component) => {
      component.classList.add("agility-component-commenting")
    })
    // we should also disable the buttons that have the classlist agility-field-edit or agility-component-edit
    const editButtons = document.querySelectorAll(
      ".agility-field-edit, .agility-component-edit"
    )
    editButtons.forEach((button) => {
      button.setAttribute("disabled", "disabled")
    })
  } else {
    fields.forEach((field) => {
      field.classList.remove("agility-field-commenting")
    })
    components.forEach((component) => {
      component.classList.remove("agility-component-commenting")
    })
  }
}
