export default _xyz => (entry, img, dataURL) => {

  const blob = dataURLToBlob(dataURL);

  const xhr = new XMLHttpRequest();

  xhr.open('POST', _xyz.host + '/api/location/edit/images/upload?' + _xyz.utils.paramString({
    dbs: _xyz.layers.list[entry.location.layer].dbs,
    table: entry.location.table,
    field: entry.field,
    qID: entry.location.qID,
    id: entry.location.id,
    token: _xyz.token
  }));

  xhr.setRequestHeader('Content-Type', 'application/octet-stream');

  xhr.onload = e => {

    if (e.target.status !== 200) return console.log('image_upload failed');

    const json = JSON.parse(e.target.responseText);

    img.style.opacity = 1;
    img.style.border = '3px solid #eee';
    img.id = json.image_id;
    img.src = json.image_url;

    // add delete button / control
    _xyz.utils.createElement({
      tag: 'button',
      options: {
        title: 'Delete image',
        className: 'btn_del',
        innerHTML: '<i class="material-icons">delete_forever</i>'
      },
      appendTo: img.parentElement,
      eventListener: {
        event: 'click',
        funct: e => {
          e.target.remove();
          entry.ctrl.delete_image(entry, img);
        }
      }
    });

  };

  img.style.opacity = '0';

  xhr.onprogress = e => {
    if (e.lengthComputable) {
      img.style.opacity = e.loaded / e.total;
    }
  };

  xhr.send(blob);
};

function dataURLToBlob(dataURL) {

  if (dataURL.indexOf(';base64,') == -1) {
    let
      parts = dataURL.split(','),
      contentType = parts[0].split(':')[1],
      raw = parts[1];

    return new Blob([raw], { type: contentType });
  }

  let
    parts = dataURL.split(';base64,'),
    contentType = parts[0].split(':')[1],
    raw = window.atob(parts[1]),
    uInt8Array = new Uint8Array(raw.length);

  for (let i = 0; i < raw.length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}