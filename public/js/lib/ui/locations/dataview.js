export default (entry) => {
  if (entry.target === "location" || entry.dataview && entry.dataview.classList.contains("location")) {
    if (entry.dataview) {
      entry.update();
      return entry.dataview;
    }
    entry.target = mapp.utils.html.node`
      <div
        class="${`location ${entry.class}`}"
        style="${`${entry.style || ""}`}">`;
    mapp.ui.dataview(entry);
    return entry.dataview;
  }
  if (typeof entry.target === "string" && document.getElementById(entry.target)) {
    entry.target = document.getElementById(entry.target);
    mapp.ui.dataview(entry);
    return;
  }
  if (entry.mapview.tabview) {
    entry.tab_style = `border-bottom: 2px solid ${entry.location.style.strokeColor}`;
    entry.mapview.tabview.tab(entry);
    mapp.ui.dataview(entry);
    entry.display && entry.show();
    return mapp.utils.html.node`
      <label
        class="${`input-checkbox mobile-disabled ${entry.class}`}">
        <input
          type="checkbox"
          .checked=${!!entry.display}
          onchange=${(e) => {
      entry.display = e.target.checked;
      entry.display ? entry.show() : entry.remove();
    }}></input>
        <div></div>
        <span>${entry.title || "Dataview"}`;
  }
};
