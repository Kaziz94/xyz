export default params => {

  if (!params.target) return;

  const tabview = {

    node: params.target,

    tabs: params.target.appendChild(mapp.utils.html.node`<div class="tabs">`),

    tab: tab,

  }

  return tabview

  function tab(tab = {}) {

    tab.node = mapp.utils.html.node`<div class="tab">`

    // The tab header will always be shown in the tabs bar.
    // Clicking the tab header will show a tab.
    tab.header = tab.node.appendChild(mapp.utils.html.node`
      <div
        style="${tab.tab_style || ''}"
        class="header"
        onclick=${showTab}>
        ${tab.title || tab.key || 'Tab'}`)

    // The tab panel holds the tab content.
    // The tab panel will only be shown for an active tab.
    tab.panel = tab.node.appendChild(mapp.utils.html.node`
      <div
        class="${`panel ${tab.class || ''}`}"
        style="${tab.style || ''}">`)

    // Assign target element as content to the tab panel.
    tab.target && tab.target instanceof HTMLElement && tab.panel.appendChild(tab.target)

    tab.show = showTab

    tab.remove = removeTab

    return tab

    function showTab (){
 
      // Remove the active class from all tabs.
      tabview.tabs.childNodes.forEach(tab => tab.classList.remove('active'))
  
      // Add the tab element to tabs container if the tab element has no parent yet.
      !tab.node.parentElement && tabview.tabs.appendChild(tab.node)
  
      // Make the tab active by assigning class.
      tab.node.classList.add('active')
  
      // The activate event should be delayed with a timeout.
      // This prevents each tab to activate when multiple tabs are added in quick succession.
      tabview.timer && window.clearTimeout(tabview.timer)
      tabview.timer = window.setTimeout(()=>tab.node.dispatchEvent(new CustomEvent('activate')), 500)
      
      // Hide the tabview when empty.
      if (tabview.node.classList.contains('desktop-display-none')) {
        tabview.node.classList.remove('desktop-display-none')
        document.body.style.gridTemplateRows = 'auto 10px 50px'
      }
    }

    function removeTab () {

      // A tab without parent element cannot be in the tab bar.
      if (!tab.node.parentElement) return

      // Find a sibling of the tab.
      const sibling = tab.node.nextElementSibling || tab.node.previousElementSibling

      // Remove the tab element from tab bar.
      tab.node.remove()

      // Remove tab from layer set.
      //tab.layer && tab.layer.tabs.delete(tab)

      // Activate the sibling.
      if (sibling) return sibling.querySelector('.header').click()

      // Hide tabview if tab had no siblings.
      tabview.node.classList.add('desktop-display-none')
      document.body.style.gridTemplateRows = 'auto 0 0'
      // mapview.node.style.marginTop = 0
    }

  }

}