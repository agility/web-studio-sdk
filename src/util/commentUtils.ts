export function getDeepestElementAtCoordinates(
  element: Element,
  x: number,
  y: number
): Element | null {
  // Helper function to recursively check for the deepest child element
  function findDeepestElement(
    element: Element,
    x: number,
    y: number
  ): Element | null {
    // Get the bounding rectangle of the current element
    const rect = element.getBoundingClientRect()

    // Get the computed style to obtain margin values
    const style = window.getComputedStyle(element)
    const marginTop = parseFloat(style.marginTop)
    const marginRight = parseFloat(style.marginRight)
    const marginBottom = parseFloat(style.marginBottom)
    const marginLeft = parseFloat(style.marginLeft)

    // Adjust the rectangle to include margins
    const adjustedRect = {
      left: rect.left - marginLeft,
      right: rect.right + marginRight,
      top: rect.top - marginTop,
      bottom: rect.bottom + marginBottom,
    }

    // Check if the coordinates are inside the adjusted bounding box
    const isInside =
      x >= adjustedRect.left &&
      x <= adjustedRect.right &&
      y >= adjustedRect.top &&
      y <= adjustedRect.bottom

    // If the coordinates are not inside the element, return null
    if (!isInside) return null

    // Recursively check child elements to find the deepest one that contains the coordinates
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i]
      const deepestChild = findDeepestElement(child, x, y)

      // If a deeper child element is found, return it
      if (deepestChild) {
        return deepestChild
      }
    }

    // If no deeper child is found, return the current element
    return element
  }

  // Start the recursive search with the provided element
  return findDeepestElement(element, x, y)
}

/**
 * Generates a unique CSS selector for a given DOM element.
 *
 * @param {Element} element - The DOM element for which to generate the selector.
 * @returns {string} - A unique CSS selector that can be used to select the element.
 *
 */
export function getUniqueSelector(element: Element) {
  /**
   * Escapes special characters in CSS identifiers (IDs and class names).
   *
   * @param {string} ident - The identifier to escape.
   * @returns {string} - The escaped identifier.
   */
  function escapeCSSIdentifier(ident: string) {
    // Replace any special characters with their escaped versions
    return ident.replace(
      /([^\x00-\x7F]|[!"#$%&'()*+,.\/:;<=>?@[\]^`{|}~])/g,
      "\\$&"
    )
  }

  // Initialize an array to hold parts of the selector path
  let path = []

  // Traverse up the DOM tree to build the selector path
  while (element.parentElement) {
    // Start with the element's tag name in lowercase
    let selector = element.tagName.toLowerCase()

    if (element.id) {
      // If the element has an ID, append it with a '#' and escape special characters
      selector += `#${escapeCSSIdentifier(element.id)}`
    } else if (element.className) {
      // If the element has class names
      let classNames = element.className
        .toString() // Convert className to a string (handles SVG elements)
        .split(" ") // Split into individual class names
        .filter(Boolean) // Remove any empty strings
        .map((cls) => escapeCSSIdentifier(cls)) // Escape special characters in class names
        .join(".") // Join class names with '.'

      if (classNames) {
        // If there are any class names, append them with a '.' prefix
        selector += `.${classNames}`
      }
    }

    // Add the selector part to the beginning of the path array
    path.unshift(selector)

    // Move up to the parent element
    element = element.parentElement
  }

  // Join all parts with ' > ' to form the full selector path
  return path.join(" > ")
}
