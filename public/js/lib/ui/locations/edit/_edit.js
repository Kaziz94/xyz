import range from "./range.js";
import options from "./options.js";
import date from "./date.js";
import textarea from "./textarea.js";
export default (_xyz) => {
  const edit = {
    input,
    range: range(_xyz),
    date: date(_xyz),
    options: options(_xyz),
    textarea: textarea(_xyz)
  };
  return edit;
  function input(entry) {
    if (!entry.edit)
      return;
    if (entry.type === "date" || entry.type === "datetime")
      return edit.date(entry);
    if (entry.edit.range)
      return edit.range(entry);
    if (entry.edit.options)
      return edit.options(entry);
    if (entry.type === "textarea" || entry.type === "html")
      return edit.textarea(entry);
    entry.val.appendChild(mapp.utils.html.node`
    <input
      type="${(entry.type === "numeric" || entry.type === "integer") && "number" || "text"}"
      value="${entry.value || entry.displayValue || ""}"
      onkeyup=${(e) => {
      entry.location.view.dispatchEvent(new CustomEvent("valChange", {
        detail: {
          input: e.target,
          entry
        }
      }));
    }}>`);
  }
};
