// @ts-nocheck
"use client";

// ---------------------------------------------------------------------------
// PÁGINA DE PRODUCTO  ·  src/app/recursos/[slug]/page.tsx
// ---------------------------------------------------------------------------
// Cada plantilla / vocal chain / curso tiene aquí su propia página.
// Ej: el producto con slug "cadena-vocal-beele" se ve en
//     sadocmix.com/recursos/cadena-vocal-beele
// Los datos vienen del archivo compartido src/data/productos.js
// ---------------------------------------------------------------------------

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Play, Pause, ArrowLeft, ArrowRight, Check, Headphones, ChevronDown } from "lucide-react";
import { getProducto } from "../../../data/productos";

/* --- paleta y tipografías (mismas que la home) --- */
const C = {
  bg: "#000000", bg2: "rgba(255,255,255,0.018)", card: "#0E0D0C", cardHi: "#161413",
  cream: "#F3EFE8", cream2: "#D8D2C8", ink: "#0A0807", text: "#F4F1EC",
  muted: "#988F86", faint: "#5E574F", orange: "#E8600A", orangeHi: "#FF7E2B",
  line: "rgba(255,255,255,0.10)", lineHi: "rgba(255,255,255,0.20)",
};
const F = {
  display: "'Space Grotesk', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'DM Mono', ui-monospace, monospace",
};

/* Isotipo de la marca como SVG en línea */
function IsotipoMark({ size = 22, color = C.orange }) {
  return (
    <svg viewBox="332.63 68.05 176.63 220.74" height={size} width={Math.round(size * 0.8)}
      fill={color} aria-hidden="true" style={{ flex: "none", display: "block" }}>
      <path d="M495.26,145.75L495.26,145.75L379.4,226.01c-13.85,9.59-32.77-0.32-32.77-17.16v0l115.86-80.26C476.34,119,495.26,128.91,495.26,145.75z" />
      <path d="M401.4,234.34l93.86-65.02v15.21c0,15.44-7.57,29.9-20.27,38.69l-74.44,51.57L401.4,234.34z" />
      <path d="M439.99,122.5l-93.36,64.67v-15.21c0-15.44,7.57-29.9,20.27-38.69l73.94-51.22L439.99,122.5z" />
    </svg>
  );
}

/* Convierte un enlace normal de YouTube/Vimeo en uno "embed" para el iframe */
function toEmbed(url) {
  if (!url) return "";
  try {
    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1].split(/[?&]/)[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url; // ya es un enlace embed
  } catch {
    return url;
  }
}

/* Etiqueta pequeña en mono mayúsculas */
function Eyebrow({ children, icon }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      fontFamily: F.mono, fontSize: 11.5, letterSpacing: ".14em",
      textTransform: "uppercase", color: C.orange,
    }}>
      {icon ? <>{icon} </> : null}{children}
    </div>
  );
}

