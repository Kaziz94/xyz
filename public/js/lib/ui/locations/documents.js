export default (_xyz) => (entry) => {
  entry.documents = mapp.utils.html.node`<div style="grid-column: 1 / 3;"">`;
  entry.listview.appendChild(entry.documents);
  for (let doc of entry.value) {
    entry.documents.appendChild(mapp.utils.html.node`
		<div class="item">
		${entry.edit && mapp.utils.html.node`
		<button
			class="xyz-icon icon-trash link-remove"
			data-name=${doc.replace(/.*\//, "").replace(/\.([\w-]{3})/, "")}
			data-href=${doc}
			onclick=${(e) => removeDocument(e)}>
		</button>`}		
		<a href=${doc}>${doc.replace(/.*\//, "").replace(/\.([\w-]{3})/, "")}`);
  }
  if (!entry.edit)
    return;
  entry.listview.appendChild(mapp.utils.html.node`
    <div class="list" style="grid-column: 1 / 3;">
      <div class="add xyz-icon icon-cloud-upload off-black-filter">
      <input
      type="file"
      accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document;"
      onchange=${(e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file)
      return;
    const placeholder = mapp.utils.html.node`<div class="item"><div class="xyz-icon loader">`;
    entry.documents.appendChild(placeholder);
    reader.onload = (readerOnload) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", _xyz.host + "/api/provider/cloudinary?" + mapp.utils.paramString({
        resource_type: "raw",
        public_id: file.name
      }));
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.responseType = "json";
      xhr.onload = (e2) => {
        if (e2.target.status > 202)
          return console.log("document_upload failed");
        const secure_url = e2.target.response.secure_url;
        const public_id = e2.target.response.public_id.replace(/.*\//, "").replace(/\.([\w-]{3})/, "");
        const _xhr = new XMLHttpRequest();
        _xhr.open("GET", _xyz.host + "/api/query?" + mapp.utils.paramString({
          template: "set_field_array",
          locale: _xyz.locale.key,
          layer: entry.location.layer.key,
          table: entry.location.table,
          action: "append",
          field: entry.field,
          secure_url,
          id: entry.location.id
        }));
        _xhr.setRequestHeader("Content-Type", "application/json");
        _xhr.responseType = "json";
        _xhr.onload = (_e) => {
          if (_e.target.status > 202)
            return;
          mapp.utils.render(placeholder, mapp.utils.html`
              <div class="item">
              ${entry.edit && mapp.utils.html.node`
              <button
                class="xyz-icon icon-trash link-remove"
                data-name=${public_id}
                data-href=${secure_url}
                onclick=${(e3) => removeDocument(e3)}>
              </button>`}
              <a href=${secure_url} target="_blank">${public_id}`);
        };
        _xhr.send();
      };
      xhr.send(readerOnload.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }}>`);
  function removeDocument(e) {
    if (!confirm("Remove document link?"))
      return;
    const doc = e.target;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", _xyz.host + "/api/provider/cloudinary?" + mapp.utils.paramString({
      destroy: true,
      public_id: doc.dataset.name
    }));
    xhr.onload = (e2) => {
      if (e2.target.status > 202)
        return;
      const _xhr = new XMLHttpRequest();
      _xhr.open("GET", _xyz.host + "/api/query?" + mapp.utils.paramString({
        template: "set_field_array",
        locale: _xyz.locale.key,
        layer: entry.location.layer.key,
        table: entry.location.table,
        action: "remove",
        field: entry.field,
        secure_url: doc.dataset.href,
        id: entry.location.id
      }));
      _xhr.setRequestHeader("Content-Type", "application/json");
      _xhr.responseType = "json";
      _xhr.onload = (_e) => {
        if (_e.target.status > 202)
          return;
        doc.parentNode.remove();
      };
      _xhr.send();
    };
    xhr.send();
  }
};
