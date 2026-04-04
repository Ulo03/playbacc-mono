import { getLocale } from "$lib/paraglide/runtime";

export function formatMonthYear(date: string | Date): string {
  return new Intl.DateTimeFormat(getLocale(), {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
