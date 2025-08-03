export function buildButtonGroup(group, input) {
  const groupContainer = document.createElement('div');
  groupContainer.className = 'button-group-container';

  const label = document.createElement('div');
  label.className = 'button-group-label';
  label.textContent = group.label;

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'button-group';

  group.buttons.forEach(({ title, icon, name, buildUrl }) => {
    const btn = document.createElement('button');
    btn.title = title;
    btn.className = name;
    btn.innerHTML = icon.trim().startsWith('<svg') ? icon : '';
    btn.addEventListener('click', () => {
      const val = input.value;
      if (val) chrome.tabs.create({ url: buildUrl(val) });
    });
    buttonsDiv.appendChild(btn);
  });

  groupContainer.append(label, buttonsDiv);
  return groupContainer;
}
