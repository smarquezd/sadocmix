// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, Volume2, VolumeX, Check, ArrowRight, ArrowUpRight,
  ShoppingBag, Menu, X, Disc3, Plus, Headphones, Sparkles, Info,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PRODUCTOS } from "../data/productos";
import { DISCOGRAFIA } from "../data/discografia";
import { DottedSurface } from "@/components/ui/dotted-surface";

/* ----------------------- logo 3D (paquete "3dsvg") ----------------------- */
/*  <SVG3D> extruye un SVG a 3D en el navegador (usa WebGL). En Next.js debe */
/*  cargarse con next/dynamic y ssr:false. Usamos SOLO el isotipo (3 aspas): */
/*  el logo completo con el texto pequeño genera una malla enorme y pesada.  */
const SVG3D = dynamic(() => import("3dsvg").then((m) => ({ default: m.SVG3D })), {
  ssr: false,
  loading: () => <HeroLogoPlaceholder />,
});

function HeroLogoPlaceholder() {
  return (
    <div style={{
      width: "min(400px, 82vw)", height: "min(400px, 82vw)",
      display: "grid", placeItems: "center",
      borderRadius: 32, background: "rgba(255,255,255,.025)",
      border: "1px solid rgba(255,255,255,.08)",
    }}>
      <IsotipoMark size={88} color="rgba(255,255,255,.24)" />
    </div>
  );
}

/* Isotipo de la marca como SVG en línea, para usarlo como icono pequeño. */
function IsotipoMark({ size = 22, color = "#E8600A" }) {
  return (
    <svg
      viewBox="332.63 68.05 176.63 220.74"
      height={size}
      width={Math.round(size * 0.8)}
      fill={color}
      aria-hidden="true"
      style={{ flex: "none", display: "block" }}
    >
      <path d="M495.26,145.75L495.26,145.75L379.4,226.01c-13.85,9.59-32.77-0.32-32.77-17.16v0l115.86-80.26C476.34,119,495.26,128.91,495.26,145.75z" />
      <path d="M401.4,234.34l93.86-65.02v15.21c0,15.44-7.57,29.9-20.27,38.69l-74.44,51.57L401.4,234.34z" />
      <path d="M439.99,122.5l-93.36,64.67v-15.21c0-15.44,7.57-29.9,20.27-38.69l73.94-51.22L439.99,122.5z" />
    </svg>
  );
}

const ISOTIPO_3D_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="332.63 68.05 176.63 220.74"><path d="M495.26,145.75L495.26,145.75L379.4,226.01c-13.85,9.59-32.77-0.32-32.77-17.16v0l115.86-80.26C476.34,119,495.26,128.91,495.26,145.75z"/><path d="M401.4,234.34l93.86-65.02v15.21c0,15.44-7.57,29.9-20.27,38.69l-74.44,51.57L401.4,234.34z"/><path d="M439.99,122.5l-93.36,64.67v-15.21c0-15.44,7.57-29.9,20.27-38.69l73.94-51.22L439.99,122.5z"/></svg>`;

/* Logo 3D del hero: "mira" suavemente hacia el cursor. Usamos el cursorOrbit
   nativo del motor (sigue el ratón en toda la ventana y amortigua solo).
   `orbitStrength` controla cuánto gira (radianes máx.); subir = más giro.
   Ojo: interactive debe ir en true o el motor apaga cursorOrbit; draggable
   en false para que no se pueda arrastrar. */
function HeroLogo3D() {
  return (
    <div style={{ width: "min(400px, 82vw)", height: "min(400px, 82vw)" }}>
      <SVG3D
        svg={ISOTIPO_3D_SVG}
        depth={0.9}
        smoothness={0.4}
        color="#ffffff"
        material="metal"
        metalness={0.9}
        roughness={0.25}
        lightIntensity={1.7}
        ambientIntensity={0.55}
        animate="none"
        interactive={true}
        cursorOrbit={true}
        orbitStrength={0.5}
        draggable={false}
        scrollZoom={false}
        rotationY={0}
        zoom={7}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SADOCMIX — homepage prototype                                      */
/*  Structure inspired by the dimelosmooth reference, rebuilt in       */
/*  Sadoc's charcoal + orange brand. Two custom additions:             */
/*   1. "Palmarés" — gold / platinum certified-record wall             */
/*   2. A working A/B mix vs. master player (two synced audio files)  */
/* ------------------------------------------------------------------ */

const C = {
  bg: "#000000",
  bg2: "rgba(255,255,255,0.018)",
  card: "#0E0D0C",
  cardHi: "#161413",
  cream: "#F3EFE8",
  cream2: "#D8D2C8",
  ink: "#0A0807",
  text: "#F4F1EC",
  muted: "#988F86",
  faint: "#5E574F",
  orange: "#E8600A",
  orangeHi: "#FF7E2B",
  line: "rgba(255,255,255,0.10)",
  lineHi: "rgba(255,255,255,0.20)",
};
const F = {
  display: "'Archivo', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'DM Mono', ui-monospace, monospace",
};
const GOLD = "radial-gradient(circle at 34% 28%, #FDEBB0 0%, #ECC152 34%, #B6841F 70%, #6F4D12 100%)";
const PLAT = "radial-gradient(circle at 34% 28%, #FCFCFB 0%, #DADDE2 36%, #A1A7B0 70%, #5C616B 100%)";
const LOGO_WHITE = "/img/logo-white.png";
const AUDIO_EN_MEDALLO_DEMO = "/audio/en-medallo-demo.mp3";
const AUDIO_EN_MEDALLO_MASTER = "/audio/en-medallo-master.mp3";



/* --------------------------- enlaces de pago --------------------------- */
/*  Enlaces de pago de Stripe (Payment Links). Crea cada uno en tu panel   */
/*  de Stripe y pega aquí la URL. Deben empezar por https://buy.stripe.com */
const PAYMENT_LINKS = {
  mezclaMastering: "https://buy.stripe.com/cNi14m1Afebe4hr3DOdnW04",
  stemMastering: "https://buy.stripe.com/6oU14m4Mr7MQaFPb6gdnW03",
  clases: "PEGA_AQUI_EL_LINK_DE_STRIPE",
};

/* ----------------------------- audio ----------------------------- */
/*  Replace the file paths below with your real audio files.          */
/*  Each track needs a `demo` (referencia) and `master` of identical  */
/*  duration. The player keeps both in sync and just swaps which one  */
/*  you hear when you toggle the A/B button.                          */
const TRACKS = [
  { id: 0, name: "En Medallo", demo: AUDIO_EN_MEDALLO_DEMO, master: AUDIO_EN_MEDALLO_MASTER },
  { id: 1, name: "Tema 02", demo: "/audio/tema-02-demo.mp3", master: "/audio/tema-02-master.mp3" },
  { id: 2, name: "Tema 03", demo: "/audio/tema-03-demo.mp3", master: "/audio/tema-03-master.mp3" },
  { id: 3, name: "Tema 04", demo: "/audio/tema-04-demo.mp3", master: "/audio/tema-04-master.mp3" },
  { id: 4, name: "Tema 05", demo: "/audio/tema-05-demo.mp3", master: "/audio/tema-05-master.mp3" },
];

/* ----------------------------- ui bits ----------------------------- */
function Kicker({ children }) {
  return (
    <div style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: "0.22em", color: C.orange, textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

function Reveal({ children, delay = 0, className = "", style = {} }) {
  return (
    <div data-reveal className={className} style={{ ...style, transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* Resplandores de estudio: focos suaves del color de marca que derivan lentos
   sobre el fondo negro. Fijos al viewport y detrás de todo el contenido. Se
   detienen si el usuario pidió menos movimiento (prefers-reduced-motion). */
function StudioGlows() {
  return (
    <div className="smx-glows" aria-hidden="true">
      <span className="smx-glow smx-glow--a" />
      <span className="smx-glow smx-glow--b" />
      <span className="smx-glow smx-glow--c" />
    </div>
  );
}

/* Marcas / artistas con los que se ha trabajado — "Trusted by".
   Para logos reales: sube el archivo (SVG o PNG con fondo transparente) a
   public/img/trusted/ y añade su ruta en `logo`. Si solo pones `name`, se
   pinta el nombre como wordmark. Los logos se monocroman a blanco solos. */
const TRUSTED = [
  // `scale` compensa el relleno interno de cada PNG para igualar el peso visual.
  // `dy` desplaza en vertical (px) los lienzos cuyo contenido no está centrado.
  { name: "Warner Music", logo: "/img/trusted/warner.png", scale: 1.1 },
  { name: "Sony Music", logo: "/img/trusted/sony.png", scale: 0.8 },
  { name: "Universal Music", logo: "/img/trusted/universal.png", scale: 1.3, dy: 8 },
  { name: "La Industria Inc.", logo: "/img/trusted/la-industria.png", scale: 1.05 },
  { name: "Rabatt", logo: "/img/trusted/rabatt.png", scale: 1.45 },
];

/* Cuenta ascendente: anima de 0 al número cuando entra en pantalla.
   Acepta valores tipo "10", "1.2B+", "230+" (conserva prefijo/sufijo). */
function CountUp({ value, duration = 1500 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(String(value).replace(/[\d.]+/, "0"));
  useEffect(() => {
    const str = String(value);
    const m = str.match(/[\d.]+/);
    if (!m) { setDisplay(str); return; }
    const target = parseFloat(m[0]);
    const prefix = str.slice(0, m.index);
    const suffix = str.slice(m.index + m[0].length);
    const decimals = (m[0].split(".")[1] || "").length;
    const el = ref.current;
    if (!el) return;
    let started = false;
    const run = () => {
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(prefix + (target * eased).toFixed(decimals) + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) { started = true; run(); }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{display}</span>;
}

/* Wordmark: pinta un PNG cuyo texto está centrado en un lienzo con mucho aire,
   recortando ese aire con una "ventana" para dimensionarlo por el alto real del
   texto. cy/h son fracciones del bbox del texto (medidas del propio PNG). */
const WORDMARK_META = {
  "/img/trusted-by.png": { cy: 0.536, h: 0.057 },
  "/img/ab-player.png": { cy: 0.541, h: 0.070 },
};
function Wordmark({ src, alt, textH = 14, opacity = 0.85, className, style }) {
  const m = WORDMARK_META[src] || { cy: 0.5, h: 0.1 };
  const imgH = textH / m.h;
  const win = Math.round(textH * 2.2);
  const mt = Math.round(win / 2 - m.cy * imgH);
  return (
    <div className={className} style={{ height: win, overflow: "hidden", ...style }}>
      <img src={src} alt={alt} draggable={false} style={{
        height: imgH, width: "auto", display: "block",
        marginLeft: "auto", marginRight: "auto", marginTop: mt, opacity,
      }} />
    </div>
  );
}

/* Banda "Trusted by": logos monocromos que se desplazan lento, se pausan al
   pasar el ratón y se iluminan al hacer hover (estilo placementchasers). */
function TrustedBy({ items }) {
  // Con pocas marcas duplicamos la base para que el bucle no deje huecos.
  const base = items.length < 8 ? [...items, ...items] : items;
  const row = [...base, ...base];
  return (
    <>
      {/* título por encima de la línea separadora, sobre el fondo negro */}
      <div style={{ padding: "clamp(40px,6vw,64px) 0 clamp(28px,4vw,40px)" }}>
        <Wordmark src="/img/trusted-by.png" alt="Trusted by" textH={27} opacity={0.72} />
      </div>
      <section style={{
        padding: "clamp(34px,5vw,50px) 0", background: C.bg2,
        borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`,
      }}>
        <div className="smx-trust">
          <div className="smx-trust__track">
            {row.map((it, i) => (
              <div key={i} className="smx-trust__item" aria-hidden={i >= items.length}>
                {it.logo ? (
                  <img
                    src={it.logo} alt={it.name} loading="lazy" draggable={false}
                    style={{
                      width: `${(it.scale || 1) * 100}%`, height: `${(it.scale || 1) * 100}%`,
                      transform: it.dy ? `translateY(${it.dy}px)` : undefined,
                    }}
                  />
                ) : (
                  <span>{it.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function DiscCard({ tier, mult, title, artist, streams, cover, delay }) {
  const tierLabel = tier === "platino" ? "Platino" : tier === "oro" ? "Oro" : "Plata";
  const tierStyle =
    tier === "platino"
      ? { color: "#E8ECF2", bg: "rgba(220,228,242,.14)", border: "rgba(220,228,242,.35)" }
      : tier === "oro"
      ? { color: "#F4D77A", bg: "rgba(244,215,122,.16)", border: "rgba(244,215,122,.4)" }
      : { color: "#C8CCD3", bg: "rgba(200,204,211,.10)", border: "rgba(200,204,211,.28)" };
  return (
    <Reveal delay={delay} className="smx-disccard smx-glowedge smx-glowedge--soft smx-liquid smx-glass" style={{
      borderRadius: 22, padding: 16, display: "flex", flexDirection: "column",
    }}>
      <div style={{
        position: "relative", aspectRatio: "1", borderRadius: 14, overflow: "hidden",
        background: C.bg, boxShadow: "0 22px 42px -16px rgba(0,0,0,.6)", marginBottom: 16,
      }}>
        <img src={cover} alt={title} style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block",
        }} />
        <div style={{
          position: "absolute", top: 10, right: 10, fontFamily: F.mono, fontSize: 10.5,
          letterSpacing: ".14em", textTransform: "uppercase", padding: "5px 11px 5px 8px",
          borderRadius: 6, color: tierStyle.color, background: "rgba(8,6,5,.6)",
          border: `1px solid ${tierStyle.border}`, backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", gap: 7,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.1)",
        }}>
          <span aria-hidden="true" style={{
            width: 11, height: 11, borderRadius: "50%", flex: "none",
            background: tier === "oro" ? GOLD : PLAT,
            boxShadow: "inset 0 0 0 .5px rgba(255,255,255,.4), 0 1px 3px rgba(0,0,0,.5)",
          }} />
          {mult}× {tierLabel}
        </div>
      </div>
      <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 19, color: C.text, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontFamily: F.body, fontSize: 13.5, color: C.muted, marginTop: 4 }}>{artist}</div>
      {streams ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.orange }} />
          <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.faint, letterSpacing: ".06em" }}>
            {streams} streams
          </span>
        </div>
      ) : null}
    </Reveal>
  );
}

