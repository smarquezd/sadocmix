---
name: design-craft
description: Principios de diseño para construir, reestilizar o revisar UI en este proyecto (Sadoc · Mezcla & Mastering). Úsalo siempre que trabajes en componentes, layout, estilos, color, tipografía, animaciones o cualquier cosa visual del sitio. Mantiene la estética editorial oscura de la marca y evita los clichés de "AI slop".
---

# Design craft — Sadoc · Mezcla & Mastering

Guía de criterio de diseño para trabajo visual en este repo. Destilada de un prompt de
diseño más amplio y adaptada a que aquí escribimos **código Next.js real** (no artefactos
HTML sueltos). No reemplaza a `AGENTS.md`: antes de escribir código que toque APIs de Next,
lee primero la guía en `node_modules/next/dist/docs/` — esta versión tiene breaking changes.

## 1. Parte del contexto de marca — nunca desde cero

El buen diseño hi-fi se ancla en el sistema que ya existe. Antes de inventar nada, mira:

- **Paleta:** fondo `#000000`, texto `#f4f1ec` (crema cálido). Tokens en
  [`src/app/globals.css`](../../../src/app/globals.css) vía `@theme inline`
  (`--color-background`, `--color-foreground`). Es un tema **oscuro**, no claro.
- **Tipografía:** Geist Sans / Geist Mono cargadas con `next/font/google` en
  [`src/app/layout.tsx`](../../../src/app/layout.tsx) y expuestas como
  `--font-geist-sans` / `--font-geist-mono`. Ojo: `globals.css` hoy fuerza `Inter` en el
  body, contradiciendo las fuentes cargadas — si tocas tipografía, resuélvelo hacia Geist.
- **Stack visual:** Tailwind v4 (clases utility + tokens del `@theme`), iconos con
  `lucide-react`, y 3D con `react-three-fiber` / `three`.
- **Aesthetic:** editorial, premium, oscura. Secciones con foco animado y bordes iluminados,
  wordmarks "Trusted by", reproductor A/B. Lenguaje sobrio, en español.

Si vas a añadir a una UI existente, **primero entiende su vocabulario visual** y síguelo:
paleta, tono de copy, estados hover/click, estilo de animación, sombras, densidad, radios.
Piensa en voz alta sobre lo que observas antes de construir.

## 2. Declara el sistema antes de construir

Como un diseñador junior ante su manager: vocaliza la escala tipográfica, el uso de color y
el ritmo de layout que vas a usar, y *luego* construye. Una decisión explícita > improvisar.

## 3. Color

Usa los tokens de la marca. Si necesitas un color nuevo, derívalo en **oklch** para que
armonice con la paleta existente — **no inventes hex desde cero**. Mantén la temperatura
cálida del crema; evita azules/grises fríos salvo que aporten contraste intencional.

## 4. Evita los clichés de "AI slop"

- Gradientes de fondo agresivos.
- Emoji, salvo que sean parte de la marca (aquí no lo son) → usa placeholder o icono.
- Contenedores con esquinas redondeadas + borde-izquierdo de color de acento.
- Dibujar imágenes/ilustraciones con SVG a mano → usa placeholder o pide el asset real.
- Fuentes sobreusadas (Inter, Roboto, Arial, system-ui) cuando ya tienes Geist.

## 5. Disciplina de contenido — menos es más

- **Cero relleno.** Nada de texto placeholder, secciones dummy ni datos inventados para
  llenar espacio. Si una sección se siente vacía, es problema de *layout*, no de meter copy.
- **Evita "data slop":** números, stats o iconos que no aportan. Mil noes por cada sí.
- **Pregunta antes de añadir material.** Secciones, páginas, copy nuevo → consulta primero;
  el usuario conoce a su audiencia mejor que tú.

## 6. Escala y accesibilidad

- Targets táctiles ≥ 44px. Texto de cuerpo legible; no encojas por estética.
- Usa CSS moderno con gusto: `text-wrap: pretty`, CSS grid, capas, ritmo visual.

## 7. Imágenes y assets

Un placeholder honesto > un intento malo de lo real. Si falta un logo, foto o icono, deja un
placeholder claro y **pide el material real** en vez de fabricarlo.

## 8. Cuando el usuario quiere explorar

Si piden variaciones, ofrece 3+ atómicas a través de dimensiones distintas (layout, color,
interacción, tipo) — de lo más fiel al sistema a lo más novedoso. El objetivo es darle al
usuario piezas para mezclar y elegir, no una única "opción perfecta".
