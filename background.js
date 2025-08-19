import { loadCredentialsIntoInput } from './storage.js';

async function performAutoLogin() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const credentials = await loadCredentialsIntoInput();

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (credentials) => {
            const userEl = document.querySelector('[name="sw-field--username"]');
            const passEl = document.querySelector('[name="sw-field--password"]');
            const loginBtn = document.querySelector('.sw-login__login-action, .sw-button--primary');

            if (userEl && passEl) {
                userEl.value = credentials.username;
                passEl.value = credentials.password;
                userEl.dispatchEvent(new Event('input', { bubbles: true }));
                passEl.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (passEl && !userEl) {
                passEl.value = credentials.password;
                passEl.dispatchEvent(new Event('input', { bubbles: true }));
            }

            setTimeout(() => {
                if (loginBtn) loginBtn.click();
            }, 300);
        },
        args: [credentials]
    });
}

// Trigger from keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
    if (command === "auto-login") {
        performAutoLogin();
    }
});

// Trigger from popup button
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "auto-login") {
        performAutoLogin();
    }
});