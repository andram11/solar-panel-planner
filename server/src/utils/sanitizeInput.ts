import { AppError } from "./AppError";

export function sanitizeText(input: string, fieldName: string): string {
  const pattern = /^[\w\s\-,.]+$/; // Letters, numbers, spaces, hyphens, commas, periods
  if (!pattern.test(input)) {
    throw new AppError(`Invalid characters in ${fieldName}.`, 400);
  }
  return input;
}

// Ensure zip is a 5-digit number (adjust for your locale if needed)
export function validateZip(input: number): number {
  const zipString = input.toString();
  if (!/^\d{5}$/.test(zipString)) {
    throw new AppError("Invalid ZIP code. It must be a 5-digit number.", 400);
  }
  return input;
}
