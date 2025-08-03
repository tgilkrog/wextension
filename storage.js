import { debounce } from './utils/debounce.js';
import { encrypt, decrypt } from "./logic/encryption.js";

export function createSaveFields(container)
{
  return debounce(() => {
    const values = Array.from(container.children).map(wrapper => {
      const input = wrapper.querySelector('input');
      const isCollapsed = wrapper.querySelector('.field-content').style.display === 'none';
      return { value: input.value, collapsed: isCollapsed };
    });
    chrome.storage.local.set({ fields: values });
  });
}

export async function loadFields(container, createField, saveFields)
{
  chrome.storage.local.get('fields', async (data) => {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    const values = Array.isArray(data.fields)
      ? data.fields.map(f => typeof f === 'string' ? { value: f, collapsed: false } : f)
      : [{ value: '', collapsed: false }];

    for (const field of values) {
      const node = await createField(field);
      fragment.appendChild(node);
    }

    container.appendChild(fragment);
  });
}

/* SETTINGS */
export const saveFormData = debounce(() => {
  const inputs = document.querySelectorAll('.checkout_fields input');
  const data = {};

  inputs.forEach(input => {
    data[input.name] = input.value;
  });

  chrome.storage.local.set({ checkoutData: data });
});

export function loadFormData() {
  chrome.storage.local.get('checkoutData', (result) => {
    const data = result.checkoutData || {};
    const inputs = document.querySelectorAll('.checkout_fields input');

    inputs.forEach(input => {
      if (data[input.name] !== undefined) {
        input.value = data[input.name];
      }
    });
  });
}

async function hashPassphrase(passphrase) {
  const enc = new TextEncoder();
  const data = enc.encode(passphrase);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

// Save credentials for the first time
export async function setupCredentials() {
  const passphrase = document.querySelector('#passphrase').value;
  const username = document.querySelector('.log_credentials #username').value;
  const password = document.querySelector('.log_credentials #password').value;

  const encryptedUsername = await encrypt(username, passphrase);
  const encryptedPassword = await encrypt(password, passphrase);
  //const passphraseHash = await hashPassphrase(passphrase);
  const now = Date.now();

  chrome.storage.local.set({
    encUsername: encryptedUsername,
    encPassword: encryptedPassword,
    passphrase: passphrase,
    lastAuthorized: now,
  });
}

export async function loadCredentialsIntoInput() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['encUsername', 'encPassword', 'passphrase'], async (items) => {
      if (!items.encUsername || !items.encPassword ) {
        resolve(null);
        return;
      }

      try {
        const passphrase = items.passphrase;
        const username = await decrypt(items.encUsername, passphrase);
        const password = await decrypt(items.encPassword, passphrase);

        resolve({ username, password });
      } catch (e) {
        console.error("Decryption failed or wrong passphrase", e);
        reject(e);
      }
    });
  });
}