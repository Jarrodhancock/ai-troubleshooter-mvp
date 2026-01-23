// client/src/api.js (or wherever your current api.js lives)

// Use VITE_API_BASE_URL if set, otherwise fall back to relative paths
const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, ''); // remove trailing slash

function url(path) {
  // ensures we don't end up with double slashes
  if (!BASE) return path;
  return `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function uploadScreenshot(file) {
  const form = new FormData();
  form.append('screenshot', file);

  const res = await fetch(url('/api/upload'), {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }

  return res.json();
}

export async function sendChat({ sessionId, summaryText, messages }) {
  const res = await fetch(url('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, summaryText, messages }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Chat failed');
  }

  return res.json();
}
