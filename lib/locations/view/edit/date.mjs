export default _xyz => entry => {

  const _input = mapp.utils.html.node`<input type="text" placeholder=${_xyz.language.layer_filter_pick} style="text-align: end;">${entry.type === 'datetime' && mapp.ui.formatDateTime(entry.value) || mapp.ui.formatDate(entry.value) || ''}`;

  const input = _input.childNodes[0];

  input.value = entry.type === 'datetime' && mapp.ui.formatDateTime(entry.value) || mapp.ui.formatDate(entry.value) || '';

  entry.val.appendChild(input);

  mapp.ui.flatpickr({
    value: entry.value ? new Date(entry.value*1000).toISOString() : '',
    element: input,
    enableTime: entry.type === 'datetime' ? true : false,
    callback: dateStr => {

      input.value = dateStr;
      
      const date_unix = _xyz.utils.meltDateStr(dateStr);

      entry.location.view.dispatchEvent(
        new CustomEvent('valChange', {detail:{
          input: input,
          entry: entry,
          newValue: date_unix
        }}));
    }
  });

};