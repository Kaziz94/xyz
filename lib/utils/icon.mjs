const memoizedIcons = new Map()

import svg_symbols from './svg_symbols.mjs'

export default icon => {

  const scale = icon.scale || 1

  delete icon.scale

  const iconStr = JSON.stringify(icon)

  if (memoizedIcons.has(iconStr)) {
    
    icon.url = memoizedIcons.get(iconStr)

  } else {

    icon.url = svg_symbols(icon)

    memoizedIcons.set(iconStr, icon.url)
  }

  return new ol.style.Icon({
    src: icon.url,
    scale: scale,
    anchor: icon.anchor || [0.5, 0.5],
  })

}