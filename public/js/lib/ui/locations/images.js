export default (_xyz) => (entry) => {
  let images_grid = mapp.utils.html.node`<div class="images-grid">`;
  entry.listview.appendChild(images_grid);
  for (let image of entry.value) {
    images_grid.appendChild(mapp.utils.html.node`
      <div
        class="${entry.class || ""}"
        style="position: relative; width: 90px; height: 90px; flex-grow: 1;">
        <img src=${image}
          style="width: 100%; height: 100%; object-fit: cover; padding: 2px; border-radius: 2px;"
          onclick=${(e) => {
      if (!document.getElementById("modalOverlay"))
        return;
      document.getElementById("modalOverlay").style.display = "block";
      document.getElementById("modalOverlay").childNodes[entry.value.indexOf(e.target.src) + 1].scrollIntoView();
    }}>
          ${entry.edit && mapp.utils.html.node`
            <button
              class="xyz-icon icon-trash img-remove"
              data-name=${image.replace(/.*\//, "").replace(/\.([\w-]{3})/, "")}
              data-src=${image}
              onclick=${(e) => removeDocument(e)}>
            </button>`}`);
  }
  if (!entry.edit)
    return;
  if (document.getElementById("modalOverlay")) {
    document.getElementById("modalOverlay").appendChild(mapp.utils.html.node`
      <span onclick=${(e) => {
      document.getElementById("modalOverlay").style.display = "none";
    }}>&times;`);
    for (let img of entry.value) {
      document.getElementById("modalOverlay").appendChild(mapp.utils.html.node`<div><img style="padding-top: 40px;" src=${img}>`);
    }
  }
  entry.listview.appendChild(mapp.utils.html.node`
    <div class="list" style="grid-column: 1 / 3;">
    <div class="add xyz-icon icon-add-photo off-black-filter">
    <input
      type="file"
      accept="image/*;capture=camera"
      onchange=${(e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file)
      return;
    const placeholder = mapp.utils.html.node`
          <div
            class="${entry.class || ""}" 
            style="position: relative; width: 90px; height: 90px; flex-grow: 1;"
            onclick=${(e2) => {
      if (!document.getElementById("modalOverlay"))
        return;
      document.getElementById("modalOverlay").style.display = "block";
      Array.from(document.querySelectorAll("#modalOverlay img")).some((node) => {
        node.src === e2.target.src && node.scrollIntoView();
      });
    }}>`;
    images_grid.appendChild(placeholder);
    reader.onload = (readerOnload) => {
      const img = new Image();
      img.onload = async () => {
        let canvas = mapp.utils.html.node`<canvas>`, max_size = 1024, width = img.width, height = img.height;
        if (width > height && width > max_size) {
          height *= max_size / width;
          width = max_size;
        } else if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        const dataURL = canvas.toDataURL("image/jpeg", 0.5);
        const response = await _xyz.xhr({
          method: "POST",
          content_type: "application/octet-stream",
          url: `${_xyz.host}/api/provider/cloudinary?${mapp.utils.paramString({
            public_id: file.name.replace(/.*\//, "").replace(/\.([\w-]{3})/, ""),
            resource_type: "image"
          })}`,
          body: mapp.utils.dataURLtoBlob(dataURL)
        });
        await _xyz.xhr({
          url: `${_xyz.host}/api/query?${mapp.utils.paramString({
            template: "set_field_array",
            locale: _xyz.locale.key,
            layer: entry.location.layer.key,
            table: entry.location.table,
            action: "append",
            field: entry.field,
            secure_url: response.secure_url,
            id: entry.location.id
          })}`
        });
        mapp.utils.render(placeholder, mapp.utils.html`
              <img src=${response.secure_url}
                style="width: 100%; height: 100%; object-fit: cover; padding: 2px; border-radius: 2px;">
                ${entry.edit && mapp.utils.html.node`
                  <button
                    class="xyz-icon icon-trash img-remove"
                    data-name=${response.public_id}
                    data-src=${response.secure_url}
                    onclick=${(e2) => removeDocument(e2)}>
                  </button>`}`);
        if (document.getElementById("modalOverlay")) {
          document.getElementById("modalOverlay").appendChild(mapp.utils.html.node`
                <div><img style="padding-top: 40px;" src=${response.secure_url}>`);
        }
      };
      img.src = readerOnload.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }}>`);
  async function removeDocument(e) {
    if (!confirm("Remove image?"))
      return;
    const img = e.target;
    _xyz.xhr({
      url: `${_xyz.host}/api/provider/cloudinary?${mapp.utils.paramString({
        destroy: true,
        public_id: img.dataset.name
      })}`
    });
    await _xyz.xhr({
      url: `${_xyz.host}/api/query?${mapp.utils.paramString({
        template: "set_field_array",
        locale: _xyz.locale.key,
        layer: entry.location.layer.key,
        table: entry.location.table,
        action: "remove",
        field: entry.field,
        secure_url: img.dataset.src,
        id: entry.location.id
      })}`
    });
    img.parentNode.remove();
  }
};
