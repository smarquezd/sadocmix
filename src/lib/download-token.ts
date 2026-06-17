import crypto from "crypto";

// Tokens de descarga firmados con HMAC — sin base de datos. El token lleva el
// producto (slug + daw) y una caducidad; el endpoint /api/descarga lo verifica.
// El secreto vive en DOWNLOAD_SIGNING_SECRET (cadena aleatoria larga).
const SECRET = process.env.DOWNLOAD_SIGNING_SECRET || "";

const DEFAULT_TTL = 1000 * 60 * 60 * 24 * 7; // 7 días

function b64url(buf: Buffer) {
  return buf.toString("base64url");
}

export function signDownload(slug: string, daw = "", ttlMs = DEFAULT_TTL) {
  const payload = JSON.stringify({ slug, daw, exp: Date.now() + ttlMs });
  const data = b64url(Buffer.from(payload));
  const sig = b64url(crypto.createHmac("sha256", SECRET).update(data).digest());
  return `${data}.${sig}`;
}

export function verifyDownload(token: string): { slug: string; daw: string } | null {
  if (!token || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  const expected = b64url(crypto.createHmac("sha256", SECRET).update(data).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const { slug, daw, exp } = JSON.parse(Buffer.from(data, "base64url").toString());
    if (Date.now() > exp) return null;
    return { slug, daw: daw || "" };
  } catch {
    return null;
  }
}
