import type { JSX } from "react";
import ReactCountryFlag from "react-country-flag";

/**
 * Country name to ISO country code mapping
 * Based on countries used in ACC tracks and cars, plus additional common countries
 */
const countryCodeMap: Record<string, string> = {
    // Countries from ACC tracks
    Spain: "ES",
    "United Kingdom": "GB",
    "United States": "US",
    Hungary: "HU",
    Italy: "IT",
    "South Africa": "ZA",
    Australia: "AU",
    Germany: "DE",
    France: "FR",
    Belgium: "BE",
    Japan: "JP",
    Netherlands: "NL",
    Austria: "AT",

    // Additional countries that might be useful
    Switzerland: "CH",
    Sweden: "SE",
    Norway: "NO",
    Denmark: "DK",
    Finland: "FI",
    Poland: "PL",
    "Czech Republic": "CZ",
    Canada: "CA",
    Brazil: "BR",
    Argentina: "AR",
    Mexico: "MX",
    Russia: "RU",
    China: "CN",
    "South Korea": "KR",
    India: "IN",
    Turkey: "TR",
    Greece: "GR",
    Portugal: "PT",
    Monaco: "MC",
    Singapore: "SG",
    Malaysia: "MY",
    Thailand: "TH",
    Indonesia: "ID",
    "New Zealand": "NZ",
    Ireland: "IE",
    UAE: "AE",
    "Saudi Arabia": "SA",
    Qatar: "QA",
    Bahrain: "BH",
    Israel: "IL",
    Egypt: "EG",
    Morocco: "MA",
    Kenya: "KE",
    Nigeria: "NG",
    Chile: "CL",
    Colombia: "CO",
    Venezuela: "VE",
    Peru: "PE",
    Ecuador: "EC",
    Uruguay: "UY",
    Paraguay: "PY",
    Bolivia: "BO",
};

/**
 * Get country flag component for a country name
 * Returns a default flag if country is not found
 */
export function getCountryFlag(countryName: string): JSX.Element {
    const countryCode = countryCodeMap[countryName];

    if (!countryCode) {
        // Return a racing flag emoji as fallback (wrapped in span for consistency)
        return <span>🏁</span>;
    }

    return (
        <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{
                width: "1em",
                height: "1em",
            }}
            className="mb-0.5"
            title={countryName}
        />
    );
}
