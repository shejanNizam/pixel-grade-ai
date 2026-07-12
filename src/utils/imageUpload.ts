/** Shared client-side image constraints for every upload surface. */
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPT_ATTR = ACCEPTED_TYPES.join(",");
export const MAX_BYTES = 10 * 1024 * 1024;
export const MAX_PER_SIDE = 10;

/** Returns an error message, or null when the file is acceptable. */
export function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `${file.name} isn't a JPG, PNG, or WEBP.`;
  }
  if (file.size > MAX_BYTES) {
    return `${file.name} is larger than 10 MB.`;
  }
  return null;
}
