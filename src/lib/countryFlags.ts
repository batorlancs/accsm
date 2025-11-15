/**
 * Country to flag emoji mapping
 * Based on countries used in ACC tracks and cars, plus additional common countries
 */
export const countryFlags: Record<string, string> = {
  // Countries from ACC tracks
  "Spain": "🇪🇸",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  "Hungary": "🇭🇺",
  "Italy": "🇮🇹",
  "South Africa": "🇿🇦",
  "Australia": "🇦🇺",
  "Germany": "🇩🇪",
  "France": "🇫🇷",
  "Belgium": "🇧🇪",
  "Japan": "🇯🇵",
  "Netherlands": "🇳🇱",
  "Austria": "🇦🇹",

  // Additional countries that might be useful
  "Switzerland": "🇨🇭",
  "Sweden": "🇸🇪",
  "Norway": "🇳🇴",
  "Denmark": "🇩🇰",
  "Finland": "🇫🇮",
  "Poland": "🇵🇱",
  "Czech Republic": "🇨🇿",
  "Canada": "🇨🇦",
  "Brazil": "🇧🇷",
  "Argentina": "🇦🇷",
  "Mexico": "🇲🇽",
  "Russia": "🇷🇺",
  "China": "🇨🇳",
  "South Korea": "🇰🇷",
  "India": "🇮🇳",
  "Turkey": "🇹🇷",
  "Greece": "🇬🇷",
  "Portugal": "🇵🇹",
  "Monaco": "🇲🇨",
  "Singapore": "🇸🇬",
  "Malaysia": "🇲🇾",
  "Thailand": "🇹🇭",
  "Indonesia": "🇮🇩",
  "New Zealand": "🇳🇿",
  "Ireland": "🇮🇪",
  "UAE": "🇦🇪",
  "Saudi Arabia": "🇸🇦",
  "Qatar": "🇶🇦",
  "Bahrain": "🇧🇭",
  "Israel": "🇮🇱",
  "Egypt": "🇪🇬",
  "Morocco": "🇲🇦",
  "Kenya": "🇰🇪",
  "Nigeria": "🇳🇬",
  "Chile": "🇨🇱",
  "Colombia": "🇨🇴",
  "Venezuela": "🇻🇪",
  "Peru": "🇵🇪",
  "Ecuador": "🇪🇨",
  "Uruguay": "🇺🇾",
  "Paraguay": "🇵🇾",
  "Bolivia": "🇧🇴",
};

/**
 * Get flag emoji for a country name
 * Returns a default flag if country is not found
 */
export function getCountryFlag(countryName: string): string {
  return countryFlags[countryName] || "🏁"; // Racing flag as fallback
}