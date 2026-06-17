import Stripe from "stripe";

// Cliente de Stripe (lado servidor), creado de forma perezosa: instanciarlo a
// nivel de módulo rompería el build (no hay STRIPE_SECRET_KEY en build-time).
// La clave vive en STRIPE_SECRET_KEY (test sk_test_… / producción sk_live_…).
let client: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!client) client = new Stripe(key);
  return client;
}
