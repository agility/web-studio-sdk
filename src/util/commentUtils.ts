export function getDeepestElementAtCoordinates(element: Element, x: number, y: number) : Element | null {
  // Helper function to recursively check for the deepest child element
  function findDeepestElement(element: Element, x: number, y: number) : Element | null {
    // Get the bounding rectangle of the current element
    const rect = element.getBoundingClientRect();

    // Get the computed style to obtain margin values
    const style = window.getComputedStyle(element);
    const marginTop = parseFloat(style.marginTop);
    const marginRight = parseFloat(style.marginRight);
    const marginBottom = parseFloat(style.marginBottom);
    const marginLeft = parseFloat(style.marginLeft);

    // Adjust the rectangle to include margins
    const adjustedRect = {
      left: rect.left - marginLeft,
      right: rect.right + marginRight,
      top: rect.top - marginTop,
      bottom: rect.bottom + marginBottom,
    };

    // Check if the coordinates are inside the adjusted bounding box
    const isInside =
      x >= adjustedRect.left &&
      x <= adjustedRect.right &&
      y >= adjustedRect.top &&
      y <= adjustedRect.bottom;

    // If the coordinates are not inside the element, return null
    if (!isInside) return null;

    // Recursively check child elements to find the deepest one that contains the coordinates
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      const deepestChild = findDeepestElement(child, x, y);

      // If a deeper child element is found, return it
      if (deepestChild) {
        return deepestChild;
      }
    }

    // If no deeper child is found, return the current element
    return element;
  }

  // Start the recursive search with the provided element
  return findDeepestElement(element, x, y);
}

export function getUniqueSelector(element: Element) {
  let path = [];
  while (element.parentElement) {
    let selector = element.tagName.toLowerCase();
    if (element.id) {
      selector += `#${element.id}`;
    } else if (element.className) {
      selector += `.${element.className.split(' ').join('.')}`;
    }
    path.unshift(selector);
    element = element.parentElement;
  }
  return path.join(' > ');
}
