import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormattedDate(date: Date | null, dateFormat: string) {
  return date ? format(date, dateFormat) : "Unkown Date";
}

export function getCustomizedUserName({
  type = "firstname",
  username,
}: {
  username: string | null;
  type?: "firstname" | "shortname";
}) {
  if (!username) return "Unknown";

  switch (type) {
    case "firstname":
      const firstName = username.split(" ")[0].toLowerCase();

      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    case "shortname":
      return username.split(" ")[0].slice(0, 3).toUpperCase();
  }
}

export function isValidFloat(value: number | string) {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}
