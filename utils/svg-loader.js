export async function loadIcon(name) {
  const res = await fetch(chrome.runtime.getURL(`./icons/${name}.svg`));
  if (!res.ok) {
    throw new Error(`Failed to load icon: ${name}`);
  }
  return await res.text();
}