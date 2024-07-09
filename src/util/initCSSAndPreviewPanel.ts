export const initCSSAndPreviewPanel = () => {
  //hide the preview bar UI if it's there
  const previewBar = document.body.querySelector<HTMLElement>(
    '[data-agility-previewbar="true"]'
  )
  if (previewBar) {
    previewBar.style.display = "none"
  }

  //add the `agility-live-preview` css class to the body
  if (!document.body.classList.contains("agility-live-preview")) {
    document.body.classList.add("agility-live-preview")
    const cssLink = document.createElement("link")
    //TODO: change this link to be from a CDN...
    cssLink.href = "./agility-live-preview.css"
    cssLink.rel = "stylesheet"
    cssLink.type = "text/css"
    document.head.appendChild(cssLink)
  }
}
