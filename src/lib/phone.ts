/** Ghana local number (e.g. 054 823 4585) → tel: link */
export function phoneToTel(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `233${digits.slice(1)}` : digits;
  return `tel:+${normalized}`;
}

/** Ghana local number → WhatsApp wa.me link */
export function phoneToWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `233${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

/** Formatted display for WhatsApp number */
export function formatWhatsAppDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}