function ProductCard({ badge, title, price, cover, slug, delay, onBuy }) {
  const free = price === "Gratis";
  return (
    <Reveal delay={delay} className="smx-prodcard smx-glowedge smx-glowedge--soft smx-liquid smx-glass" style={{
      borderRadius: 18, overflow: "hidden",
      display: "flex", flexDirection: "column", height: "100%",
    }}>
      <div style={{
        position: "relative", aspectRatio: "1 / 1", overflow: "hidden",
        background: "linear-gradient(150deg,#161413,#000000)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {cover ? (
          <img className="smx-prodimg__art" src={cover} alt={title} style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
          }} />
        ) : (
          <Headphones className="smx-prodimg__art" size={44} color="rgba(232,96,10,.5)" />
        )}
        <span style={{
          position: "absolute", top: 11, right: 11, zIndex: 2,
          fontFamily: F.mono, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase",
          padding: "5px 9px", borderRadius: 4,
          background: free ? C.orange : C.cream, color: C.ink,
        }}>{badge}</span>
        <div className="smx-prodadd" style={{ position: "absolute", left: 11, right: 11, bottom: 11, zIndex: 2 }}>
          <button onClick={onBuy} className="smx-tbtn" style={{ width: "100%" }}>
            <Plus size={14} /> {free ? "Descargar" : "Comprar ahora"}
          </button>
        </div>
      </div>
      <div style={{ padding: "14px 15px 16px", display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
        <div className="smx-prodtitle" style={{
          fontFamily: F.display, fontWeight: 700, fontSize: 15, color: C.text, lineHeight: 1.3,
        }}>{title}</div>
        <div style={{
          marginTop: "auto", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 10,
        }}>
          <span style={{
            fontFamily: F.display, fontWeight: 800, fontSize: 19,
            color: free ? C.orange : C.text,
          }}>{price}</span>
          <Link href={`/recursos/${slug}`} className="smx-tbtn smx-tbtn--ghost" style={{ padding: "8px 12px", fontSize: 11 }}>
            <Info size={13} /> Info
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/* ---- Ventana emergente "Info" de cada producto de la tienda ---- */
function ProductModal({ product, onClose, onBuy }) {
  useEffect(() => {
    if (!product) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [product, onClose]);

  if (!product) return null;
  const { badge, title, price, cover, descripcion, plugins, incluye } = product;
  const free = price === "Gratis";

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 320,
      background: "rgba(0,0,0,.82)", backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "clamp(14px,4vw,40px)", animation: "smxmodalbg .25s ease",
    }}>
      <style>{`
        @keyframes smxmodalbg{from{opacity:0;}to{opacity:1;}}
        @keyframes smxmodalin{from{opacity:0;transform:translateY(18px) scale(.97);}to{opacity:1;transform:translateY(0) scale(1);}}
        .smx-modal{display:flex;flex-direction:column;}
        @media(min-width:680px){.smx-modal{flex-direction:row;}}
        .smx-modal__cover{width:100%;aspect-ratio:1/1;}
        @media(min-width:680px){.smx-modal__cover{width:264px;aspect-ratio:auto;align-self:stretch;}}
      `}</style>

      <div className="smx-modal smx-glass--heavy" onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 720, maxHeight: "88vh", overflowY: "auto",
        borderRadius: 24, boxShadow: "0 40px 90px -20px rgba(0,0,0,.8)",
        animation: "smxmodalin .34s cubic-bezier(.2,.7,.2,1)", position: "relative",
      }}>
        <button onClick={onClose} aria-label="Cerrar" style={{
          position: "absolute", top: 14, right: 14, zIndex: 3,
          width: 38, height: 38, borderRadius: "50%", cursor: "pointer",
          border: `1px solid ${C.lineHi}`, background: "rgba(10,10,11,.6)",
          color: C.cream, display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        }}>
          <X size={18} />
        </button>

        {/* portada */}
        <div className="smx-modal__cover" style={{
          position: "relative", flex: "none", overflow: "hidden",
          background: "linear-gradient(150deg,#161413,#000000)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {cover ? (
            <img src={cover} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <Headphones size={58} color="rgba(232,96,10,.45)" />
          )}
          <span style={{
            position: "absolute", top: 14, left: 14,
            fontFamily: F.mono, fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase",
            padding: "5px 11px", borderRadius: 4,
            background: free ? C.orange : C.cream, color: C.ink,
          }}>{badge}</span>
        </div>

        {/* detalles */}
        <div style={{ padding: "clamp(22px,3vw,32px)", display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
          <div>
            <div style={{
              fontFamily: F.mono, fontSize: 11, letterSpacing: ".16em",
              textTransform: "uppercase", color: C.orange, marginBottom: 9,
            }}>Detalles del paquete</div>
            <h3 style={{
              fontFamily: F.display, fontWeight: 800, fontSize: "clamp(21px,2.6vw,27px)",
              lineHeight: 1.15, letterSpacing: "-.01em", color: C.text,
            }}>{title}</h3>
          </div>

          {descripcion && (
            <p style={{ fontFamily: F.body, fontSize: 14.5, lineHeight: 1.6, color: C.muted }}>{descripcion}</p>
          )}

          {plugins && plugins.length > 0 && (
            <div>
              <div style={{
                fontFamily: F.mono, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase",
                color: C.cream2, marginBottom: 12, display: "flex", alignItems: "center", gap: 8,
              }}>
                <IsotipoMark size={14} color={C.orange} /> Plugins utilizados
              </div>
              <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
                {plugins.map((p, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 13, padding: "12px 14px",
                    borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
                    background: i % 2 ? "transparent" : "rgba(244,236,224,.02)",
                  }}>
                    <span style={{ fontFamily: F.mono, fontSize: 11, color: C.faint, flex: "none", width: 22 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{
                      fontFamily: F.display, fontWeight: 700, fontSize: 14.5, color: C.text,
                      flex: 1, lineHeight: 1.25,
                    }}>{p.nombre}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.muted, flex: "none", textAlign: "right" }}>
                      {p.empresa}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {incluye && incluye.length > 0 && (
            <div>
              <div style={{
                fontFamily: F.mono, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase",
                color: C.cream2, marginBottom: 12,
              }}>Qué incluye</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {incluye.map((it, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Check size={16} color={C.orange} style={{ marginTop: 2, flex: "none" }} />
                    <span style={{ fontFamily: F.body, fontSize: 14, color: C.muted }}>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            marginTop: "auto", paddingTop: 18, borderTop: `1px solid ${C.line}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 14, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: F.mono, fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: C.faint }}>Precio</span>
              <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 27, color: free ? C.orange : C.text }}>{price}</span>
            </div>
            <button className="smx-cta" onClick={() => onBuy && onBuy()} style={{ fontWeight: 700, padding: "11px 20px" }}>
              {free ? "Descargar" : "Comprar ahora"} <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ title, price, per, bullets, featured, badge, link, delay }) {
  const ready = typeof link === "string" && link.startsWith("https://");
  // "desde 300€" → prefijo pequeño + cifra grande (jerarquía de precio high-ticket)
  const desdeMatch = String(price).match(/^desde\s+(.*)$/i);
  const pricePrefix = desdeMatch ? "desde" : null;
  const priceAmount = desdeMatch ? desdeMatch[1] : price;
  const btnLayout = {
    marginTop: "auto", width: "100%", fontSize: 13, padding: "11px 16px",
    cursor: ready ? "pointer" : "not-allowed", opacity: ready ? 1 : 0.55,
  };
  return (
    <Reveal delay={delay} className={featured ? "smx-svccard smx-liquid" : "smx-svccard smx-glowedge smx-glowedge--soft smx-liquid smx-glass"} style={{
      ...(featured ? { background: C.orange, border: "1px solid transparent" } : {}),
      borderRadius: 24, padding: "30px 28px", display: "flex", flexDirection: "column", gap: 18,
      position: "relative",
    }}>
      {badge && (
        <div style={{
          position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
          fontFamily: F.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase",
          background: C.ink, color: C.orange, padding: "6px 12px", borderRadius: 4,
          whiteSpace: "nowrap",
        }}>{badge}</div>
      )}
      <div>
        <div style={{
          fontFamily: F.display, fontWeight: 700, fontSize: 22, letterSpacing: "-.01em",
          color: featured ? C.ink : C.text,
        }}>{title}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 12 }}>
          {pricePrefix && (
            <span style={{
              fontFamily: F.mono, fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase",
              color: featured ? "rgba(22,17,12,.62)" : C.muted,
            }}>{pricePrefix}</span>
          )}
          <span style={{
            fontFamily: F.display, fontWeight: 800, fontSize: 34, letterSpacing: "-.02em",
            color: featured ? C.ink : C.text, lineHeight: 1,
          }}>{priceAmount}</span>
          <span style={{ fontFamily: F.mono, fontSize: 12, color: featured ? "rgba(22,17,12,.62)" : C.faint }}>{per}</span>
        </div>
      </div>
      <div style={{ height: 1, background: featured ? "rgba(22,17,12,.2)" : C.line }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Check size={16} color={featured ? C.ink : C.orange} style={{ marginTop: 2, flex: "none" }} />
            <span style={{
              fontFamily: F.body, fontSize: 14, lineHeight: 1.5,
              color: featured ? "rgba(22,17,12,.88)" : C.muted,
            }}>{b}</span>
          </div>
        ))}
      </div>
      {ready ? (
        <a className={featured ? "smx-cta smx-cta--ink" : "smx-cta"} href={link} target="_blank" rel="noopener noreferrer" style={btnLayout}>
          Reservar <ArrowRight size={16} />
        </a>
      ) : (
        <button className={featured ? "smx-cta smx-cta--ink" : "smx-cta"} disabled style={btnLayout}>
          Reservar <ArrowRight size={16} />
        </button>
      )}
    </Reveal>
  );
}
/* --------------------------- A/B player --------------------------- */
function CarruselDiscografia({ items }) {
  // Triplicamos la lista para que el desplazamiento manual sea infinito en ambos sentidos.
  const loop = [...items, ...items, ...items];
  const scrollerRef = useRef(null);
  const stateRef = useRef({
    mouseOver: false,
    dragging: false,
    touchActive: false,
    lastX: 0,
    moved: 0,
    singleWidth: 0,
    lastTime: 0,
  });
  const SPEED = 64; // px/segundo de auto-scroll

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const s = stateRef.current;
    s.lastTime = performance.now();
    let raf = 0;

    const measure = () => {
      s.singleWidth = el.scrollWidth / 3;
      // arrancar en la copia del medio (para tener margen a ambos lados)
      if (el.scrollLeft < s.singleWidth - 5 || el.scrollLeft > 2 * s.singleWidth + 5) {
        el.scrollLeft = s.singleWidth;
      }
    };
    requestAnimationFrame(measure);
    window.addEventListener("resize", measure);

    const tick = (t) => {
      const dt = Math.min((t - s.lastTime) / 1000, 0.1);
      s.lastTime = t;
      if (s.singleWidth > 0) {
        if (!s.mouseOver && !s.dragging && !s.touchActive) {
          el.scrollLeft += SPEED * dt;
        }
        // bucle infinito invisible: mantener scrollLeft dentro de la copia del medio
        if (el.scrollLeft >= 2 * s.singleWidth) {
          el.scrollLeft -= s.singleWidth;
        } else if (el.scrollLeft < s.singleWidth) {
          el.scrollLeft += s.singleWidth;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const onMouseEnter = () => { stateRef.current.mouseOver = true; };
  const onMouseLeave = () => { stateRef.current.mouseOver = false; };

  const onPointerDown = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    const s = stateRef.current;
    if (e.pointerType === "mouse") {
      s.dragging = true;
      s.lastX = e.clientX;
      s.moved = 0;
      try { el.setPointerCapture(e.pointerId); } catch {}
      el.style.cursor = "grabbing";
    } else {
      // táctil / lápiz: pausa auto-scroll, deja al navegador hacer el scroll nativo
      s.touchActive = true;
    }
  };
  const onPointerMove = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    const s = stateRef.current;
    if (s.dragging && e.pointerType === "mouse") {
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.moved += Math.abs(dx);
      el.scrollLeft -= dx;
    }
  };
  const onPointerUp = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    const s = stateRef.current;
    if (e.pointerType === "mouse") {
      s.dragging = false;
      try { el.releasePointerCapture(e.pointerId); } catch {}
      el.style.cursor = "grab";
    } else {
      setTimeout(() => { s.touchActive = false; }, 1500);
    }
  };

  // Evita que terminar un drag abra el enlace de Spotify
  const onCardClick = (e) => {
    if (stateRef.current.moved > 5) e.preventDefault();
  };

  // Flechas: avance/retroceso instantáneo (~2 cards)
  const goLeft = () => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft -= 420;
  };
  const goRight = () => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft += 420;
  };

  return (
    <div className="smx-disco" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <style>{`
        .smx-disco{position:relative;}
        .smx-disco__scroller{
          overflow-x:auto;overflow-y:hidden;
          -webkit-mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);
          mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);
          scrollbar-width:none;cursor:grab;user-select:none;touch-action:pan-x;
        }
        .smx-disco__scroller::-webkit-scrollbar{display:none;}
        .smx-disco__track{display:flex;width:max-content;padding:4px 0;}
        .smx-disco__card{flex:none;width:148px;margin-right:16px;text-decoration:none;}
        .smx-disco__art{
          width:148px;height:148px;border-radius:14px;overflow:hidden;
          border:1px solid ${C.line};background:linear-gradient(150deg,#161413,#000000);
        }
        .smx-disco__art img{
          width:100%;height:100%;object-fit:cover;display:block;
          transition:transform .4s ease;pointer-events:none;
        }
        .smx-disco__card:hover .smx-disco__art img{transform:scale(1.06);}
        .smx-disco__btn{
          position:absolute;top:40%;transform:translateY(-50%);z-index:3;
          width:44px;height:44px;border-radius:50%;border:1px solid ${C.lineHi};
          background:rgba(10,10,11,.72);
          backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
          color:${C.cream};cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:background .2s ease,color .2s ease,border-color .2s ease;
        }
        .smx-disco__btn:hover{background:${C.orange};color:${C.ink};border-color:${C.orange};}
        .smx-disco__btn--left{left:14px;}
        .smx-disco__btn--right{right:14px;}
        @media(max-width:640px){
          .smx-disco__card,.smx-disco__art{width:122px;}
          .smx-disco__art{height:122px;}
          .smx-disco__btn{display:none;}
        }
      `}</style>

      <button className="smx-disco__btn smx-disco__btn--left" aria-label="Anterior" onClick={goLeft}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="smx-disco__btn smx-disco__btn--right" aria-label="Siguiente" onClick={goRight}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div ref={scrollerRef}
           className="smx-disco__scroller"
           onPointerDown={onPointerDown}
           onPointerMove={onPointerMove}
           onPointerUp={onPointerUp}
           onPointerCancel={onPointerUp}>
        <div className="smx-disco__track">
          {loop.map((t, i) => (
            <a key={i} className="smx-disco__card" href={t.url || "#"}
               target="_blank" rel="noopener noreferrer"
               draggable={false} onClick={onCardClick}>
              <div className="smx-disco__art">
                {t.cover && (
                  <img
                    src={t.cover.replace("ab67616d00004851", "ab67616d00001e02")}
                    alt={t.titulo}
                    loading="lazy"
                    draggable={false}
                  />
                )}
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{
                  fontFamily: F.display, fontWeight: 700, fontSize: 13.5, color: C.text,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{t.titulo}</div>
                <div style={{
                  fontFamily: F.mono, fontSize: 11, color: C.muted,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{t.artista}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ABPlayer() {
  const [track, setTrack] = useState(0);
  const [mode, setMode] = useState("master"); // master por defecto
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(0.85);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const demoRef = useRef(null);
  const masterRef = useRef(null);
  const canvasRef = useRef(null);
  const modeRef = useRef("master");
  const playingRef = useRef(false);
  const rafRef = useRef(0);

  modeRef.current = mode;
  playingRef.current = playing;

  // Selección A/B con la propiedad .muted (el volumen=0 lo ignora iOS; .muted sí se respeta).
  // Las dos versiones suenan en paralelo y sincronizadas; solo una está sin silenciar.
  useEffect(() => {
    const d = demoRef.current, m = masterRef.current;
    if (d) { d.muted = !(mode === "ref" && !muted); d.volume = vol; }
    if (m) { m.muted = !(mode === "master" && !muted); m.volume = vol; }
  }, [mode, vol, muted]);

  // cambio de pista: parar, recargar y resetear
  useEffect(() => {
    const d = demoRef.current, m = masterRef.current;
    if (!d || !m) return;
    setTime(0); setDuration(0); setPlaying(false);
    try { d.pause(); m.pause(); } catch {}
    try { d.currentTime = 0; m.currentTime = 0; } catch {}
    try { d.load(); m.load(); } catch {}
  }, [track]);

  const togglePlay = async () => {
    const d = demoRef.current, m = masterRef.current;
    if (!d || !m) return;
    try {
      if (playingRef.current) {
        d.pause(); m.pause();
        setPlaying(false);
      } else {
        // asegurar que ambos están en la misma posición antes de arrancar
        const t = m.currentTime || 0;
        d.currentTime = t;
        await Promise.all([d.play(), m.play()]);
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    const d = demoRef.current, m = masterRef.current;
    if (d && m) {
      // re-sincronizar al cambiar (por si han driftado un pelín)
      const cur = newMode === "master" ? (d.currentTime || 0) : (m.currentTime || 0);
      if (newMode === "master") m.currentTime = cur;
      else d.currentTime = cur;
    }
  };

  const switchTrack = (id) => {
    if (id === track) return;
    setTrack(id);
    setMode("master");
  };

  const onTimeUpdate = (e) => setTime(e.target.currentTime || 0);
  const onLoadedMetadata = (e) => {
    const dur = e.target.duration;
    if (isFinite(dur)) setDuration(dur);
  };
  const onEnded = () => {
    const d = demoRef.current, m = masterRef.current;
    if (d) { d.pause(); d.currentTime = 0; }
    if (m) { m.pause(); m.currentTime = 0; }
    setPlaying(false);
    setTime(0);
  };

  const onSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const t = Math.max(0, Math.min(duration, (x / rect.width) * duration));
    const d = demoRef.current, m = masterRef.current;
    if (d) d.currentTime = t;
    if (m) m.currentTime = t;
    setTime(t);
  };

  // onda decorativa
  useEffect(() => {
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext("2d");
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);
      const tNow = performance.now() / 1000;
      const N = 70;
      const bw = w / N;
      const isMaster = modeRef.current === "master";
      const isPlaying = playingRef.current;
      const accent = isMaster ? C.orange : "#8C7B68";
      for (let i = 0; i < N; i++) {
        const base = isPlaying ? 0.42 : 0.16;
        const wobble = isPlaying
          ? 0.42 * Math.abs(Math.sin(i * 0.32 + tNow * 2.6 + (isMaster ? 0 : 0.7)))
          : 0.06 * Math.abs(Math.sin(i * 0.45));
        const amp = base * (0.5 + 0.5 * Math.sin(i * 0.18 + 1.2)) + wobble;
        const scale = isMaster ? 1.45 : 1.0;
        const bh = amp * scale * (h * 0.42) + 2;
        ctx.fillStyle = accent;
        ctx.globalAlpha = isMaster ? 0.92 : 0.7;
        ctx.fillRect(i * bw + bw * 0.18, h / 2 - bh, bw * 0.64, bh);
        ctx.fillRect(i * bw + bw * 0.18, h / 2, bw * 0.64, bh);
      }
      ctx.globalAlpha = 1;
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // tamaño canvas
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const fit = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const tr = TRACKS[track];
  const fmt = (s) => {
    if (!isFinite(s)) s = 0;
    const mm = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${mm}:${ss.toString().padStart(2, "0")}`;
  };
  const progress = duration ? Math.max(0, Math.min(1, time / duration)) : 0;

  return (
    <div className="smx-glowedge smx-liquid smx-glass" style={{
      borderRadius: 28, padding: "clamp(20px,3vw,34px)",
    }}>
      <audio ref={demoRef} src={tr.demo} preload="auto" />
      <audio
        ref={masterRef}
        src={tr.master}
        preload="auto"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />

      <div className="smx-playergrid" style={{ display: "grid", gap: 26 }}>
        {/* listado de pistas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            fontFamily: F.mono, fontSize: 11, letterSpacing: ".16em",
            color: C.faint, textTransform: "uppercase", marginBottom: 2,
          }}>
            Pistas
          </div>
          {TRACKS.map((t) => {
            const on = track === t.id;
            return (
              <button key={t.id} onClick={() => switchTrack(t.id)} style={{
                textAlign: "left", cursor: "pointer", borderRadius: 14,
                padding: "11px 14px", border: `1px solid ${on ? C.orange : C.line}`,
                background: on ? "rgba(232,96,10,.1)" : "transparent",
                display: "flex", alignItems: "center", gap: 11, transition: "all .2s",
              }}>
                <Disc3 size={18} color={on ? C.orange : C.faint} />
                <div style={{
                  fontFamily: F.display, fontWeight: 600, fontSize: 14.5,
                  color: on ? C.text : C.muted,
                }}>{t.name}</div>
              </button>
            );
          })}
        </div>

        {/* player */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* A/B toggle */}
          <div className="smx-glass--panel" style={{
            position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr",
            borderRadius: 16, padding: 5,
          }}>
            <div style={{
              position: "absolute", top: 5, bottom: 5, width: "calc(50% - 5px)",
              left: mode === "ref" ? 5 : "calc(50%)", borderRadius: 12,
              background: C.orange, transition: "left .45s cubic-bezier(.3,1.3,.35,1)",
            }} />
            {[["ref", "Referencia"], ["master", "Master"]].map(([k, label]) => (
              <button key={k} onClick={() => switchMode(k)} style={{
                position: "relative", zIndex: 1, cursor: "pointer", border: "none",
                background: "transparent", padding: "12px 8px", fontFamily: F.display,
                fontWeight: 700, fontSize: 14.5, letterSpacing: ".02em",
                color: mode === k ? C.ink : C.muted, transition: "color .2s",
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* waveform + progreso */}
          <div className="smx-glass--panel" style={{ borderRadius: 16, padding: "14px 16px" }}>
            <canvas ref={canvasRef} style={{ width: "100%", height: 96, display: "block" }} />
            <div onClick={onSeek} style={{
              marginTop: 10, height: 6, borderRadius: 999, background: C.line,
              cursor: "pointer", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${progress * 100}%`, background: C.orange,
                transition: "width .1s linear",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.muted }}>{fmt(time)}</span>
              <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.faint }}>{fmt(duration)}</span>
            </div>
          </div>

          {/* transport */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={togglePlay} className="smx-play" style={{
              width: 58, height: 58, borderRadius: "50%", flex: "none", cursor: "pointer",
              border: "none", background: C.orange, color: C.ink,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 0 6px rgba(232,96,10,.14)",
            }}>
              {playing ? <Pause size={22} fill={C.ink} /> : <Play size={22} fill={C.ink} style={{ marginLeft: 3 }} />}
            </button>

            <button onClick={() => setMuted((mm) => !mm)} style={{
              background: "transparent", border: "none", cursor: "pointer", color: C.muted,
              display: "flex", alignItems: "center",
            }}>
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range" min={0} max={1} step={0.01} value={vol}
              onChange={(e) => { setVol(parseFloat(e.target.value)); if (muted) setMuted(false); }}
              className="smx-range smx-vol" style={{ width: 110 }}
            />

            <div style={{
              marginLeft: "auto", fontFamily: F.mono, fontSize: 11.5, color: C.faint,
              letterSpacing: ".12em", textTransform: "uppercase",
            }}>
              Sonando: <span style={{ color: mode === "master" ? C.orange : C.text, marginLeft: 6 }}>
                {mode === "master" ? "Master" : "Referencia"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- page ----------------------------- */
export default function SadocmixHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [infoProduct, setInfoProduct] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    import("3dsvg");
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-in"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Parallax con el ratón: publica --mx/--my (-1..1) en el documento. Los glows
  // del fondo y el visual del hero se desplazan suavemente según el cursor.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return; // sin efecto en táctil
    let lx = 0, ly = 0, raf = 0;
    const apply = () => {
      raf = 0;
      const mx = (lx / window.innerWidth - 0.5) * 2;
      const my = (ly / window.innerHeight - 0.5) * 2;
      const r = document.documentElement.style;
      r.setProperty("--mx", mx.toFixed(3));
      r.setProperty("--my", my.toFixed(3));
    };
    const onMove = (e) => { lx = e.clientX; ly = e.clientY; if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // Tilt 3D: las tarjetas de palmarés y tienda se inclinan hacia el cursor.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const els = Array.from(document.querySelectorAll(".smx-disccard, .smx-prodcard"));
    const MAX = 7; // grados de inclinación máxima
    const cleanups = els.map((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = "transform .12s ease-out";
        el.style.transform =
          `perspective(780px) translateY(-6px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg)`;
      };
      const leave = () => { el.style.transition = ""; el.style.transform = ""; };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Liquid glass: un brillo especular sigue al cursor dentro de las tarjetas
  // .smx-liquid (publica --lx/--ly en % y --lo como opacidad del reflejo).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const els = Array.from(document.querySelectorAll(".smx-liquid"));
    const cleanups = els.map((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--lx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        el.style.setProperty("--ly", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
        el.style.setProperty("--lo", "1");
      };
      const leave = () => { el.style.setProperty("--lo", "0"); };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Botones magnéticos: los elementos .smx-magnetic se atraen hacia el cursor.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const els = Array.from(document.querySelectorAll(".smx-magnetic"));
    const STRENGTH = 0.32, MAX = 12;
    const clamp = (v) => Math.max(-MAX, Math.min(MAX, v));
    const cleanups = els.map((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const tx = clamp((e.clientX - (r.left + r.width / 2)) * STRENGTH);
        const ty = clamp((e.clientY - (r.top + r.height / 2)) * STRENGTH);
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      };
      const leave = () => { el.style.transform = ""; };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nav = [
    ["Música", "discografia"], ["Mix & Master", "player"], ["Recursos", "recursos"],
    ["Cursos", "recursos"], ["Servicios", "servicios"],
  ];

  return (
    <div className="smx" style={{
      background: `radial-gradient(130% 80% at 50% -12%, #181009 0%, #0B0705 42%, ${C.bg} 74%) ${C.bg}`,
      color: C.text, fontFamily: F.body, minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,500;125,600;125,700;125,800&family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .smx *{box-sizing:border-box;margin:0;padding:0;}
        .smx{-webkit-font-smoothing:antialiased;overflow-x:hidden;}
        .smx h1,.smx h2,.smx h3{text-wrap:balance;}
        .smx p{text-wrap:pretty;}
        .smx :is(button,a):focus-visible{outline:2px solid ${C.orangeHi};outline-offset:3px;border-radius:6px;}
        /* Franja de specs del hero: datos con separadores finos, lectura "ficha técnica" */
        .smx-specs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;}
        .smx-spec{position:relative;padding:4px 18px 2px 0;display:flex;flex-direction:column;gap:3px;}
        .smx-spec+.smx-spec::before{content:"";position:absolute;left:-1px;top:8%;bottom:8%;width:1px;background:${C.line};}
        .smx-specs .smx-spec:nth-child(odd)::before{display:none;}
        .smx-specs .smx-spec:nth-child(n+3){margin-top:18px;}
        @media(min-width:760px){
          .smx-specs{grid-template-columns:repeat(4,auto);justify-content:start;column-gap:clamp(22px,3vw,40px);}
          .smx-spec{padding:4px 0 2px;}
          .smx-specs .smx-spec:nth-child(odd)::before{display:block;}
          .smx-specs .smx-spec:first-child::before{display:none!important;}
          .smx-specs .smx-spec:nth-child(n+3){margin-top:0;}
          .smx-spec+.smx-spec{padding-left:clamp(22px,3vw,40px);}
          .smx-spec+.smx-spec::before{left:0;}
        }
        [data-reveal]{opacity:0;transform:translateY(26px);filter:blur(6px);transition:opacity .85s cubic-bezier(.2,.7,.2,1),transform .85s cubic-bezier(.2,.7,.2,1),filter .85s cubic-bezier(.2,.7,.2,1);}
        [data-reveal].is-in{opacity:1;transform:translateY(0);filter:blur(0);}
        .smx-disccard{transition:transform .35s ease,border-color .35s ease;}
        .smx-disccard:hover{transform:translateY(-6px);border-color:rgba(232,96,10,.4);}
        .smx-svccard{transition:transform .35s ease,box-shadow .35s ease,border-color .35s ease;}
        .smx-svccard:hover{transform:translateY(-5px);border-color:${C.lineHi};}
        /* Sistema de botones: plano y sólido, editorial. Sin gradiente, vidrio,
           bisel ni glow (esos efectos leen como "IA"). Solo color de marca,
           tipografía limpia y un hover sobrio. .smx-cta = naranja sólido,
           --ghost contorno fino, --ink tinta; .smx-tbtn = pequeño en mono. */
        .smx-cta{font-family:${F.display};font-weight:600;font-size:13px;color:${C.ink};
          background:${C.orange};border:none;border-radius:9px;padding:11px 20px;cursor:pointer;text-decoration:none;
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          transition:background .18s ease,transform .15s ease;}
        .smx-cta:hover{background:${C.orangeHi};}
        .smx-cta:active{transform:translateY(1px);}
        .smx-cta--ghost{background:transparent;color:${C.text};border:1px solid ${C.lineHi};}
        .smx-cta--ghost:hover{background:rgba(255,255,255,.06);border-color:${C.cream2};}
        .smx-cta--ink{background:${C.ink};color:${C.cream};border:none;}
        .smx-cta--ink:hover{background:#1A1512;}
        .smx-tbtn{font-family:${F.mono};font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${C.ink};
          background:${C.orange};border:none;border-radius:5px;padding:8px 13px;cursor:pointer;text-decoration:none;
          display:inline-flex;align-items:center;justify-content:center;gap:6px;
          transition:background .18s ease,transform .15s ease;}
        .smx-tbtn:hover{background:${C.orangeHi};}
        .smx-tbtn:active{transform:translateY(1px);}
        .smx-tbtn--ghost{background:transparent;color:${C.cream2};border:1px solid ${C.lineHi};}
        .smx-tbtn--ghost:hover{background:rgba(255,255,255,.05);color:${C.text};border-color:${C.cream2};}
        .smx-play{transition:transform .2s ease;}
        .smx-play:hover{transform:scale(1.06);}
        .smx-trust{overflow:hidden;-webkit-mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent);}
        .smx-trust__track{display:flex;width:max-content;align-items:center;animation:smxtrust 38s linear infinite;}
        .smx-trust__item{flex:none;margin:0 clamp(22px,3.4vw,44px);width:clamp(54px,6.4vw,74px);height:clamp(54px,6.4vw,74px);display:flex;align-items:center;justify-content:center;opacity:.55;transition:opacity .3s ease;}
        .smx-trust__item:hover{opacity:1;}
        .smx-trust__item img{max-width:none;object-fit:contain;display:block;filter:grayscale(1) brightness(0) invert(1);}
        .smx-trust__item span{font-family:${F.display};font-weight:700;font-size:clamp(17px,2vw,22px);color:${C.text};white-space:nowrap;letter-spacing:.01em;}
        @keyframes smxtrust{to{transform:translateX(-50%);}}
        @media(prefers-reduced-motion:reduce){.smx-trust__track{animation:none!important;}[data-reveal]{filter:none;}}
        .smx-navlink{position:relative;}
        .smx-navlink:hover{color:${C.text}!important;}
        .smx-footlink{transition:color .25s ease;}
        .smx-footlink:hover{color:${C.cream}!important;}
        .smx-navlink::after{content:'';position:absolute;left:0;bottom:-4px;width:0;height:1.5px;background:${C.orange};transition:width .25s;}
        .smx-navlink:hover::after{width:100%;}
        .smx-range{-webkit-appearance:none;height:5px;border-radius:999px;background:${C.line};outline:none;}
        .smx-range::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${C.orange};cursor:pointer;}
        .smx-range::-moz-range-thumb{width:14px;height:14px;border:none;border-radius:50%;background:${C.orange};cursor:pointer;}
        @media(max-width:600px){.smx-vol{display:none;}}
        .smx-grain{position:fixed;inset:0;pointer-events:none;z-index:100;opacity:.05;mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
        @keyframes smxglow{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5;}50%{transform:translate(-50%,-50%) scale(1.15);opacity:.75;}}
        .smx-glows{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;transition:transform .6s cubic-bezier(.2,.7,.2,1);transform:translate3d(calc(var(--mx,0)*22px),calc(var(--my,0)*22px),0);}
        .smx-parallax{transition:transform .5s cubic-bezier(.2,.7,.2,1);transform:translate3d(calc(var(--mx,0)*-18px),calc(var(--my,0)*-16px),0);will-change:transform;}
        .smx-herocopy{position:relative;isolation:isolate;}
        .smx-herocopy::before{content:"";position:absolute;z-index:-1;top:-14%;left:-9%;width:72%;height:132%;pointer-events:none;
          background:radial-gradient(45% 55% at 35% 35%,rgba(232,96,10,.16),transparent 70%),radial-gradient(46% 46% at 66% 62%,rgba(255,126,43,.10),transparent 72%);
          background-size:200% 200%;filter:blur(36px);animation:smxaurora 18s ease-in-out infinite;}
        @keyframes smxaurora{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
        @media(prefers-reduced-motion:reduce){.smx-glows,.smx-parallax{transform:none!important;}.smx-herocopy::before{animation:none;}}
        .smx-glow{position:absolute;border-radius:50%;filter:blur(48px);will-change:transform;}
        .smx-glow--a{width:48vw;height:48vw;left:-10vw;top:-12vw;
          background:radial-gradient(circle,rgba(235,71,39,.20),transparent 68%);
          animation:smxdriftA 30s ease-in-out infinite;}
        .smx-glow--b{width:42vw;height:42vw;right:-12vw;top:30vh;
          background:radial-gradient(circle,rgba(235,71,39,.13),transparent 70%);
          animation:smxdriftB 38s ease-in-out infinite;}
        .smx-glow--c{width:56vw;height:56vw;left:14vw;bottom:-22vw;
          background:radial-gradient(circle,rgba(150,34,18,.16),transparent 72%);
          animation:smxdriftC 46s ease-in-out infinite;}
        @keyframes smxdriftA{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(9vw,7vh) scale(1.14);}}
        @keyframes smxdriftB{0%,100%{transform:translate(0,0) scale(1.06);}50%{transform:translate(-7vw,-5vh) scale(.92);}}
        @keyframes smxdriftC{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(-6vw,-9vh) scale(1.18);}}
        .smx-vignette{position:fixed;inset:0;z-index:90;pointer-events:none;
          background:radial-gradient(ellipse at 50% 42%,transparent 56%,rgba(0,0,0,.48) 100%);}
        /* --- Liquid glass --- */
        /* Brillo especular que sigue al cursor dentro de tarjetas (.smx-liquid).
           Las coordenadas --lx/--ly las publica un efecto JS; mix-blend screen
           hace que se lea como luz sobre cualquier fondo (oscuro o lacado). */
        .smx-liquid{position:relative;}
        .smx-liquid::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;
          background:radial-gradient(190px circle at var(--lx,50%) var(--ly,50%),rgba(255,255,255,.05),rgba(255,255,255,0) 62%);
          opacity:var(--lo,0);transition:opacity .45s ease;mix-blend-mode:screen;}
        /* Material liquid glass para bloques: panel translúcido que desenfoca lo
           que tiene detrás (glows, puntos 3D), con highlight superior tipo vidrio
           y sombra interior abajo. --heavy para capas flotantes (modal, toast);
           --panel para superficies internas sin blur anidado (más barato). */
        .smx-glass{
          background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.012) 40%,rgba(255,255,255,.028)),rgba(13,11,9,.52);
          -webkit-backdrop-filter:blur(14px) saturate(150%);backdrop-filter:blur(14px) saturate(150%);
          border:1px solid rgba(255,255,255,.13);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.12),inset 0 -1px 0 rgba(0,0,0,.28),0 26px 54px -24px rgba(0,0,0,.62);}
        .smx-glass--heavy{
          background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.014) 42%),rgba(15,12,10,.78);
          -webkit-backdrop-filter:blur(26px) saturate(160%);backdrop-filter:blur(26px) saturate(160%);
          border:1px solid rgba(255,255,255,.16);}
        .smx-glass--panel{
          background:rgba(8,6,5,.45);border:1px solid rgba(255,255,255,.09);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.07);}
        /* Lámina de luz que deriva lenta sobre el cristal de la nav. */
        .smx-navglass::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
          background:linear-gradient(115deg,transparent 24%,rgba(255,255,255,.075) 40%,rgba(255,255,255,.02) 52%,transparent 66%);
          background-size:230% 100%;
          animation:smxsheen 11s ease-in-out infinite alternate;}
        @keyframes smxsheen{from{background-position:130% 0;}to{background-position:-30% 0;}}
        .smx-float{animation:smxfloat 5.5s ease-in-out infinite alternate;}
        @keyframes smxfloat{from{transform:translateY(0);}to{transform:translateY(-8px);}}
        .smx-livedot{animation:smxlive 2.4s ease-in-out infinite;}
        @keyframes smxlive{0%,100%{box-shadow:0 0 0 0 rgba(232,96,10,.55);}55%{box-shadow:0 0 0 6px rgba(232,96,10,0);}}
        @media(prefers-reduced-motion:reduce){.smx-livedot{animation:none;}}
        /* Ambiente reutilizable por sección: textura urbana (semitono + franjas)
           y foco cálido animado que late desde arriba. Va detrás del contenido
           con pseudo-elementos, sin tocar el JSX interno de cada sección. */
        .smx-fx{position:relative;isolation:isolate;overflow:hidden;}
        .smx-fx::before{content:"";position:absolute;inset:0;z-index:-2;pointer-events:none;opacity:.5;
          background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1.6px),
            repeating-linear-gradient(135deg,rgba(232,96,10,.035) 0 2px,transparent 2px 11px);
          background-size:6px 6px,auto;
          -webkit-mask-image:radial-gradient(ellipse 82% 78% at 50% 44%,#000 28%,transparent 84%);
          mask-image:radial-gradient(ellipse 82% 78% at 50% 44%,#000 28%,transparent 84%);}
        .smx-fx::after{content:"";position:absolute;left:50%;top:-16%;width:140%;height:94%;transform:translateX(-50%);
          z-index:-1;pointer-events:none;
          background:radial-gradient(50% 60% at 50% 0%,rgba(232,96,10,.20),transparent 70%);
          animation:smxspot 11s ease-in-out infinite;}
        .smx-fx:nth-of-type(even)::after{animation-delay:-5.5s;}
        .smx-fx:nth-of-type(3n)::after{animation-duration:13s;}
        @keyframes smxspot{0%,100%{opacity:.42;transform:translateX(-50%) scale(1);}50%{opacity:.68;transform:translateX(-50%) scale(1.06);}}
        .smx-playerwrap{position:relative;}
        /* Borde iluminado animado: un punto de luz naranja recorre el borde de
           la tarjeta. Funciona en cualquier contenedor (no necesita fondo). */
        @property --smxang{syntax:"<angle>";initial-value:0deg;inherits:false;}
        .smx-glowedge{position:relative;}
        .smx-glowedge::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:2px;
          background:conic-gradient(from var(--smxang),transparent 0deg,rgba(255,120,40,1) 48deg,rgba(232,96,10,.35) 96deg,transparent 150deg,transparent 222deg,rgba(255,120,40,.85) 300deg,rgba(232,96,10,.3) 336deg,transparent 360deg);
          -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
          -webkit-mask-composite:xor;mask-composite:exclude;
          filter:drop-shadow(0 0 6px rgba(232,96,10,.6));
          pointer-events:none;animation:smxedge 5.5s linear infinite;}
        .smx-glowedge:nth-of-type(even)::after{animation-direction:reverse;animation-duration:7s;}
        /* variante suave: misma animación pero mucho menos intensa (todo menos el player) */
        .smx-glowedge--soft::after{opacity:.38;padding:1.3px;filter:none;}
        @keyframes smxedge{to{--smxang:360deg;}}
        @media(prefers-reduced-motion:reduce){.smx-glow,.smx-float,.smx-fx::after,.smx-glowedge::after,.smx-navglass::before{animation:none!important;}}
        .smx-playergrid{grid-template-columns:1fr;}
        @media(min-width:860px){.smx-playergrid{grid-template-columns:230px 1fr;}}
      `}</style>
      <div className="smx-grain" />
      <StudioGlows />
      {/* superficie de puntos 3D: sustituye a la retícula CSS como textura técnica */}
      <DottedSurface aria-hidden="true" style={{ zIndex: 0, opacity: 0.6 }} />
      <div className="smx-vignette" aria-hidden="true" />
      <div className="smx-content" style={{ position: "relative", zIndex: 1 }}>

      {/* ---------------- NAV ---------------- */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, padding: "16px clamp(14px,3vw,28px) 0" }}>
        <nav className="smx-navglass" style={{
          maxWidth: 1240, margin: "0 auto", position: "relative", background: "rgba(9,7,5,.58)", borderRadius: 999,
          padding: "12px 14px 12px 24px", display: "flex", alignItems: "center", gap: 18,
          border: `1px solid ${C.line}`,
          backdropFilter: "blur(20px) saturate(150%)", WebkitBackdropFilter: "blur(20px) saturate(150%)",
          boxShadow: "0 18px 50px -20px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.06)",
        }}>
          <div onClick={() => go("top")} style={{ display: "flex", alignItems: "center", cursor: "pointer", marginRight: "auto" }}>
            <img src={LOGO_WHITE} alt="Sadoc Mixing & Mastering" style={{ height: 34, width: "auto", display: "block" }} />
          </div>
          <div className="smx-navdesktop" style={{ display: "none", gap: 28, alignItems: "center" }}>
            {nav.map(([label, id]) => (
              <span key={label} className="smx-navlink" onClick={() => go(id)} style={{
                fontFamily: F.body, fontWeight: 500, fontSize: 13.5, letterSpacing: ".02em",
                color: C.cream2, cursor: "pointer", transition: "color .25s ease",
              }}>{label}</span>
            ))}
          </div>
          <ShoppingBag size={19} color={C.cream2} style={{ cursor: "pointer" }} />
          <button className="smx-cta" style={{ fontSize: 12.5, padding: "9px 16px" }}>Entrar</button>
          <button onClick={() => setMenuOpen((o) => !o)} className="smx-navmobile" style={{
            display: "flex", background: "transparent", border: "none", cursor: "pointer", color: C.text,
          }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="smx-glass--heavy" style={{
            maxWidth: 1240, margin: "10px auto 0", borderRadius: 20,
            padding: "10px", display: "flex", flexDirection: "column",
          }}>
            {nav.map(([label, id]) => (
              <span key={label} onClick={() => go(id)} style={{
                fontFamily: F.body, fontWeight: 600, fontSize: 15, color: C.text,
                padding: "12px 14px", cursor: "pointer", borderRadius: 12,
              }}>{label}</span>
            ))}
          </div>
        )}
      </header>
      <style>{`@media(min-width:880px){.smx-navdesktop{display:flex!important;}.smx-navmobile{display:none!important;}}`}</style>

      {/* ---------------- HERO ---------------- */}
      <section id="top" style={{ position: "relative", padding: "clamp(48px,7vw,96px) clamp(16px,3vw,28px)" }}>
        <div style={{
          position: "absolute", top: "42%", left: "62%", width: 620, height: 620,
          background: "radial-gradient(circle, rgba(235,71,39,.26), transparent 65%)",
          filter: "blur(20px)",
          animation: "smxglow 9s ease-in-out infinite", pointerEvents: "none",
        }} />
        <div style={{
          maxWidth: 1240, margin: "0 auto", position: "relative",
          display: "grid", gap: "clamp(32px,5vw,60px)", alignItems: "center",
          gridTemplateColumns: "1fr",
        }} className="smx-herogrid">
          <div className="smx-herocopy">
            <Reveal delay={40}>
              <h1 style={{
                fontFamily: F.display, fontWeight: 800, lineHeight: 1.05,
                fontSize: "clamp(36px,5.4vw,64px)", letterSpacing: "-.02em",
                color: C.text,
              }}>
                Que tu canción suene como la imaginaste...{" "}
                <span style={{
                  background: C.orange, color: C.ink, padding: "0 .12em",
                  borderRadius: 6, display: "inline-block", transform: "rotate(-1.5deg)",
                }}>y quizá mejor.</span>
              </h1>
            </Reveal>
            <Reveal delay={180} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
              <button onClick={() => go("player")} className="smx-cta smx-magnetic">
                <Play size={17} fill="currentColor" /> Escuchar el A/B
              </button>
              <button onClick={() => go("servicios")} className="smx-cta smx-cta--ghost smx-magnetic">
                Ver servicios <ArrowRight size={17} />
              </button>
            </Reveal>
            <Reveal delay={300} style={{ marginTop: 38, paddingTop: 26, borderTop: `1px solid ${C.line}` }}>
              <div className="smx-specs">
                {[
                  ["+1B", "Streams"],
                  ["6×", "Discos de Platino"],
                  ["5×", "Discos de Oro"],
                  ["Top 1%", "Mastering global"],
                ].map(([n, l]) => (
                  <div key={l} className="smx-spec">
                    <span style={{
                      fontFamily: F.display, fontWeight: 700, fontSize: "clamp(19px,2vw,23px)",
                      color: C.text, letterSpacing: "-.01em", lineHeight: 1,
                    }}>{n}</span>
                    <span style={{
                      fontFamily: F.mono, fontSize: 11, letterSpacing: ".14em",
                      textTransform: "uppercase", color: C.muted,
                    }}>{l}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* hero visual */}
          <Reveal delay={200} style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <HeroLogo3D />
              <div className="smx-float" style={{
                position: "absolute", top: 30, right: -1, background: C.cream, color: C.ink,
                fontFamily: F.display, fontWeight: 700, fontSize: 13, padding: "10px 16px",
                borderRadius: 10,
                boxShadow: "0 14px 30px -10px rgba(0,0,0,.6)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span aria-hidden="true" style={{
                  width: 13, height: 13, borderRadius: "50%", flex: "none", background: PLAT,
                  boxShadow: "inset 0 0 0 .5px rgba(255,255,255,.5), 0 1px 3px rgba(0,0,0,.35)",
                }} /> 6× Platino
              </div>
              <div onClick={() => go("player")} className="smx-float smx-glass" style={{
                position: "absolute", bottom: 6, left: -26, color: C.text,
                fontFamily: F.mono, fontSize: 12, padding: "11px 16px", borderRadius: 10,
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                animationDuration: "7s", animationDelay: "1.2s",
              }}>
                <span className="smx-livedot" style={{ width: 7, height: 7, borderRadius: "50%", background: C.orange }} /> A/B demo en vivo
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <style>{`@media(min-width:900px){.smx-herogrid{grid-template-columns:1.05fr .95fr!important;}}`}</style>

      {/* ---------------- TRUSTED BY ---------------- */}
      <TrustedBy items={TRUSTED} />

      {/* ---------------- PALMARÉS ---------------- */}
      <section id="logros" className="smx-fx" style={{ padding: "clamp(60px,8vw,110px) clamp(16px,3vw,28px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal><Kicker>ACHIEVEMENTS</Kicker></Reveal>
          <Reveal delay={60} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            flexWrap: "wrap", gap: 18, marginTop: 14,
          }}>
            <h2 style={{
              fontFamily: F.display, fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)",
              letterSpacing: "-.02em", lineHeight: 1.04, color: C.text,
            }}>
              Discos<br />certificados.
            </h2>
          </Reveal>

          {/* stats */}
          <Reveal delay={120} style={{
            display: "grid", gridTemplateColumns: "1fr", gap: 1,
            marginTop: 42, background: C.line,
            borderRadius: 22, overflow: "hidden",
          }} className="smx-stats smx-glass">
            {[["11", "Certificaciones"], ["1.2B+", "Streams"], ["230+", "Artistas"]].map(([n, l]) => (
              <div key={l} style={{ background: "rgba(10,8,6,.55)", padding: "26px 24px" }}>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: "clamp(30px,3.5vw,46px)", color: C.orange }}>
                  <CountUp value={n} />
                </div>
                <div style={{ fontFamily: F.mono, fontSize: 12, color: C.muted, letterSpacing: ".06em", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </Reveal>
          <style>{`@media(min-width:680px){.smx-stats{grid-template-columns:repeat(3,1fr)!important;}}`}</style>

          {/* disc wall */}
          <div className="smx-discwall" style={{
            display: "grid", gap: 18, marginTop: 26, gridTemplateColumns: "1fr",
          }}>
            {[
              { tier: "platino", mult: 4, title: "Morena", artist: "Beéle", streams: "400M", cover: "/img/discos/morena.jpg" },
              { tier: "platino", mult: 1, title: "Ojos Azules", artist: "Blessd, Peso Pluma & SOG", streams: "100M", cover: "/img/discos/Ojos-azules.jpg" },
              { tier: "oro", mult: 3, title: "Viajeros", artist: "Dálmata & ELYSANIJ", streams: "30M", cover: "/img/discos/Viajeros.jpg" },
              { tier: "oro", mult: 1, title: "Enamorao", artist: "Gabriele", streams: "10M", cover: "/img/discos/Enamorao-oro.jpg" },
            ].map((d, i) => (
              <DiscCard key={d.title} {...d} delay={i * 70} />
            ))}
          </div>
          <style>{`
            @media(min-width:680px){.smx-discwall{grid-template-columns:repeat(2,1fr)!important;}}
            @media(min-width:1080px){.smx-discwall{grid-template-columns:repeat(4,1fr)!important;}}
          `}</style>
        </div>
      </section>

      {/* ---------------- A/B PLAYER ---------------- */}
      <section id="player" className="smx-player-sec smx-fx" style={{
        padding: "clamp(48px,6vw,90px) clamp(16px,3vw,28px)", background: C.bg2,
        borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal style={{ display: "flex", justifyContent: "center" }}>
            <Wordmark src="/img/ab-player.png" alt="A/B Player" textH={32} opacity={0.85} />
          </Reveal>
          <Reveal delay={60}>
            <h2 style={{
              fontFamily: F.display, fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)",
              letterSpacing: "-.02em", color: C.text, textAlign: "center", marginTop: 14,
            }}>
              Escucha la diferencia.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p style={{
              fontFamily: F.body, fontSize: 15.5, color: C.muted, textAlign: "center",
              maxWidth: 520, margin: "14px auto 36px", lineHeight: 1.6,
            }}>
              Cambia entre la <strong style={{ color: C.text }}>Referencia</strong> y el{" "}
              <strong style={{ color: C.orange }}>Master</strong> sin perder el punto de reproducción.
              Las dos versiones suenan en paralelo, perfectamente sincronizadas.
            </p>
          </Reveal>
          <Reveal delay={160}><div className="smx-playerwrap"><ABPlayer /></div></Reveal>
        </div>
      </section>

      {/* ---------------- DISCOGRAFÍA ---------------- */}
      <section id="discografia" className="smx-fx" style={{ padding: "clamp(60px,8vw,110px) 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(16px,3vw,28px)" }}>
          <Reveal><Kicker>Discografía</Kicker></Reveal>
          <Reveal delay={60} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            flexWrap: "wrap", gap: 14, marginTop: 14, marginBottom: 36,
          }}>
            <h2 style={{
              fontFamily: F.display, fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)",
              letterSpacing: "-.02em", color: C.text,
            }}>Canciones que han pasado por mis manos.</h2>
            <a href="https://open.spotify.com/playlist/0fV3niuqPcctoORtFnut27" target="_blank" rel="noreferrer" style={{
              fontFamily: F.mono, fontSize: 13, color: C.orange, cursor: "pointer", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
            }}>Ver la playlist completa <ArrowUpRight size={15} /></a>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <CarruselDiscografia items={DISCOGRAFIA.slice(0, 20)} />
        </Reveal>
      </section>

      {/* ---------------- PRODUCTS ---------------- */}
            {/* ---------------- TIENDA / PRODUCTOS ---------------- */}
      <section id="recursos" className="smx-fx" style={{ padding: "clamp(60px,8vw,100px) clamp(16px,3vw,28px)", background: C.bg2, borderTop: `1px solid ${C.line}` }}>
        <style>{`
          .smx-prodgrid{display:grid;gap:18px;grid-template-columns:1fr;}
          @media(min-width:560px){.smx-prodgrid{grid-template-columns:1fr 1fr;}}
          @media(min-width:1000px){.smx-prodgrid{grid-template-columns:repeat(4,1fr);}}
          .smx-prodcard{transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease;}
          .smx-prodcard:hover{transform:translateY(-6px);border-color:rgba(232,96,10,.45);box-shadow:0 22px 44px -16px rgba(0,0,0,.6);}
          .smx-prodimg__art{transition:transform .55s cubic-bezier(.2,.7,.2,1);}
          .smx-prodcard:hover .smx-prodimg__art{transform:scale(1.12);}
          .smx-prodadd{transition:transform .34s cubic-bezier(.2,.7,.2,1),opacity .34s ease;}
          @media(hover:hover){
            .smx-prodadd{transform:translateY(150%);opacity:0;}
            .smx-prodcard:hover .smx-prodadd{transform:translateY(0);opacity:1;}
          }
          .smx-prodtitle{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        `}</style>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(232,96,10,.08)", color: C.orange,
            border: "1px solid rgba(232,96,10,.36)",
            fontFamily: F.mono, fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase",
            padding: "7px 14px", borderRadius: 4,
          }}>
            <IsotipoMark size={12} color={C.orange} /> Tienda
          </Reveal>
          <Reveal delay={60} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            flexWrap: "wrap", gap: 14, marginTop: 16, marginBottom: 36,
          }}>
            <h2 style={{
              fontFamily: F.display, fontWeight: 800, fontSize: "clamp(30px,4.2vw,52px)",
              letterSpacing: "-.02em", color: C.text, lineHeight: 1.05,
            }}>
              Plantillas, Vocal Chains<br />& Cursos.
            </h2>
            <span style={{
              fontFamily: F.mono, fontSize: 13, color: C.orange, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>Ver catálogo completo <ArrowRight size={15} /></span>
          </Reveal>
          <div className="smx-prodgrid">
            {PRODUCTOS.map((p, i) => (
              <ProductCard
                key={p.slug}
                slug={p.slug}
                badge={p.badge}
                title={p.title}
                price={p.price}
                cover={p.cover}
                delay={i * 50}
                onBuy={() => { window.location.href = `/recursos/${p.slug}`; }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section id="servicios" className="smx-fx" style={{ padding: "clamp(60px,8vw,110px) clamp(16px,3vw,28px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center" }}><Kicker>Servicios</Kicker></Reveal>
          <Reveal delay={60}>
            <h2 style={{
              fontFamily: F.display, fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)",
              letterSpacing: "-.02em", color: C.text, textAlign: "center", marginTop: 12, marginBottom: 40,
            }}>Trabajemos juntos.</h2>
          </Reveal>
          <div style={{
            display: "grid", gap: 18,
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          }}>
            <ServiceCard
              title="Mezcla & Mastering" price="desde 300€" per="/ tema"
              bullets={[
                "Incluye nuestra suma secreta",
                "Añade profundidad y dimensión",
                "Optimiza el rango dinámico",
                "Mejora el espaciado",
              ]}
              link={PAYMENT_LINKS.mezclaMastering}
              delay={0}
            />
            <ServiceCard
              title="Stem Mastering" price="105€" per="/ tema" featured badge="Best Deal"
              bullets={[
                "Hasta 8 grupos",
                "Control afinado por sección",
                "Misma cadena de mastering",
              ]}
              link={PAYMENT_LINKS.stemMastering}
              delay={80}
            />
            <ServiceCard
              title="Clases personalizadas" price="desde XX€" per="/ hora"
              bullets={[
                "Mezcla, master o producción",
                "A tu ritmo y tus referencias",
                "Online o presencial en Madrid",
              ]}
              link={PAYMENT_LINKS.clases}
              delay={160}
            />
          </div>
        </div>
      </section>

      {/* ---------------- CTA BAND ---------------- */}
      <section style={{ padding: "0 clamp(16px,3vw,28px) clamp(60px,8vw,100px)" }}>
        <Reveal style={{
          maxWidth: 1240, margin: "0 auto", background: C.orange, borderRadius: 28,
          padding: "clamp(40px,6vw,72px)", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          {/* isotipo como marca de agua, fundido en el lacado */}
          <div aria-hidden="true" style={{
            position: "absolute", right: "-4%", top: "50%", transform: "translateY(-50%) rotate(-8deg)",
            opacity: 0.14, pointerEvents: "none", mixBlendMode: "soft-light",
          }}>
            <IsotipoMark size={380} color={C.ink} />
          </div>
          <h2 style={{
            fontFamily: F.display, fontWeight: 800, fontSize: "clamp(28px,4vw,48px)",
            letterSpacing: "-.02em", color: C.ink, lineHeight: 1.08, position: "relative",
          }}>
            ¿Tienes una canción lista<br />para sonar de verdad?
          </h2>
          <button onClick={() => go("servicios")} className="smx-cta smx-cta--ink smx-magnetic" style={{
            marginTop: 28, fontWeight: 700, fontSize: 13.5, padding: "12px 24px", position: "relative",
          }}>
            Cuéntame el proyecto <ArrowRight size={18} />
          </button>
        </Reveal>
      </section>

      {/* ---------------- RELEASES ---------------- */}
      <section id="musica" className="smx-fx" style={{ padding: "clamp(60px,8vw,110px) clamp(16px,3vw,28px)", background: C.bg2, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal><Kicker>Catálogo</Kicker></Reveal>
          <Reveal delay={60} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            flexWrap: "wrap", gap: 14, marginTop: 14, marginBottom: 32,
          }}>
            <h2 style={{
              fontFamily: F.display, fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)",
              letterSpacing: "-.02em", color: C.text,
            }}>Lo que va saliendo.</h2>
            <a href="https://open.spotify.com/playlist/0fV3niuqPcctoORtFnut27" target="_blank" rel="noreferrer" style={{
              fontFamily: F.mono, fontSize: 13, color: C.orange, cursor: "pointer", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
            }}>Abrir en Spotify <ArrowUpRight size={15} /></a>
          </Reveal>
          <Reveal delay={120} className="smx-glowedge smx-glowedge--soft smx-glass" style={{
            borderRadius: 18, overflow: "hidden",
          }}>
            <iframe
              title="Playlist de Spotify"
              src="https://open.spotify.com/embed/playlist/0fV3niuqPcctoORtFnut27?utm_source=generator&theme=0"
              width="100%" height="480" frameBorder="0" loading="lazy"
              style={{ display: "block" }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{
        position: "relative", overflow: "hidden",
        borderTop: `1px solid ${C.line}`,
        background: "linear-gradient(180deg, rgba(255,255,255,.014), rgba(255,255,255,0) 30%)",
        padding: "clamp(48px,7vw,84px) clamp(16px,3vw,28px) 40px",
      }}>
        {/* isotipo fantasma de cierre, apenas perceptible */}
        <div aria-hidden="true" style={{
          position: "absolute", right: "-6%", bottom: "-18%", opacity: 0.05,
          pointerEvents: "none", transform: "rotate(-6deg)",
        }}>
          <IsotipoMark size={460} color={C.cream} />
        </div>
        <div style={{
          maxWidth: 1240, margin: "0 auto", display: "grid", gap: 36,
          gridTemplateColumns: "1fr", alignItems: "start", position: "relative",
        }} className="smx-footgrid">
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={LOGO_WHITE} alt="Sadoc Mixing & Mastering" style={{ height: 40, width: "auto", display: "block" }} />
            </div>
            <p style={{ fontFamily: F.body, fontSize: 14, color: C.muted, marginTop: 16, maxWidth: 280, lineHeight: 1.65 }}>
              Mezcla, mastering y estrategia musical. Hecho en Madrid.
            </p>
          </div>
          {[
            ["Música", ["Discografía", "A/B Player", "Catálogo"]],
            ["Recursos", ["Plantillas", "Vocal Chains", "Cursos"]],
            ["Servicios", ["Mezcla & Master", "Asesorías", "Clases"]],
            ["Contacto", ["Instagram", "Email", "WhatsApp"]],
          ].map(([h, items]) => (
            <div key={h}>
              <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: ".18em", color: C.faint, textTransform: "uppercase" }}>{h}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {items.map((it) => (
                  <span key={it} className="smx-footlink" style={{ fontFamily: F.body, fontSize: 14, color: C.muted, cursor: "pointer" }}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          maxWidth: 1240, margin: "48px auto 0", paddingTop: 24, borderTop: `1px solid ${C.line}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 10, position: "relative",
        }}>
          <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.faint }}>© 2026 Sadoc Mixing & Mastering</span>
          <span style={{
            fontFamily: F.mono, fontSize: 11.5, color: C.faint,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            Hecho en Madrid <IsotipoMark size={12} color={C.faint} />
          </span>
        </div>
      </footer>
      <style>{`@media(min-width:820px){.smx-footgrid{grid-template-columns:1.4fr 1fr 1fr 1fr 1fr!important;}}
@keyframes smxtoast{from{opacity:0;transform:translate(-50%,-50%) scale(.92);}to{opacity:1;transform:translate(-50%,-50%) scale(1);}}`}</style>
      </div>

      <ProductModal
        product={infoProduct}
        onClose={() => setInfoProduct(null)}
        onBuy={() => { setInfoProduct(null); showToast("Próximamente disponible"); }}
      />
      {toast && (
        <div className="smx-glass--heavy" style={{
          position: "fixed", left: "50%", top: "50%", zIndex: 300,
          transform: "translate(-50%,-50%)", color: C.text,
          fontFamily: F.mono, fontSize: 16, padding: "20px 32px", borderRadius: 14,
          boxShadow: "0 24px 60px -12px rgba(0,0,0,.7)",
          display: "flex", alignItems: "center", gap: 12,
          animation: "smxtoast .35s cubic-bezier(.2,.7,.2,1)",
        }}>
          <Sparkles size={19} color={C.orange} /> {toast}
        </div>
      )}
    </div>
  );
}
