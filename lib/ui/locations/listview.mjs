const list = [
  {
    symbol: 'A',
    colour: '#4227b0',
    filter: 'invert(19%) sepia(57%) saturate(4245%) hue-rotate(247deg) brightness(76%) contrast(101%)',
  },
  {
    symbol: 'B',
    colour: '#2196f3',
    filter: 'invert(60%) sepia(94%) saturate(3876%) hue-rotate(184deg) brightness(98%) contrast(94%)'
  },
  {
    symbol: 'C',
    colour: '#009688',
    filter: 'invert(37%) sepia(46%) saturate(1993%) hue-rotate(144deg) brightness(96%) contrast(101%)'
  },
  {
    symbol: 'D',
    colour: '#cddc39',
    filter: 'invert(84%) sepia(82%) saturate(420%) hue-rotate(6deg) brightness(88%) contrast(94%)'
  },
  {
    symbol: 'E',
    colour: '#ff9800',
    filter: 'invert(59%) sepia(90%) saturate(1526%) hue-rotate(358deg) brightness(99%) contrast(106%)'
  },
  {
    symbol: 'F',
    colour: '#673ab7',
    filter: 'invert(23%) sepia(26%) saturate(6371%) hue-rotate(251deg) brightness(87%) contrast(87%)'
  },
  {
    symbol: 'G',
    colour: '#03a9f4',
    filter: 'invert(65%) sepia(61%) saturate(5963%) hue-rotate(168deg) brightness(101%) contrast(103%)'
  },
  {
    symbol: 'H',
    colour: '#4caf50',
    filter: 'invert(65%) sepia(8%) saturate(3683%) hue-rotate(73deg) brightness(92%) contrast(69%)'
  },
  {
    symbol: 'I',
    colour: '#ffeb3b',
    filter: 'invert(75%) sepia(76%) saturate(391%) hue-rotate(2deg) brightness(104%) contrast(109%)'
  },
  {
    symbol: 'J',
    colour: '#ff5722',
    filter: 'invert(47%) sepia(96%) saturate(3254%) hue-rotate(346deg) brightness(100%) contrast(102%)'
  },
  {
    symbol: 'K',
    colour: '#0d47a1',
    filter: 'invert(15%) sepia(99%) saturate(2827%) hue-rotate(213deg) brightness(87%) contrast(90%)'
  },
  {
    symbol: 'L',
    colour: '#00bcd4',
    filter: 'invert(60%) sepia(39%) saturate(2788%) hue-rotate(144deg) brightness(93%) contrast(102%)'
  },
  {
    symbol: 'M',
    colour: '#8bc34a',
    filter: 'invert(87%) sepia(8%) saturate(3064%) hue-rotate(35deg) brightness(85%) contrast(85%)'
  },
  {
    symbol: 'N',
    colour: '#ffc107',
    filter: 'invert(79%) sepia(86%) saturate(3969%) hue-rotate(346deg) brightness(98%) contrast(111%)'
  },
  {
    symbol: 'O',
    colour: '#d32f2f',
    filter: 'invert(28%) sepia(94%) saturate(3492%) hue-rotate(345deg) brightness(85%) contrast(92%)'
  }
]

import view from './view.mjs'

export default params => {

  if (!params.mapview) return

  if (!params.target) return

  const listview = {
    node: params.target,
    add: add
  }

  params.mapview.locations.list = new Proxy(params.mapview.locations.list, {
      set: function(target, key, location){

        const record = list.find(record => !record.hook)
        record.hook = location.hook
        location.record = record

        Reflect.set(...arguments)
        view(location)
        add(location)
        return true
      },
      deleteProperty: function (target, hook) {
        Reflect.deleteProperty(...arguments)

        const record = list.find(record => record.hook === hook)
        delete record.hook
        return true
      },
    })


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