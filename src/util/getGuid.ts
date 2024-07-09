export const getGuid = (file: string): string | null => {
  const guid = document.body.getAttribute("data-agility-guid")

  if (!guid) {
    console.error(
      `*** Agility Preview Center *** - Error In:${file}  no guid found on body element. \nMake sure your body element is set up like this: <body data-agility-guid='{{agilityguid}}'>`
    )
    return null
  }
  console.log(
    "*** Agility Preview Center *** Initializing for instance guid:",
    guid
  )
  return guid
}
