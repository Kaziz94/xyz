document.dispatchEvent(new CustomEvent('compare_location', {
  detail: _xyz => {

    _xyz.locations.plugins.compare_location = entry => {

      _xyz.query(entry).then(response => {

        entry.location.layer.comparison_tab.columns++

        const valArray = Object.values(response)

        valArray.unshift(entry.location.id, entry.location.infoj[3].value)

        const col = mapp.utils.html.node`
          <div style="display: contents;">${valArray.map((val, i)=>mapp.utils.html`
            <div
              style="${`
                border-bottom: 1px solid #ddd;
                grid-column:${entry.location.layer.comparison_tab.columns};
                grid-row:${i+1}`}">${val}`)}`

        col.appendChild(mapp.utils.html.node`
          <div
            class="hover"
            style="${`
              grid-column:${entry.location.layer.comparison_tab.columns};
              grid-row:${valArray.length+1};
              font-weight: bold;
              color: red;`}"
              onclick=${e=>{
                col.remove()
                //col.innerHTML = ''
              }}>Remove`)

        entry.location.layer.comparison_tab.target
          .appendChild(col)
      })

    }

  }
}))