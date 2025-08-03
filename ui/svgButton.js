export function createSvgButton({ title, className, svg }) {
  const btn = document.createElement('button');
  btn.title = title;
  btn.className = className;
  btn.innerHTML = svg;
  return btn;
}
