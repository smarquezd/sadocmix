import type { NextRequest } from "next/server";
import { list } from "@vercel/blob";
import { verifyDownload } from "@/lib/download-token";

// Sirve el archivo del producto si el token de descarga es válido (no caducado
// y bien firmado). Los archivos viven en Vercel Blob bajo la convención:
//   productos/<slug>.zip                      (producto sin DAW)
//   productos/<slug>/<daw-slug>.zip           (producto con DAW)
export const runtime = "nodejs";

function slugify(s: string) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token") || "";
  const data = verifyDownload(token);
  if (!data) return new Response("Enlace inválido o caducado", { status: 410 });

  const prefix = data.daw
    ? `productos/${data.slug}/${slugify(data.daw)}`
    : `productos/${data.slug}`;

  try {
    const { blobs } = await list({ prefix });
    const blob = blobs.find((b) => b.pathname.startsWith(prefix)) || blobs[0];
    if (!blob) return new Response("Archivo no encontrado", { status: 404 });

    const file = await fetch(blob.url);
    if (!file.ok || !file.body) return new Response("Archivo no disponible", { status: 502 });

    const filename = blob.pathname.split("/").pop() || `${data.slug}.zip`;
    return new Response(file.body, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error("[descarga]", e);
    return new Response("Error al servir el archivo", { status: 500 });
  }
}
