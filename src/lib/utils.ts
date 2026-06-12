/* Utilidad estándar de la convención shadcn para combinar clases.
   Versión sin dependencias: este proyecto no usa clsx/tailwind-merge. */
export function cn(
  ...inputs: Array<string | number | null | undefined | false>
): string {
  return inputs.filter(Boolean).join(" ");
}
