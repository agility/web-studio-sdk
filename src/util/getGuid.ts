export const getGuid = (file: string): string | null => {
  const guid = document.body.getAttribute("data-agility-guid")

  if (!guid) {
    console.error(
      `%cWeb Studio SDK\n - Error In:${file}  no guid found on body element. \nMake sure your body element is set up like this: <body data-agility-guid='{{agilityguid}}'>`
    )
    return null
  }
  console.log(
    "%cWeb Studio SDK\n Initializing for instance guid:",
    "font-weight:bold",
    guid
  )
  return guid
}
