import type { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProducto } from "@/data/productos";
import { signDownload } from "@/lib/download-token";
import { enviarDescarga } from "@/lib/email";

// Webhook de Stripe. Al confirmarse el pago (checkout.session.completed) firma
// un token de descarga y envía el email con el enlace. Necesita el body CRUDO
// para verificar la firma → usamos req.text() (no req.json()).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (e) {
    console.error("[webhook] firma inválida", e);
    return new Response("Firma inválida", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // Recuperamos la sesión COMPLETA desde Stripe a partir de su id. Así
    // funciona tanto con payload completo (snapshot) como con el "thin"/Breve,
    // que solo trae IDs sin customer_details ni metadata.
    const obj = event.data.object as { id?: string };
    let email = "";
    let slug = "";
    let daw = "";
    try {
      const session = await getStripe().checkout.sessions.retrieve(obj.id || "");
      email = session.customer_details?.email || "";
      slug = (session.metadata?.slug as string) || "";
      daw = (session.metadata?.daw as string) || "";
    } catch (e) {
      console.error("[webhook] no se pudo recuperar la sesión", e);
    }

    if (email && slug) {
      const producto = getProducto(slug);
      const site = process.env.NEXT_PUBLIC_SITE_URL || "";
      const token = signDownload(slug, daw);
      const url = `${site}/api/descarga?token=${encodeURIComponent(token)}`;
      try {
        await enviarDescarga({ to: email, titulo: producto?.title || "tu compra", url, daw });
      } catch (e) {
        console.error("[webhook] fallo al enviar email", e);
      }
    }
  }

  return Response.json({ received: true });
}
