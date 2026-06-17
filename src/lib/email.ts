import { Resend } from "resend";

// Envío del email de entrega con Resend. El cliente se crea dentro de la
// función (no a nivel de módulo) para no romper el build sin RESEND_API_KEY.
// Remitente en EMAIL_FROM (dominio verificado en Resend; en pruebas vale
// "onboarding@resend.dev", que solo entrega a tu propio correo).
export async function enviarDescarga({
  to,
  titulo,
  url,
}: {
  to: string;
  titulo: string;
  url: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY || "");
  const from = process.env.EMAIL_FROM || "Sadoc <onboarding@resend.dev>";
  return resend.emails.send({
    from,
    to,
    subject: `Tu descarga — ${titulo}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1a1612;">
        <h2 style="font-size:20px;margin:0 0 8px;">¡Gracias por tu compra!</h2>
        <p style="font-size:15px;line-height:1.6;color:#555;margin:0 0 20px;">
          Ya tienes lista tu descarga de <strong>${titulo}</strong>.
        </p>
        <a href="${url}" style="display:inline-block;background:#E8600A;color:#0A0807;font-weight:bold;font-size:15px;text-decoration:none;padding:14px 26px;border-radius:9px;">
          Descargar ahora
        </a>
        <p style="font-size:12.5px;color:#999;line-height:1.6;margin:22px 0 0;">
          El enlace caduca en 7 días. Si tienes cualquier problema, responde a este correo.<br/>
          Sadoc · Mezcla &amp; Mastering
        </p>
      </div>
    `,
  });
}
