let dragSrcEl = null;  // <-- Move here, outside the function

export function makeDraggable(wrapper, handle, container, saveFields) {
  handle.setAttribute('draggable', 'true');

  handle.addEventListener('dragstart', (e) => {
    dragSrcEl = wrapper;  // sets the global dragSrcEl
    e.dataTransfer.effectAllowed = 'move';
    wrapper.classList.add('dragging');
  });

  handle.addEventListener('dragend', () => {
    wrapper.classList.remove('dragging');
    [...container.children].forEach(c => c.classList.remove('over'));
  });

  wrapper.addEventListener('dragenter', function () {
    if (this !== dragSrcEl) this.classList.add('over');
  });

  wrapper.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  wrapper.addEventListener('dragleave', function () {
    this.classList.remove('over');
  });

  wrapper.addEventListener('drop', function () {
    if (dragSrcEl !== this) {
      const children = Array.from(container.children);
      const dragIndex = children.indexOf(dragSrcEl);
      const dropIndex = children.indexOf(this);

      if (dragIndex < dropIndex) {
        container.insertBefore(dragSrcEl, this.nextSibling);
      } else {
        container.insertBefore(dragSrcEl, this);
      }

      saveFields();
    }
    this.classList.remove('over');
  });
}
