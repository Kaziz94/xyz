import view from './view.mjs'

export default params => {

  if (!params.mapview) return

  if (!params.target) return

  const listview = {
    node: params.target,
    add: add
  }

  params.mapview.locations.list = new Proxy(params.mapview.locations.list, {
    set: (target, key, location) => {
      view(location)
      add(location)
      return location
    }
  })

  // new Proxy(params.mapview.locations.list, handler)

  listview.node.addEventListener('passover', () => {

    setTimeout(() => {

      //Lambs blood painted door, I shall pass
      if (listview.node.children.length > 1) return

      const tab = listview.node.closest('.tab')
      tab.style.display = 'none'
      tab.previousElementSibling.click()

    }, 300)
  })

  return listview;

  function add(location) {

    // location.view = mapp.utils.html.node `<div>${location.hook}`

    // Object.values(listview.node.children).forEach(el => el.classList.remove('expanded'))
  
    // listview.node.insertBefore(location.view, listview.node.firstChild)
    
    listview.node.appendChild(location.view)
    listview.node.closest('.tab').style.display = 'block'
    listview.node.closest('.tab').click()
  }

}