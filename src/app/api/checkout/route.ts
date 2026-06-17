import type { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProducto } from "@/data/productos";

// Crea una Stripe Checkout Session para un producto (y DAW opcional) y
// devuelve la URL de pago. El front redirige a esa URL.
export const runtime = "nodejs";

function precioCentimos(price: string): number {
  const m = String(price).match(/[\d.,]+/);
  if (!m) return 0;
  return Math.round(parseFloat(m[0].replace(",", ".")) * 100);
}

export async function POST(req: NextRequest) {
  let slug = "";
  let daw = "";
  try {
    const body = await req.json();
    slug = body.slug || "";
    daw = body.daw || "";
  } catch {
    return Response.json({ error: "Petición inválida" }, { status: 400 });
  }

  const producto = getProducto(slug);
  if (!producto) return Response.json({ error: "Producto no encontrado" }, { status: 404 });

  const cents = precioCentimos(producto.price);
  if (cents <= 0) return Response.json({ error: "Este producto es gratuito" }, { status: 400 });

  const origin =
    req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: producto.title + (daw ? ` · ${daw}` : "") },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      metadata: { slug, daw },
      success_url: `${origin}/recursos/${slug}?compra=ok`,
      cancel_url: `${origin}/recursos/${slug}`,
    });
    return Response.json({ url: session.url });
  } catch (e) {
    console.error("[checkout]", e);
    return Response.json({ error: "No se pudo iniciar el pago" }, { status: 500 });
  }
}
