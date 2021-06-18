export default (_xyz) => function() {
  const location = this;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", _xyz.host + "/api/location/delete?" + mapp.utils.paramString({
    locale: _xyz.locale.key,
    layer: location.layer.key,
    table: location.table,
    id: location.id
  }));
  xhr.onload = (e) => {
    if (e.target.status !== 200)
      return;
    location.layer.reload();
    location.remove();
  };
  if (confirm("Are you sure you want to delete this feature? This cannot be undone."))
    xhr.send();
};
