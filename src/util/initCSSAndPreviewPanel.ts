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
    // const isDEV = process.env.NODE_ENV === "development"
    // cssLink.href = isDEV
    //   ? process.env.DEV_CSS_URL || ""
    //   : process.env.PROD_CSS_URL || ""
    cssLink.href = "https://cdn.aglty.io/content-manager/css/web-studio.css"
    cssLink.rel = "stylesheet"
    cssLink.type = "text/css"
    document.head.appendChild(cssLink)
  }
}
