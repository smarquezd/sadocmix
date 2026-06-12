"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Botón "liquid glass" adaptado a sadocmix.
   El componente original distorsionaba el fondo con un filtro SVG
   (feDisplacementMap) que solo funciona en Chrome; aquí el efecto vidrio se
   logra con backdrop-filter (blur+saturate, cross-browser) + un box-shadow
   biselado multicapa que da el borde "líquido". Usa la paleta de marca y
   reaprovecha .smx-liquid para el brillo especular que sigue al cursor. */

const liquidButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer select-none font-medium outline-none transition-transform duration-300 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-[15px]",
        xl: "h-14 px-9 text-base",
      },
    },
    defaultVariants: { size: "lg" },
  },
);

// Bisel de vidrio: luz arriba-izq, sombra abajo-der, halo interior y sombra
// proyectada. Cross-browser (no necesita filtros SVG).
const BEVEL =
  "inset 1.5px 1.5px 1px -1px rgba(255,255,255,.9), inset -1.5px -1.5px 1px -1px rgba(0,0,0,.18), inset 0 0 8px 4px rgba(255,255,255,.10), 0 10px 26px -10px rgba(0,0,0,.3)";

type Tint = "clear" | "orange";
const TINTS: Record<Tint, { fill: string; color: string; border: string }> = {
  clear: { fill: "rgba(255,255,255,.26)", color: "#1A1612", border: "rgba(0,0,0,.10)" },
  orange: { fill: "rgba(232,96,10,.88)", color: "#0A0807", border: "rgba(232,96,10,.55)" },
};

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidButtonVariants> {
  asChild?: boolean;
  tint?: Tint;
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, size, tint = "clear", asChild = false, children, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const t = TINTS[tint];
    return (
      <Comp
        ref={ref}
        className={cn(liquidButtonVariants({ size }), "smx-liquid", className)}
        style={{
          color: t.color,
          background: t.fill,
          border: `1px solid ${t.border}`,
          borderRadius: 14,
          boxShadow: BEVEL,
          WebkitBackdropFilter: "blur(10px) saturate(150%)",
          backdropFilter: "blur(10px) saturate(150%)",
          ...style,
        }}
        {...props}
      >
        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
          {children}
        </span>
      </Comp>
    );
  },
);
LiquidButton.displayName = "LiquidButton";
