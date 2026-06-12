const BASE = process.env.EXPO_PUBLIC_BACKEND_URL || "";
export const API = `${BASE}/api`;

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: any; token?: string | null } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  const res = await fetch(`${API}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try { const j = await res.json(); detail = j.detail || detail; } catch {}
    throw new Error(detail);
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

export async function aiStream(message: string, sessionId: string, token: string, onChunk: (t: string) => void) {
  const res = await fetch(`${API}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  if (!res.ok || !res.body) throw new Error("AI request failed");
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(dec.decode(value, { stream: true }));
  }
}
