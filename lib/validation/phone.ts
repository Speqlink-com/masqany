/**
 * Phone Number Validation Utilities
 * Validates and formats Kenyan phone numbers
 */

/**
 * Validates a Kenyan phone number
 * Accepts formats: 07XX, 01XX, 254XXX, +254XXX
 * @param phone - Phone number to validate
 * @returns true if valid Kenyan phone number
 */
export function validateKenyanPhone(phone: string): boolean {
  if (!phone) return false

  // Remove whitespace and common separators
  const cleaned = phone.replace(/[\s\-\(\)]/g, "")

  // Valid Kenyan phone number patterns
  const patterns = [
    /^0[17]\d{8}$/, // 0712345678 or 0112345678
    /^254[17]\d{8}$/, // 254712345678
    /^\+254[17]\d{8}$/, // +254712345678
  ]

  return patterns.some((pattern) => pattern.test(cleaned))
}

/**
 * Formats a Kenyan phone number to international format (+254XXXXXXXXX)
 * @param phone - Phone number to format
 * @returns Formatted phone number or original if invalid
 */
export function formatKenyanPhone(phone: string): string {
  if (!phone) return phone

  // Remove whitespace and common separators
  const cleaned = phone.replace(/[\s\-\(\)]/g, "")

  // Format based on input pattern
  if (/^0[17]\d{8}$/.test(cleaned)) {
    // 0712345678 → +254712345678
    return `+254${cleaned.slice(1)}`
  }

  if (/^254[17]\d{8}$/.test(cleaned)) {
    // 254712345678 → +254712345678
    return `+${cleaned}`
  }

  if (/^\+254[17]\d{8}$/.test(cleaned)) {
    // Already in correct format
    return cleaned
  }

  // Return original if no pattern matches
  return phone
}

/**
 * Formats a phone number for display (with spaces)
 * @param phone - Phone number to format
 * @returns Formatted phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  const formatted = formatKenyanPhone(phone)

  // +254712345678 → +254 712 345 678
  if (/^\+254[17]\d{8}$/.test(formatted)) {
    return formatted.replace(/(\+254)(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4")
  }

  return formatted
}

/**
 * Extracts the phone number from various formats
 * @param phone - Phone number string
 * @returns Clean phone number digits only
 */
export function extractPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "")
}

/**
 * Checks if a phone number is a Safaricom number (M-Pesa compatible)
 * @param phone - Phone number to check
 * @returns true if Safaricom number
 */
export function isSafaricomNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "")
  const formatted = formatKenyanPhone(cleaned)

  // Safaricom prefixes: 07XX (excluding 076X which is Airtel)
  const safaricomPrefixes = ["0700", "0701", "0702", "0703", "0704", "0705", "0706", "0707", "0708", "0709", "0710", "0711", "0712", "0713", "0714", "0715", "0716", "0717", "0718", "0719", "0720", "0721", "0722", "0723", "0724", "0725", "0726", "0727", "0728", "0729", "0740", "0741", "0742", "0743", "0745", "0746", "0748", "0757", "0758", "0759", "0768", "0769", "0790", "0791", "0792", "0793", "0794", "0795", "0796", "0797", "0798", "0799"]

  // Convert to 07XX format for checking
  let checkFormat = formatted
  if (formatted.startsWith("+254")) {
    checkFormat = `0${formatted.slice(4)}`
  } else if (formatted.startsWith("254")) {
    checkFormat = `0${formatted.slice(3)}`
  }

  return safaricomPrefixes.some((prefix) => checkFormat.startsWith(prefix))
}
