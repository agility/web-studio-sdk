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
    cssLink.href =
      "https://unpkg.com/@agility/web-studio-sdk@latest/dist/web-studio.css"
    // Development Mode - CSS Link
    // cssLink.href = "http://127.0.0.1:8080/web-studio.css"
    cssLink.rel = "stylesheet"
    cssLink.type = "text/css"
    document.head.appendChild(cssLink)
  }
}
