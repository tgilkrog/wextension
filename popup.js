import { createSaveFields, loadFields } from './storage.js';
import { createField } from './ui/createField.js';

const container = document.getElementById('fields-container');
const saveFields = createSaveFields(container);

document.getElementById('add-field').addEventListener('click', () => {
  createField(container, saveFields, '');
  saveFields();
});

document.addEventListener('DOMContentLoaded', async () => {
  await loadFields(container, (field) => createField(container, saveFields, field), saveFields);
});
