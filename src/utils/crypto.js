/**
 * IdentityLens — Zero-Knowledge Cryptographic Utilities
 * Uses Web Crypto API (SubtleCrypto) for client-side AES-256-GCM and SHA-256 hashing.
 * Guarantees raw PII never leaves the user's browser unencrypted.
 */

export async function sha256Hex(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function deriveKey(masterPassword, saltHex, iterations = 100000) {
  const enc = new TextEncoder();
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(masterPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(plainText, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  return {
    cipherTextHex: Array.from(new Uint8Array(cipherBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
    ivHex: Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
  };
}

export async function decryptData(cipherTextHex, ivHex, key) {
  const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
  const cipher = new Uint8Array(cipherTextHex.match(/.{1,2}/g).map((b) => parseInt(b, 16)));

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    cipher
  );

  return new TextDecoder().decode(decryptedBuffer);
}
