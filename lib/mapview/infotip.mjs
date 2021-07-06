export default mapview => {

  const popup = {
    set: set,
    remove: remove,
    position: position,
  }

  mapview.infotip = popup

  function set(info){

    remove()

    popup.node = mapp.utils.html.node`<div class="infotip">`

    popup.node.innerHTML = info
  
    mapview.node.appendChild(popup.node)

    mapview.Map.on('pointermove', position)

    position()
  }

  function remove() {
    popup.node && popup.node.remove() && mapview.Map.un('pointermove', position)
  }
  
  function position() {
    popup.node.style.opacity = 1;

    popup.node.style.left = mapview.pointerLocation.x - popup.node.offsetWidth / 2 + 'px'
    
    popup.node.style.top = mapview.pointerLocation.y - popup.node.offsetHeight - 15 + 'px'
  }

}