/* Bloque-sección con su eyebrow y título */
function Block({ eyebrow, eyebrowIcon, title, children, bg }) {
  return (
    <section style={{
      padding: "clamp(40px,6vw,80px) clamp(16px,3vw,28px)",
      background: bg || "transparent", borderTop: `1px solid ${C.line}`,
    }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        {eyebrow && <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>}
        {title && (
          <h2 style={{
            fontFamily: F.display, fontWeight: 800, fontSize: "clamp(24px,3.4vw,38px)",
            letterSpacing: "-.02em", color: C.text, lineHeight: 1.1,
            marginTop: 12, marginBottom: 26,
          }}>{title}</h2>
        )}
        {children}
      </div>
    </section>
  );
}

/* --------- reproductor A/B antes-después (autónomo por producto) --------- */
function ABDemo({ before, after }) {
  const [mode, setMode] = useState("despues");
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const aRef = useRef(null); // antes
  const bRef = useRef(null); // después

  // Mantiene silenciado el audio que no toca; suenan los dos en paralelo.
  useEffect(() => {
    if (aRef.current) aRef.current.muted = mode !== "antes";
    if (bRef.current) bRef.current.muted = mode !== "despues";
  }, [mode]);

  const toggle = () => {
    const a = aRef.current, b = bRef.current;
    if (!a || !b) return;
    if (playing) {
      a.pause(); b.pause(); setPlaying(false);
    } else {
      b.currentTime = a.currentTime;
      a.play(); b.play(); setPlaying(true);
    }
  };

  const onTime = () => {
    const el = mode === "antes" ? aRef.current : bRef.current;
    if (el && el.duration) setProg((el.currentTime / el.duration) * 100);
  };
  const onEnd = () => { setPlaying(false); setProg(0); };

  const seek = (e) => {
    const a = aRef.current, b = bRef.current;
    if (!a || !b || !a.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    a.currentTime = ratio * a.duration;
    b.currentTime = ratio * a.duration;
    setProg(ratio * 100);
  };

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.line}`, borderRadius: 20,
      padding: "22px 22px 24px", maxWidth: 560,
    }}>
      <audio ref={aRef} src={before} preload="metadata" onTimeUpdate={onTime} onEnded={onEnd} />
      <audio ref={bRef} src={after} preload="metadata" onTimeUpdate={onTime} onEnded={onEnd} />

      {/* toggle antes / después */}
      <div style={{
        display: "flex", gap: 6, padding: 5, borderRadius: 999,
        background: C.bg, border: `1px solid ${C.line}`, marginBottom: 20,
      }}>
        {[["antes", "Antes"], ["despues", "Después"]].map(([id, label]) => {
          const active = mode === id;
          return (
            <button key={id} onClick={() => setMode(id)} style={{
              flex: 1, padding: "10px 14px", borderRadius: 999, cursor: "pointer", border: "none",
              fontFamily: F.display, fontWeight: 700, fontSize: 13.5,
              background: active ? C.orange : "transparent",
              color: active ? C.ink : C.muted,
              transition: "background .2s ease,color .2s ease",
            }}>{label}</button>
          );
        })}
      </div>

      {/* play + barra */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"} style={{
          width: 52, height: 52, borderRadius: "50%", flex: "none", cursor: "pointer",
          border: "none", background: C.orange, color: C.ink,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {playing ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
        </button>
        <div onClick={seek} style={{
          flex: 1, height: 8, borderRadius: 999, background: C.bg,
          border: `1px solid ${C.line}`, cursor: "pointer", overflow: "hidden",
        }}>
          <div style={{ height: "100%", width: `${prog}%`, background: C.orange }} />
        </div>
      </div>

      <p style={{ fontFamily: F.mono, fontSize: 11.5, color: C.faint, marginTop: 14 }}>
        {mode === "antes" ? "Voz en crudo, sin procesar" : "Voz con la cadena cargada"}
      </p>
    </div>
  );
}

/* --------- desplegable para elegir el DAW del producto --------- */
function DawPicker({ daws, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const sel = daws[value] || daws[0];

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", maxWidth: 320 }}>
      <button type="button" onClick={() => setOpen((o) => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, cursor: "pointer", padding: "13px 16px", borderRadius: 12,
        background: C.card, border: `1px solid ${open ? C.orange : C.lineHi}`,
        color: C.text, fontFamily: F.display, fontWeight: 600, fontSize: 14.5,
        transition: "border-color .2s ease",
      }}>
        {sel ? sel.nombre : "Selecciona un DAW"}
        <ChevronDown size={17} color={C.muted} style={{
          flex: "none", transition: "transform .2s ease",
          transform: open ? "rotate(180deg)" : "none",
        }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20,
          background: C.cardHi, border: `1px solid ${C.lineHi}`, borderRadius: 12,
          overflow: "hidden", boxShadow: "0 20px 44px -16px rgba(0,0,0,.7)",
        }}>
          {daws.map((d, i) => {
            const activo = i === value;
            return (
              <button key={i} type="button" onClick={() => { onChange(i); setOpen(false); }} style={{
                width: "100%", textAlign: "left", cursor: "pointer",
                padding: "12px 16px", border: "none",
                borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
                background: activo ? "rgba(232,96,10,.14)" : "transparent",
                color: activo ? C.orangeHi : C.text,
                fontFamily: F.display, fontWeight: 600, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
              }}>
                {d.nombre}
                {activo && <Check size={15} color={C.orange} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================== PÁGINA ============================== */
export default function Page({ params }) {
  const { slug } = use(params);
  const [dawIdx, setDawIdx] = useState(0);
  const producto = getProducto(slug);

  /* --- producto inexistente --- */
  if (!producto) {
    return (
      <div style={{
        background: C.bg, color: C.text, fontFamily: F.body, minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 16, padding: 24, textAlign: "center",
      }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 26 }}>
          Producto no encontrado
        </div>
        <Link href="/#recursos" style={{ fontFamily: F.mono, fontSize: 13, color: C.orange, textDecoration: "none" }}>
          ← Volver a la tienda
        </Link>
      </div>
    );
  }

  const {
    badge, title, price, cover, comprarLink, tagline, descripcionLarga,
    puntos, plugins, requisitos, incluye, demoAntes, demoDespues, video, daws,
  } = producto;
  const free = price === "Gratis";
  const tieneDemo = demoAntes && demoDespues;
  const embed = toEmbed(video);
  const tieneDaws = daws && daws.length > 0;
  const dawSel = tieneDaws ? daws[dawIdx] : null;
  // según el DAW elegido: su enlace, sus requisitos y su "qué incluye"
  // (si el DAW no define alguno, se usa el general del producto)
  const linkActivo = tieneDaws ? (dawSel && dawSel.comprarLink) : comprarLink;
  const reqActivo = (dawSel && dawSel.requisitos) || requisitos;
  const incluyeActivo = (dawSel && dawSel.incluye) || incluye;

  /* botón de compra: usa el enlace del DAW elegido (o el general) */
  const compraBtnStyle = {
    display: "inline-flex", alignItems: "center", gap: 9,
    fontFamily: F.display, fontWeight: 700, fontSize: 15,
    background: C.orange, color: C.ink, border: "none", cursor: "pointer",
    padding: "15px 28px", borderRadius: 999, textDecoration: "none",
  };
  const CompraBtn = () =>
    linkActivo ? (
      <a className="rec-btn" href={linkActivo} target="_blank" rel="noopener noreferrer" style={compraBtnStyle}>
        {free ? "Descargar" : "Comprar ahora"} <ArrowRight size={17} />
      </a>
    ) : (
      <button className="rec-btn" style={compraBtnStyle} onClick={() => alert("Disponible próximamente")}>
        {free ? "Descargar" : "Comprar ahora"} <ArrowRight size={17} />
      </button>
    );

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.body, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}
        body{margin:0;}
        .rec-hero{display:grid;gap:30px;grid-template-columns:1fr;}
        @media(min-width:860px){.rec-hero{grid-template-columns:minmax(0,440px) 1fr;gap:48px;align-items:center;}}
        .rec-puntos{display:grid;gap:14px;grid-template-columns:1fr;}
        @media(min-width:680px){.rec-puntos{grid-template-columns:1fr 1fr;}}
        .rec-cols{display:grid;gap:26px;grid-template-columns:1fr;}
        @media(min-width:760px){.rec-cols{grid-template-columns:1.25fr 1fr;}}
        .rec-link:hover{color:${C.orangeHi}!important;}
        .rec-btn{transition:transform .2s ease,filter .2s ease;}
        .rec-btn:hover{transform:translateY(-2px);filter:brightness(1.06);}
      `}</style>

      {/* ---------------- header ---------------- */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(6,6,7,.72)", backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{
          maxWidth: 1040, margin: "0 auto", padding: "14px clamp(16px,3vw,28px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <IsotipoMark size={22} />
            <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 15, color: C.text }}>Sadoc</span>
          </Link>
          <Link href="/#recursos" className="rec-link" style={{
            display: "flex", alignItems: "center", gap: 7,
            fontFamily: F.mono, fontSize: 12.5, color: C.muted, textDecoration: "none",
          }}>
            <ArrowLeft size={15} /> Volver a la tienda
          </Link>
        </div>
      </header>

      {/* ---------------- hero ---------------- */}
      <section style={{ padding: "clamp(36px,6vw,72px) clamp(16px,3vw,28px)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div className="rec-hero">
            {/* portada */}
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", inset: "-12% -8%",
                background: "radial-gradient(circle at 50% 40%, rgba(232,96,10,.32), transparent 68%)",
                filter: "blur(10px)", pointerEvents: "none",
              }} />
              <div style={{
                position: "relative", aspectRatio: "1 / 1", borderRadius: 22, overflow: "hidden",
                border: `1px solid ${C.lineHi}`,
                background: "linear-gradient(150deg,#161413,#000000)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 40px 80px -28px rgba(0,0,0,.8)",
              }}>
                {cover
                  ? <img src={cover} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : <Headphones size={70} color="rgba(232,96,10,.4)" />}
              </div>
            </div>
            {/* info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <span style={{
                alignSelf: "flex-start", fontFamily: F.mono, fontSize: 11,
                letterSpacing: ".14em", textTransform: "uppercase",
                padding: "6px 12px", borderRadius: 999,
                background: free ? C.orange : C.cream, color: C.ink,
              }}>{badge}</span>
              <h1 style={{
                fontFamily: F.display, fontWeight: 800, lineHeight: 1.08,
                letterSpacing: "-.02em", fontSize: "clamp(30px,4.6vw,50px)", color: C.text,
              }}>{title}</h1>
              {tagline && (
                <p style={{ fontFamily: F.body, fontSize: 16, lineHeight: 1.55, color: C.muted }}>{tagline}</p>
              )}
              {tieneDaws && (
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 4 }}>
                  <span style={{
                    fontFamily: F.mono, fontSize: 11, letterSpacing: ".12em",
                    textTransform: "uppercase", color: C.cream2,
                  }}>Elige tu programa (DAW)</span>
                  <DawPicker daws={daws} value={dawIdx} onChange={setDawIdx} />
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginTop: 4 }}>
                <span style={{
                  fontFamily: F.display, fontWeight: 800, fontSize: 34,
                  color: free ? C.orange : C.text,
                }}>{price}</span>
                <CompraBtn />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- A/B antes / después ---------------- */}
      {tieneDemo && (
        <Block eyebrow="Antes / Después" title="Escucha la transformación" bg={C.bg2}>
          <ABDemo before={demoAntes} after={demoDespues} />
        </Block>
      )}

      {/* ---------------- vídeo ---------------- */}
      {embed && (
        <Block eyebrow="En acción" title="Míralo en uso">
          <div style={{
            position: "relative", width: "100%", aspectRatio: "16 / 9",
            borderRadius: 18, overflow: "hidden", border: `1px solid ${C.lineHi}`, background: "#000",
          }}>
            <iframe
              src={embed} title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </Block>
      )}

      {/* ---------------- plugins ---------------- */}
      {plugins && plugins.length > 0 && (
        <Block eyebrow="Cadena" eyebrowIcon={<IsotipoMark size={13} />} title="Plugins utilizados" bg={C.bg2}>
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", maxWidth: 620 }}>
            {plugins.map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
                background: i % 2 ? "transparent" : "rgba(244,236,224,.02)",
              }}>
                <span style={{ fontFamily: F.mono, fontSize: 11, color: C.faint, width: 24, flex: "none" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 15, color: C.text, flex: 1 }}>
                  {p.nombre}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: 12, color: C.muted, flex: "none" }}>
                  {p.empresa}
                </span>
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* ---------------- descripción + puntos ---------------- */}
      <Block eyebrow="Detalles" title={`Sobre ${title}`}>
        {descripcionLarga && (
          <p style={{
            fontFamily: F.body, fontSize: 16, lineHeight: 1.7, color: C.muted,
            maxWidth: 680, marginBottom: puntos && puntos.length ? 30 : 0,
          }}>{descripcionLarga}</p>
        )}
        {puntos && puntos.length > 0 && (
          <div className="rec-puntos">
            {puntos.map((pt, i) => (
              <div key={i} style={{
                background: C.card, border: `1px solid ${C.line}`,
                borderRadius: 16, padding: "20px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.orange, flex: "none" }} />
                  <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 16, color: C.text }}>
                    {pt.titulo}
                  </span>
                </div>
                <p style={{ fontFamily: F.body, fontSize: 14, lineHeight: 1.55, color: C.muted }}>
                  {pt.texto}
                </p>
              </div>
            ))}
          </div>
        )}
      </Block>

      {/* ---------------- qué incluye + requisitos ---------------- */}
      {((incluyeActivo && incluyeActivo.length) || reqActivo) && (
        <Block eyebrow="Antes de comprar" title="Qué incluye y qué necesitas" bg={C.bg2}>
          <div className="rec-cols">
            {incluyeActivo && incluyeActivo.length > 0 && (
              <div>
                <div style={{
                  fontFamily: F.mono, fontSize: 11, letterSpacing: ".14em",
                  textTransform: "uppercase", color: C.cream2, marginBottom: 14,
                }}>Qué incluye</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {incluyeActivo.map((it, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <Check size={17} color={C.orange} style={{ marginTop: 2, flex: "none" }} />
                      <span style={{ fontFamily: F.body, fontSize: 14.5, color: C.muted }}>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {reqActivo && (
              <div>
                <div style={{
                  fontFamily: F.mono, fontSize: 11, letterSpacing: ".14em",
                  textTransform: "uppercase", color: C.cream2, marginBottom: 14,
                }}>Requisitos</div>
                <p style={{ fontFamily: F.body, fontSize: 14.5, lineHeight: 1.6, color: C.muted }}>
                  {reqActivo}
                </p>
              </div>
            )}
          </div>
        </Block>
      )}

      {/* ---------------- CTA final ---------------- */}
      <section style={{ padding: "clamp(44px,7vw,90px) clamp(16px,3vw,28px)", borderTop: `1px solid ${C.line}` }}>
        <div style={{
          maxWidth: 1040, margin: "0 auto", background: C.card,
          border: `1px solid ${C.lineHi}`, borderRadius: 24,
          padding: "clamp(28px,4vw,44px)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center",
        }}>
          <h2 style={{ fontFamily: F.display, fontWeight: 800, fontSize: "clamp(22px,3vw,32px)", color: C.text }}>
            ¿Listo para llevártelo?
          </h2>
          <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 32, color: free ? C.orange : C.text }}>
            {price}
          </span>
          {tieneDaws && (
            <div style={{ width: "100%", maxWidth: 320 }}>
              <DawPicker daws={daws} value={dawIdx} onChange={setDawIdx} />
            </div>
          )}
          <CompraBtn />
        </div>
      </section>

      {/* ---------------- footer ---------------- */}
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: "28px clamp(16px,3vw,28px)" }}>
        <div style={{
          maxWidth: 1040, margin: "0 auto", display: "flex",
          justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        }}>
          <span style={{ fontFamily: F.mono, fontSize: 11.5, color: C.faint }}>
            © 2026 Sadoc Mixing &amp; Mastering
          </span>
          <Link href="/#recursos" className="rec-link" style={{
            fontFamily: F.mono, fontSize: 11.5, color: C.faint, textDecoration: "none",
          }}>
            Ver toda la tienda
          </Link>
        </div>
      </footer>
    </div>
  );
}
