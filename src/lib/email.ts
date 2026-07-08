import { Resend } from "resend";

// Envío del email de entrega con Resend. El cliente se crea dentro de la
// función (no a nivel de módulo) para no romper el build sin RESEND_API_KEY.
// Remitente en EMAIL_FROM (dominio verificado en Resend; en pruebas vale
// "onboarding@resend.dev", que solo entrega a tu propio correo).
export async function enviarDescarga({
  to,
  titulo,
  url,
  daw = "",
}: {
  to: string;
  titulo: string;
  url: string;
  daw?: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY || "");
  const from = process.env.EMAIL_FROM || "Sadoc <onboarding@resend.dev>";
  return resend.emails.send({
    from,
    to,
    subject: `Tu descarga — ${titulo}${daw ? ` (${daw})` : ""}`,
    html: emailDescargaHTML({ titulo, url, daw }),
  });
}

// -------------------------------------------------------------------------
// Plantilla del email (dark editorial de la marca: negro + crema + naranja
// plano). Maquetada con tablas e inline styles para que se vea bien en
// Gmail, Apple Mail, Outlook, etc. Las fuentes de marca (Archivo/Inter/DM
// Mono) degradan a stacks seguros porque el correo no puede cargar webfonts.
// -------------------------------------------------------------------------
function emailDescargaHTML({ titulo, url, daw = "" }: { titulo: string; url: string; daw?: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const F = {
    display: "Archivo,'Helvetica Neue',Arial,sans-serif",
    body: "Inter,'Helvetica Neue',Arial,sans-serif",
    mono: "'DM Mono',ui-monospace,Menlo,Consolas,monospace",
  };
  // Logo blanco (1199×320 → ratio 3.75). Si no hay URL pública, wordmark texto.
  const logo = site
    ? `<img src="${site}/img/logo-white.png" width="135" height="36" alt="Sadoc" style="display:block;border:0;outline:none;text-decoration:none;width:135px;height:36px;">`
    : `<span style="font-family:${F.display};font-size:20px;font-weight:800;color:#F3EFE8;letter-spacing:-0.5px;">Sadoc</span>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>Tu descarga</title>
</head>
<body style="margin:0;padding:0;background:#000000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#000000;">
  <tr>
    <td align="center" style="padding:40px 20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="520" style="width:520px;max-width:520px;">
        <tr>
          <td align="left" style="padding:0 4px 26px;">${logo}</td>
        </tr>
        <tr>
          <td style="background:#0E0D0C;border:1px solid rgba(255,255,255,0.10);border-radius:16px;padding:36px 34px;">
            <p style="margin:0 0 14px;font-family:${F.mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#E8600A;">Compra confirmada</p>
            <h1 style="margin:0 0 12px;font-family:${F.display};font-size:26px;line-height:1.15;font-weight:800;color:#F3EFE8;letter-spacing:-0.5px;">Gracias por tu compra</h1>
            <p style="margin:0 0 28px;font-family:${F.body};font-size:15px;line-height:1.6;color:#988F86;">Ya tienes lista tu descarga de <span style="color:#F4F1EC;font-weight:600;">${titulo}</span>${daw ? ` para <span style="color:#F4F1EC;font-weight:600;">${daw}</span>` : ""}. Pulsa el botón para guardarla en tu equipo.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="#E8600A" style="border-radius:9px;">
                  <a href="${url}" target="_blank" style="display:inline-block;padding:15px 30px;font-family:${F.display};font-size:15px;font-weight:700;color:#0A0807;text-decoration:none;border-radius:9px;">Descargar ahora &rarr;</a>
                </td>
              </tr>
            </table>
            <p style="margin:28px 0 0;font-family:${F.body};font-size:12.5px;line-height:1.6;color:#5E574F;">El enlace caduca en <strong style="color:#988F86;">7 días</strong>. Si el botón no funciona, copia y pega esta dirección en tu navegador:</p>
            <p style="margin:8px 0 0;font-family:${F.mono};font-size:11.5px;line-height:1.5;color:#5E574F;word-break:break-all;">${url}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 4px 0;">
            <p style="margin:0;font-family:${F.mono};font-size:11px;line-height:1.7;color:#5E574F;">
              ¿Algún problema? Responde a este correo y te ayudo.<br>
              Sadoc &middot; Mezcla &amp; Mastering
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
