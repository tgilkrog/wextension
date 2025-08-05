import { saveFormData, loadFormData, loadCredentialsIntoInput, setupCredentials } from './storage.js';

document.getElementById('fillData').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content-fill.js']
  });
});

document.getElementById('fill_user').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const credentials = await loadCredentialsIntoInput();  // Await here

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (credentials) => {
      const userEl = document.querySelector('[name="sw-field--username"]');
      const passEl = document.querySelector('[name="sw-field--password"]');
      const loginBtn = document.querySelector('.sw-login__login-action');

      if (userEl && passEl) {
        userEl.value = credentials.username;
        passEl.value = credentials.password;
        userEl.dispatchEvent(new Event('input', { bubbles: true }));
        passEl.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(() => {
          if (loginBtn) {
            loginBtn.click();
          }
        }, 300);
      }
    },
    args: [credentials]  // Pass credentials into the page context
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const settingsBtn = document.querySelector(".settings_btn");
  const settingsPage = document.querySelector(".settings_page");
  const closeBtn = document.querySelector(".settings_close");
  const overlay = document.querySelector(".settings_overlay");

  const checkoutBtn = document.querySelector(".set_checkout_btn");
  const loginBtn = document.querySelector(".set_login_btn");

  const openSettings = () => {
    settingsPage.classList.add("open");
    overlay.classList.add("visible");
  };

  const closeSettings = () => {
    settingsPage.classList.remove("open");
    overlay.classList.remove("visible");
  };

  settingsBtn.addEventListener("click", openSettings);
  closeBtn.addEventListener("click", closeSettings);
  overlay.addEventListener("click", closeSettings);

  loadFormData();
  document.querySelectorAll('.checkout_fields input').forEach(input => {
    input.addEventListener('change', saveFormData);
  });

  const credentials = await loadCredentialsIntoInput();
  if (credentials !== null) {
    document.querySelector('.log_credentials #username').value = credentials['username'];
    document.querySelector('.log_credentials #password').value = credentials['password'];
    document.querySelector('.log_credentials #passphrase').value = credentials['passphrase'];
  }

  document.querySelector('.log_credentials .passphrase_btn').addEventListener("click", function() {
    setupCredentials();
  });

  /* SHOW LOGIN */
  loginBtn.addEventListener("click", function () {
    document.querySelector('.checkout_fields').style.display = 'none';
    document.querySelector('.log_credentials').style.display = 'block';
  });

  /* SHOW CHECKOUT */
  checkoutBtn.addEventListener("click", function () {
    document.querySelector('.log_credentials').style.display = 'none';
    document.querySelector('.checkout_fields').style.display = 'block';
  });

  /* SHOW PASSWORD */
  const toggle = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const icon = toggle.querySelector('img');

  toggle.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    // Swap icon
    icon.src = isPassword ? './icons/eye-slash-solid.svg' : './icons/eye-solid.svg';
    icon.alt = isPassword ? 'Hide Password' : 'Show Password';
  });
});