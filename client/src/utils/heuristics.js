const GRAPHICS_KEYWORDS = [
  "display", "monitor", "screen", "graphics", "gpu", "driver",
  "crash", "crashing", "freeze", "frozen",
  "performance", "slow", "lag", "stutter", "fps",
  "render", "video", "zoom", "teams", "external monitor"
];

const NETWORK_KEYWORDS = [
  "internet", "online", "wifi", "wi-fi", "vpn", "network",
  "disconnect", "disconnected", "timeout", "timed out",
  "cannot connect", "can't connect", "unable to connect",
  "sync", "sign in", "login", "loading", "stuck loading"
];

export function impliesGraphics(allText) {
  const t = (allText || "").toLowerCase();
  return GRAPHICS_KEYWORDS.some(k => t.includes(k));
}

export function impliesNetwork(allText) {
  const t = (allText || "").toLowerCase();
  return NETWORK_KEYWORDS.some(k => t.includes(k));
}
