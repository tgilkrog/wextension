import { createSaveFields, loadFields } from './storage.js';
import { createField } from './ui/createField.js';

const container = document.getElementById('fields-container');
const saveFields = createSaveFields(container);

/* Load the different saved fields */
document.addEventListener('DOMContentLoaded', async () => {
  await loadFields(container, (field) => createField(container, saveFields, field), saveFields);
});

/* Add new field to extension */
document.getElementById('add-field').addEventListener('click', () => {
  createField(container, saveFields, '');
  saveFields();
});

/* Fill out user info with button click */
document.getElementById('fill_user').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "auto-login" });
  window.close();
});

/* Fill checkout fields with data */
document.getElementById('fillData').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content-fill.js']
  });

  window.close();
});