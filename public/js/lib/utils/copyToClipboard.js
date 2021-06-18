export function copyToClipboard(str) {
  let textArea = mapp.utils.html.node`<textarea style="visibility=none;">`;
  textArea.value = str;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}
