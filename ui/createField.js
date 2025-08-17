import { buildButtonGroup } from './buildButtonGroup.js';
import { createSvgButton } from './svgButton.js';
import { makeDraggable } from '../logic/dragAndDrop.js';
import { buttonGroups } from '../environments.js';
import { loadIcon } from '../utils/svg-loader.js';

export async function createField(container, saveFields, field = { value: '', collapsed: false }) {
  const [drag_icon, remove_icon, gitlab_icon] = await Promise.all([
    loadIcon('grip'),
    loadIcon('x-solid'),
    loadIcon('gitlab')
  ]);

  const wrapper = document.createElement('div');
  wrapper.className = 'line-item';

  const topDiv = document.createElement('div');
  topDiv.className = 'topDiv';

  const collapseToggle = document.createElement('button');
  collapseToggle.textContent = field.collapsed ? '▶' : '▼';
  collapseToggle.className = 'collapse-toggle';
  collapseToggle.title = 'Collapse/Expand';
  collapseToggle.style.marginRight = '8px';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = field.value || 'wexo';
  input.style.flex = '1';
  input.addEventListener('input', saveFields);

  const dragHandle = createSvgButton({
    title: 'Drag to reorder',
    className: 'drag-handle',
    svg: drag_icon
  });

  const removeBtn = createSvgButton({
    title: 'Remove this field',
    className: 'remove-button',
    svg: remove_icon
  });
  removeBtn.addEventListener('click', () => {
    container.removeChild(wrapper);
    saveFields();
  });

  const gitlabBtn = createSvgButton({
    title: 'Go to Gitlab',
    className: 'gitlabBtn',
    svg: gitlab_icon
  });
  gitlabBtn.addEventListener('click', () => {
    const value = input.value.trim();
    if (value) {
      const url = `https://gitlab.wexo.io/sw6/projects/${encodeURIComponent(value)}`;
      chrome.tabs.create({ url });
    }
  });

  topDiv.append(collapseToggle, input, dragHandle, gitlabBtn, removeBtn);
  wrapper.appendChild(topDiv);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'field-content';
  if (field.collapsed) contentDiv.classList.add('collapsed');

  buttonGroups.then(groups => {
    const allGroupsContainer = document.createElement('div');
    allGroupsContainer.className = 'all-button-groups';

    groups.forEach(group => {
      const buttonGroup = buildButtonGroup(group, input);
      allGroupsContainer.appendChild(buttonGroup);
    });

    contentDiv.appendChild(allGroupsContainer);
  });

  wrapper.appendChild(contentDiv);
  container.appendChild(wrapper);

  makeDraggable(wrapper, dragHandle, container, saveFields);

  collapseToggle.addEventListener('click', () => {
    const isCollapsed = contentDiv.classList.toggle('collapsed');
    collapseToggle.textContent = isCollapsed ? '▶' : '▼';
    saveFields();
  });

  return wrapper;
}
