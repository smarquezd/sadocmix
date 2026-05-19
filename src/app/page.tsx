// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, Volume2, VolumeX, Check, ArrowRight, ArrowUpRight,
  ShoppingBag, Menu, X, Disc3, Plus, Headphones, Sparkles, Info,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/next"
import Link from "next/link";
import { PRODUCTOS } from "../data/productos";

/* ----------------------- logo 3D (paquete "3dsvg") ----------------------- */
/*  <SVG3D> extruye un SVG a 3D en el navegador (usa WebGL). En Next.js debe */
/*  cargarse con next/dynamic y ssr:false. Usamos SOLO el isotipo (3 aspas): */
/*  el logo completo con el texto pequeño genera una malla enorme y pesada.  */
const SVG3D = dynamic(() => import("3dsvg").then((m) => ({ default: m.SVG3D })), {
  ssr: false,
});

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

/* Logo 3D del hero: gira sobre su propio eje Y según el scroll de la página.
   Al bajar gira hacia un lado y al subir vuelve girando a su punto inicial.
   Le pasamos `rotationY` al motor 3D (en radianes); el componente lo suaviza
   solo. No tocamos el contenedor con CSS, así el lienzo no se reescala. */
function HeroLogo3D() {
  const [rotationY, setRotationY] = useState(0);

  useEffect(() => {
    // SPIN = giro total en radianes al recorrer toda la página.
    // Math.PI * 2 = una vuelta completa. Para un giro más leve: Math.PI (media
    // vuelta) o Math.PI / 3 (giro ligero). Cámbialo a tu gusto.
    const SPIN = - Math.PI * 7;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      setRotationY(progress * SPIN);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{ width: "min(400px, 82vw)", height: "min(400px, 82vw)" }}>
      <SVG3D
        svg={ISOTIPO_3D_SVG}
        depth={0.9}
        smoothness={0.4}
        color="#ffffff"
        material="emissive"
        metalness={0.9}
        roughness={0.2}
        animate="none"
        interactive={false}
        cursorOrbit={false}
        rotationY={rotationY}
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
  bg: "#17120E",
  bg2: "#1E1813",
  card: "#221B15",
  cardHi: "#2A211A",
  cream: "#F2E9DB",
  cream2: "#E7DAC4",
  ink: "#16110C",
  text: "#F4ECE0",
  muted: "#A89B89",
  faint: "#6E6357",
  orange: "#E8600A",
  orangeHi: "#FF7E2B",
  line: "rgba(244,236,224,0.12)",
  lineHi: "rgba(244,236,224,0.22)",
};
const F = {
  display: "'Bricolage Grotesque', sans-serif",
  body: "'Hanken Grotesk', sans-serif",
  mono: "'DM Mono', monospace",
};
const GOLD = "radial-gradient(circle at 34% 28%, #FDEBB0 0%, #ECC152 34%, #B6841F 70%, #6F4D12 100%)";
const PLAT = "radial-gradient(circle at 34% 28%, #FCFCFB 0%, #DADDE2 36%, #A1A7B0 70%, #5C616B 100%)";
const LOGO_DARK = "/img/logo-dark.png";
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

function Disc({ tier, size = 150, spin = false }) {
  return (
    <div
      className={spin ? "smx-spin" : "smx-disc"}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: tier === "platino" ? PLAT : GOLD,
        boxShadow:
          "0 24px 46px -14px rgba(0,0,0,.65), inset 0 0 0 1px rgba(255,255,255,.28), inset 0 0 70px rgba(0,0,0,.4)",
        position: "relative", flex: "none",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        backgroundImage:
          "repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0 5px, rgba(0,0,0,.10) 5px 6px)",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: "36%", height: "36%",
        transform: "translate(-50%,-50%)", borderRadius: "50%",
        background: tier === "platino" ? C.ink : C.orange,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: "16%", height: "16%", borderRadius: "50%", background: C.bg }} />
      </div>
    </div>
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
    <Reveal delay={delay} className="smx-disccard" style={{
      background: C.card, border: `1px solid ${C.line}`, borderRadius: 22,
      padding: 16, display: "flex", flexDirection: "column",
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
          letterSpacing: ".14em", textTransform: "uppercase", padding: "5px 10px",
          borderRadius: 999, color: tierStyle.color, background: "rgba(15,11,8,.55)",
          border: `1px solid ${tierStyle.border}`, backdropFilter: "blur(8px)",
        }}>
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
  const [infoHover, setInfoHover] = useState(false);
  return (
    <Reveal delay={delay} className="smx-prodcard" style={{
      background: C.card, borderRadius: 18, overflow: "hidden",
      display: "flex", flexDirection: "column", height: "100%",
    }}>
      <div style={{
        position: "relative", aspectRatio: "1 / 1", overflow: "hidden",
        background: "linear-gradient(150deg,#2A211A,#17120E)",
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
          padding: "5px 9px", borderRadius: 999,
          background: free ? C.orange : C.cream, color: C.ink,
        }}>{badge}</span>
        <div className="smx-prodadd" style={{ position: "absolute", left: 11, right: 11, bottom: 11, zIndex: 2 }}>
          <button onClick={onBuy} style={{
            width: "100%", border: "none", cursor: "pointer",
            fontFamily: F.display, fontWeight: 600, fontSize: 14,
            background: C.orange, color: C.ink, padding: "11px 14px", borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            boxShadow: "0 8px 20px -6px rgba(0,0,0,.5)",
          }}>
            <Plus size={15} /> {free ? "Descargar" : "Comprar ahora"}
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
          <Link
            href={`/recursos/${slug}`}
            onMouseEnter={() => setInfoHover(true)}
            onMouseLeave={() => setInfoHover(false)}
            style={{
              display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
              fontFamily: F.mono, fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase",
              color: infoHover ? C.ink : C.cream2,
              background: infoHover ? C.orange : "transparent",
              border: `1px solid ${infoHover ? C.orange : C.lineHi}`,
              borderRadius: 999, padding: "7px 12px", textDecoration: "none",
              transition: "background .2s ease,color .2s ease,border-color .2s ease",
            }}
          >
            <Info size={13} /> Info
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/* ---- Ventana emergente "Info" de cada producto de la tienda ---- YA SE PUEDE BORRAR NO SE ESTA USANDO LA FUNCION ProductModal */
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
      background: "rgba(8,6,4,.78)", backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)",
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

      <div className="smx-modal" onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 720, maxHeight: "88vh", overflowY: "auto",
        background: C.card, borderRadius: 24, border: `1px solid ${C.lineHi}`,
        boxShadow: "0 40px 90px -20px rgba(0,0,0,.8)",
        animation: "smxmodalin .34s cubic-bezier(.2,.7,.2,1)", position: "relative",
      }}>
        <button onClick={onClose} aria-label="Cerrar" style={{
          position: "absolute", top: 14, right: 14, zIndex: 3,
          width: 38, height: 38, borderRadius: "50%", cursor: "pointer",
          border: `1px solid ${C.lineHi}`, background: "rgba(15,11,8,.6)",
          color: C.cream, display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        }}>
          <X size={18} />
        </button>

        {/* portada */}
        <div className="smx-modal__cover" style={{
          position: "relative", flex: "none", overflow: "hidden",
          background: "linear-gradient(150deg,#2A211A,#17120E)",
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
            padding: "5px 11px", borderRadius: 999,
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
            <button className="smx-btn" onClick={() => onBuy && onBuy()} style={{
              fontFamily: F.display, fontWeight: 700, fontSize: 15,
              background: C.orange, color: C.ink, border: "none", cursor: "pointer",
              padding: "14px 26px", borderRadius: 999,
              display: "flex", alignItems: "center", gap: 9,
            }}>
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
  const btnStyle = {
    marginTop: "auto", fontFamily: F.display, fontWeight: 600, fontSize: 14.5,
    padding: "13px 18px", borderRadius: 999, border: "none", cursor: ready ? "pointer" : "not-allowed",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: featured ? C.ink : C.orange, color: featured ? C.cream : C.ink,
    textDecoration: "none", opacity: ready ? 1 : 0.55,
  };
  return (
    <Reveal delay={delay} style={{
      background: featured ? C.orange : C.card,
      border: `1px solid ${featured ? "transparent" : C.line}`,
      borderRadius: 24, padding: "28px 26px", display: "flex", flexDirection: "column", gap: 18,
      position: "relative",
    }}>
      {badge && (
        <div style={{
          position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
          fontFamily: F.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase",
          background: C.ink, color: C.orange, padding: "6px 14px", borderRadius: 999,
          border: `1px solid ${C.orange}`, whiteSpace: "nowrap",
        }}>{badge}</div>
      )}
      <div>
        <div style={{
          fontFamily: F.display, fontWeight: 700, fontSize: 23,
          color: featured ? C.ink : C.text,
        }}>{title}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
          <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 24, color: featured ? C.ink : C.orange }}>{price}</span>
          <span style={{ fontFamily: F.mono, fontSize: 12, color: featured ? "rgba(22,17,12,.6)" : C.muted }}>{per}</span>
        </div>
      </div>
      <div style={{ height: 1, background: featured ? "rgba(22,17,12,.18)" : C.line }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Check size={16} color={featured ? C.ink : C.orange} style={{ marginTop: 2, flex: "none" }} />
            <span style={{ fontFamily: F.body, fontSize: 14, color: featured ? "rgba(22,17,12,.85)" : C.muted }}>{b}</span>
          </div>
        ))}
      </div>
      {ready ? (
        <a className="smx-btn" href={link} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          Reservar <ArrowRight size={16} />
        </a>
      ) : (
        <button className="smx-btn" disabled style={btnStyle}>
          Reservar <ArrowRight size={16} />
        </button>
      )}
    </Reveal>
  );
}
/* --------------------------- A/B player --------------------------- */
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
    try { d.pause(); m.pause(); } catch (e) {}
    try { d.currentTime = 0; m.currentTime = 0; } catch (e) {}
    try { d.load(); m.load(); } catch (e) {}
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
    } catch (e) {
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
    <div style={{
      background: C.cardHi, border: `1px solid ${C.lineHi}`, borderRadius: 28,
      padding: "clamp(20px,3vw,34px)",
      boxShadow: "0 40px 80px -30px rgba(0,0,0,.6)",
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
          <div style={{
            position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr",
            background: C.bg, borderRadius: 16, padding: 5, border: `1px solid ${C.line}`,
          }}>
            <div style={{
              position: "absolute", top: 5, bottom: 5, width: "calc(50% - 5px)",
              left: mode === "ref" ? 5 : "calc(50%)", borderRadius: 12,
              background: C.orange, transition: "left .28s cubic-bezier(.3,.8,.3,1)",
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
          <div style={{
            background: C.bg, borderRadius: 16, border: `1px solid ${C.line}`,
            padding: "14px 16px",
          }}>
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

  const go = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nav = [
    ["Música", "musica"], ["Mix & Master", "player"], ["Recursos", "recursos"],
    ["Cursos", "recursos"], ["Servicios", "servicios"],
  ];

  return (
    <div className="smx" style={{ background: C.bg, color: C.text, fontFamily: F.body, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .smx *{box-sizing:border-box;margin:0;padding:0;}
        .smx{-webkit-font-smoothing:antialiased;overflow-x:hidden;}
        [data-reveal]{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1);}
        [data-reveal].is-in{opacity:1;transform:translateY(0);}
        .smx-spin{animation:smxspin 16s linear infinite;}
        @keyframes smxspin{to{transform:rotate(360deg);}}
        .smx-disc{transition:transform .4s ease;}
        .smx-disccard:hover .smx-disc{animation:smxspin 5s linear infinite;}
        .smx-disccard{transition:transform .35s ease,border-color .35s ease;}
        .smx-disccard:hover{transform:translateY(-6px);border-color:rgba(232,96,10,.4);}
        .smx-release{transition:transform .35s ease,border-color .35s ease;}
        .smx-release:hover{transform:translateY(-6px);border-color:rgba(232,96,10,.4);}
        .smx-release:hover .smx-playover{opacity:1;}
        .smx-product{transition:transform .35s ease;}
        .smx-product:hover{transform:translateY(-6px);}
        .smx-btn{transition:transform .2s ease,filter .2s ease;}
        .smx-btn:hover{transform:translateY(-2px);filter:brightness(1.06);}
        .smx-play{transition:transform .2s ease;}
        .smx-play:hover{transform:scale(1.06);}
        .smx-marquee{display:flex;gap:0;animation:smxmarq 28s linear infinite;}
        @keyframes smxmarq{to{transform:translateX(-50%);}}
        .smx-navlink{position:relative;}
        .smx-navlink::after{content:'';position:absolute;left:0;bottom:-4px;width:0;height:2px;background:${C.orange};transition:width .25s;}
        .smx-navlink:hover::after{width:100%;}
        .smx-range{-webkit-appearance:none;height:5px;border-radius:999px;background:${C.line};outline:none;}
        .smx-range::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${C.orange};cursor:pointer;}
        .smx-range::-moz-range-thumb{width:14px;height:14px;border:none;border-radius:50%;background:${C.orange};cursor:pointer;}
        @media(max-width:600px){.smx-vol{display:none;}}
        .smx-grain{position:fixed;inset:0;pointer-events:none;z-index:100;opacity:.05;mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
        @keyframes smxglow{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5;}50%{transform:translate(-50%,-50%) scale(1.15);opacity:.75;}}
        .smx-playergrid{grid-template-columns:1fr;}
        @media(min-width:860px){.smx-playergrid{grid-template-columns:230px 1fr;}}
      `}</style>
      <div className="smx-grain" />

      {/* ---------------- NAV ---------------- */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, padding: "16px clamp(14px,3vw,28px) 0" }}>
        <nav style={{
          maxWidth: 1240, margin: "0 auto", background: C.cream, borderRadius: 999,
          padding: "12px 14px 12px 24px", display: "flex", alignItems: "center", gap: 18,
          boxShadow: "0 18px 40px -16px rgba(0,0,0,.5)",
        }}>
          <div onClick={() => go("top")} style={{ display: "flex", alignItems: "center", cursor: "pointer", marginRight: "auto" }}>
            <img src={LOGO_DARK} alt="Sadoc Mixing & Mastering" style={{ height: 34, width: "auto", display: "block" }} />
          </div>
          <div className="smx-navdesktop" style={{ display: "none", gap: 26, alignItems: "center" }}>
            {nav.map(([label, id]) => (
              <span key={label} className="smx-navlink" onClick={() => go(id)} style={{
                fontFamily: F.display, fontWeight: 600, fontSize: 14, color: C.ink, cursor: "pointer",
              }}>{label}</span>
            ))}
          </div>
          <ShoppingBag size={20} color={C.ink} style={{ cursor: "pointer" }} />
          <button className="smx-btn" style={{
            fontFamily: F.display, fontWeight: 600, fontSize: 14, color: C.cream, background: C.ink,
            border: "none", padding: "11px 22px", borderRadius: 999, cursor: "pointer",
          }}>Entrar</button>
          <button onClick={() => setMenuOpen((o) => !o)} className="smx-navmobile" style={{
            display: "flex", background: "transparent", border: "none", cursor: "pointer", color: C.ink,
          }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        {menuOpen && (
          <div style={{
            maxWidth: 1240, margin: "10px auto 0", background: C.cream, borderRadius: 20,
            padding: "10px", display: "flex", flexDirection: "column",
          }}>
            {nav.map(([label, id]) => (
              <span key={label} onClick={() => go(id)} style={{
                fontFamily: F.display, fontWeight: 600, fontSize: 15, color: C.ink,
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
          background: "radial-gradient(circle, rgba(232,96,10,.34), transparent 65%)",
          animation: "smxglow 9s ease-in-out infinite", pointerEvents: "none",
        }} />
        <div style={{
          maxWidth: 1240, margin: "0 auto", position: "relative",
          display: "grid", gap: "clamp(32px,5vw,60px)", alignItems: "center",
          gridTemplateColumns: "1fr",
        }} className="smx-herogrid">
          <div>
            <Reveal delay={40}>
              <h1 style={{
                fontFamily: F.display, fontWeight: 800, lineHeight: 1.04,
                fontSize: "clamp(40px,6vw,74px)", letterSpacing: "-.02em",
                color: C.text,
              }}>
                Que tu canción suene como la imaginaste...{" "}
                <span style={{
                  background: C.orange, color: C.ink, padding: "0 .12em",
                  borderRadius: 6, display: "inline-block", transform: "rotate(-1.5deg)",
                }}>y quizá mejor.</span>
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p style={{
                fontFamily: F.body, fontSize: "clamp(15px,1.5vw,18px)", color: C.muted,
                lineHeight: 1.6, marginTop: 22, maxWidth: 480,
              }}>
                Desvela el verdadero potencial de tu música.
              </p>
            </Reveal>
            <Reveal delay={220} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 30 }}>
              <button onClick={() => go("servicios")} className="smx-btn" style={{
                fontFamily: F.display, fontWeight: 600, fontSize: 15, color: C.ink, background: C.orange,
                border: "none", padding: "15px 26px", borderRadius: 999, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 9,
              }}>
                Ver servicios <ArrowRight size={17} />
              </button>
              <button onClick={() => go("player")} className="smx-btn" style={{
                fontFamily: F.display, fontWeight: 600, fontSize: 15, color: C.text, background: "transparent",
                border: `1.5px solid ${C.lineHi}`, padding: "15px 26px", borderRadius: 999, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 9,
              }}>
                <Play size={17} fill={C.text} /> Escuchar el A/B
              </button>
            </Reveal>
            <Reveal delay={300} style={{
              display: "flex", gap: 22, flexWrap: "wrap", marginTop: 36,
              paddingTop: 26, borderTop: `1px solid ${C.line}`,
            }}>
              {["+1 Billón de Streams", "6 Discos de Platino", "4 Discos de Oro", "Top 1% Global de Mastering"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={16} color={C.orange} />
                  <span style={{ fontFamily: F.mono, fontSize: 12.5, color: C.muted }}>{f}</span>
                </div>
              ))}
            </Reveal>
          </div>

          {/* hero visual */}
          <Reveal delay={200} style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <HeroLogo3D />
              <div style={{
                position: "absolute", top: 30, right: -1, background: C.cream, color: C.ink,
                fontFamily: F.display, fontWeight: 700, fontSize: 13, padding: "10px 16px",
                borderRadius: 999, boxShadow: "0 14px 30px -10px rgba(0,0,0,.6)",
                display: "flex", alignItems: "center", gap: 7,
              }}>
                <Sparkles size={15} color={C.orange} /> 6× Platino
              </div>
              <div onClick={() => go("player")} style={{
                position: "absolute", bottom: 6, left: -26, background: C.ink, color: C.cream,
                fontFamily: F.mono, fontSize: 12, padding: "11px 16px", borderRadius: 999,
                border: `1px solid ${C.lineHi}`, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.orange }} /> A/B demo en vivo
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <style>{`@media(min-width:900px){.smx-herogrid{grid-template-columns:1.05fr .95fr!important;}}`}</style>

      {/* ---------------- MARQUEE ---------------- */}
      <div style={{
        borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`,
        padding: "16px 0", overflow: "hidden", background: C.bg2,
      }}>
        <div className="smx-marquee" style={{ width: "max-content" }}>
          {[0, 1].map((rep) => (
            <div key={rep} style={{ display: "flex" }}>
              {["Mezcla", "Mastering", "A&R", "Vocal Chains", "Estrategia", "Plantillas", "Asesorías"].map((w) => (
                <span key={w} style={{
                  fontFamily: F.display, fontWeight: 700, fontSize: 22, color: C.faint,
                  padding: "0 28px", display: "flex", alignItems: "center", gap: 56,
                }}>
                  {w}<IsotipoMark size={20} color={C.orange} /> 
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- PALMARÉS ---------------- */}
      <section id="logros" style={{ padding: "clamp(60px,8vw,110px) clamp(16px,3vw,28px)" }}>
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
            <p style={{ fontFamily: F.body, fontSize: 15, color: C.muted, maxWidth: 380, lineHeight: 1.6 }}>
              Trabajo que pasó de la sesión a la radio. Cada portada es una colaboración real
              con su certificación correspondiente.
            </p>
          </Reveal>

          {/* stats */}
          <Reveal delay={120} style={{
            display: "grid", gridTemplateColumns: "1fr", gap: 1,
            marginTop: 42, background: C.line, border: `1px solid ${C.line}`,
            borderRadius: 22, overflow: "hidden",
          }} className="smx-stats">
            {[["10", "Certificaciones"], ["1.2B+", "Streams"], ["230+", "Artistas"]].map(([n, l]) => (
              <div key={l} style={{ background: C.bg, padding: "26px 24px" }}>
                <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: "clamp(30px,3.5vw,46px)", color: C.orange }}>{n}</div>
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
              { tier: "plata", mult: 5, title: "Enamorao", artist: "Gabriele", streams: "5M", cover: "/img/discos/Enamorao.jpg" },
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
      <section id="player" style={{ padding: "clamp(40px,6vw,80px) clamp(16px,3vw,28px)", background: C.bg2, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center" }}><Kicker>A/B Player</Kicker></Reveal>
          <Reveal delay={60}>
            <h2 style={{
              fontFamily: F.display, fontWeight: 800, fontSize: "clamp(32px,4.5vw,56px)",
              letterSpacing: "-.02em", color: C.text, textAlign: "center", marginTop: 12,
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
          <Reveal delay={160}><ABPlayer /></Reveal>
        </div>
      </section>

      {/* ---------------- RELEASES ---------------- */}
      <section id="musica" style={{ padding: "clamp(60px,8vw,110px) clamp(16px,3vw,28px)" }}>
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
          <Reveal delay={120} style={{
            borderRadius: 18, overflow: "hidden", border: `1px solid ${C.line}`, background: C.card,
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

      {/* ---------------- PRODUCTS ---------------- */}
            {/* ---------------- TIENDA / PRODUCTOS ---------------- */}
      <section id="recursos" style={{ padding: "clamp(60px,8vw,100px) clamp(16px,3vw,28px)", background: C.bg2, borderTop: `1px solid ${C.line}` }}>
        <style>{`
          .smx-prodgrid{display:grid;gap:18px;grid-template-columns:1fr;}
          @media(min-width:560px){.smx-prodgrid{grid-template-columns:1fr 1fr;}}
          @media(min-width:1000px){.smx-prodgrid{grid-template-columns:repeat(4,1fr);}}
          .smx-prodcard{border:1px solid rgba(244,236,224,.12);transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease;}
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
            display: "inline-flex", alignItems: "center", gap: 7, background: C.orange, color: C.ink,
            fontFamily: F.mono, fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase",
            padding: "6px 12px", borderRadius: 999,
          }}>
            <Sparkles size={13} /> Tienda
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
                onBuy={() => showToast("Próximamente disponible")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section id="servicios" style={{ padding: "clamp(60px,8vw,110px) clamp(16px,3vw,28px)" }}>
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
          <h2 style={{
            fontFamily: F.display, fontWeight: 800, fontSize: "clamp(28px,4vw,48px)",
            letterSpacing: "-.02em", color: C.ink, lineHeight: 1.08,
          }}>
            ¿Tienes una canción lista<br />para sonar de verdad?
          </h2>
          <button className="smx-btn" style={{
            marginTop: 28, fontFamily: F.display, fontWeight: 700, fontSize: 16, color: C.cream,
            background: C.ink, border: "none", padding: "16px 32px", borderRadius: 999, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 9,
          }}>
            Cuéntame el proyecto <ArrowRight size={18} />
          </button>
        </Reveal>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "clamp(40px,6vw,72px) clamp(16px,3vw,28px) 40px" }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", display: "grid", gap: 36,
          gridTemplateColumns: "1fr", alignItems: "start",
        }} className="smx-footgrid">
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={LOGO_WHITE} alt="Sadoc Mixing & Mastering" style={{ height: 40, width: "auto", display: "block" }} />
            </div>
            <p style={{ fontFamily: F.body, fontSize: 14, color: C.muted, marginTop: 14, maxWidth: 280, lineHeight: 1.6 }}>
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
              <div style={{ fontFamily: F.mono, fontSize: 11.5, letterSpacing: ".14em", color: C.faint, textTransform: "uppercase" }}>{h}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
                {items.map((it) => (
                  <span key={it} style={{ fontFamily: F.body, fontSize: 14, color: C.muted, cursor: "pointer" }}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          maxWidth: 1240, margin: "44px auto 0", paddingTop: 24, borderTop: `1px solid ${C.line}`,
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        }}>
          <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.faint }}>© 2026 Sadoc Mixing & Mastering</span>
          <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.faint }}>Hecho en Madrid 🎚</span>
        </div>
      </footer>
      <style>{`@media(min-width:820px){.smx-footgrid{grid-template-columns:1.4fr 1fr 1fr 1fr 1fr!important;}}
@keyframes smxtoast{from{opacity:0;transform:translate(-50%,-50%) scale(.92);}to{opacity:1;transform:translate(-50%,-50%) scale(1);}}`}</style>
      
      {toast && (
        <div style={{
          position: "fixed", left: "50%", top: "50%", zIndex: 300,
          transform: "translate(-50%,-50%)",
          background: C.ink, color: C.cream, border: `1px solid ${C.lineHi}`,
          fontFamily: F.mono, fontSize: 16, padding: "20px 32px", borderRadius: 999,
          boxShadow: "0 24px 60px -12px rgba(0,0,0,.7)",
          display: "flex", alignItems: "center", gap: 12,
          animation: "smxtoast .35s cubic-bezier(.2,.7,.2,1)",
        }}>
          <ProductModal
        product={infoProduct}
        onClose={() => setInfoProduct(null)}
        onBuy={() => { setInfoProduct(null); showToast("Próximamente disponible"); }}
      />
          <Sparkles size={19} color={C.orange} /> {toast}
        </div>
      )}
    </div>
  );
}
