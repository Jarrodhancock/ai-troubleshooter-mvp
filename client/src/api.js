// Use relative paths so Vite will proxy them to the backend during dev.
export async function uploadScreenshot(file) {
  const form = new FormData();
  form.append("screenshot", file);

  const res = await fetch(`/api/upload`, {
    method: "POST",
    body: form
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Upload failed");
  }

  return res.json();
}

export async function sendChat({ sessionId, summaryText, messages }) {
  const res = await fetch(`/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, summaryText, messages })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Chat failed");
  }

  return res.json();
}
