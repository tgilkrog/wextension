// Helper: Encode string to Uint8Array
function encode(str) {
    return new TextEncoder().encode(str);
}

// Helper: Decode Uint8Array to string
function decode(buf) {
    return new TextDecoder().decode(buf);
}

// Generate a key from a passphrase
async function getKeyFromPassphrase(passphrase, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(passphrase),
        {name: "PBKDF2"},
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256},
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypt a text using passphrase
export async function encrypt(text, passphrase) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getKeyFromPassphrase(passphrase, salt);
    const encrypted = await crypto.subtle.encrypt(
        {name: "AES-GCM", iv: iv},
        key,
        encode(text)
    );

    // Return salt, iv and ciphertext concatenated in base64 for storage
    const buffer = new Uint8Array([
        ...salt,
        ...iv,
        ...new Uint8Array(encrypted)
    ]);
    return btoa(String.fromCharCode(...buffer));
}

// Decrypt the stored base64 encrypted string
export async function decrypt(dataB64, passphrase) {
    const data = Uint8Array.from(atob(dataB64), c => c.charCodeAt(0));
    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encrypted = data.slice(28);

    const key = await getKeyFromPassphrase(passphrase, salt);
    const decrypted = await crypto.subtle.decrypt(
        {name: "AES-GCM", iv: iv},
        key,
        encrypted
    );
    return decode(new Uint8Array(decrypted));
}
