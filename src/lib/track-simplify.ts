/**
 * This file contains logic for intelligently identifying a track from a setup filename.
 * It's used to automatically select a track if all imported setups are for the same one.
 */

// Note: Keys are track IDs from the backend (see src-tauri/src/data.rs)
// Values are arrays of patterns to look for in filenames. Case-insensitive.
export const TRACK_MATCHING_PATTERNS: Record<string, string[]> = {
    Barcelona: ["BARCELONA", "CATALUNYA", "BCN"],
    brands_hatch: ["BRANDS HATCH", "BRANDS"],
    cota: ["COTA", "AMERICA"],
    donington: ["DONINGTON", "DON"],
    Hungaroring: ["HUNGARORING", "BUDAPEST"],
    Imola: ["IMOLA", "IMO"],
    indianapolis: ["INDIANAPOLIS", "INDY"],
    Kyalami: ["KYALAMI", "KYA"],
    Laguna_Seca: ["LAGUNA SECA", "LAGUNA", "LAG"],
    misano: ["MISANO", "MIS"],
    monza: ["MONZA", "MNZ", "MON"],
    mount_panorama: ["MOUNT PANORAMA", "BATHURST"],
    nurburgring: ["NURBURGRING", "NURB", "NUR"],
    nurburgring_24h: ["NURBURGRING 24H", "NURB 24H", "N24H", "NORDSCHLEIFE"],
    oulton_park: ["OULTON PARK", "OULTON"],
    Paul_Ricard: ["PAUL RICARD", "RICARD", "PAUL"],
    Silverstone: ["SILVERSTONE", "SILV", "SIL"],
    snetterton: ["SNETTERTON", "SNET"],
    Spa: ["SPA", "FRANCORCHAMPS"],
    Suzuka: ["SUZUKA", "SUZ"],
    Valencia: ["VALENCIA", "RICARDO TORMO", "VAL"],
    watkins_glen: ["WATKINS GLEN", "WATKINS", "WGI"],
    Zandvoort: ["ZANDVOORT", "ZAN"],
    Zolder: ["ZOLDER", "ZOL"],
    red_bull_ring: ["RED BULL RING", "RBR", "SPIELBERG", "AUSTRIA"],
};

/**
 * Normalizes a filename for matching by removing extension and converting to uppercase.
 * @param filename The filename to normalize.
 * @returns The normalized filename string.
 */
function normalizeFilename(filename: string): string {
    return filename.replace(/\.json$/i, "").toUpperCase();
}

/**
 * Analyzes a filename to find a matching track.
 * @param filename The filename to analyze.
 * @returns The track ID if a match is found, otherwise null.
 */
export function findTrackInFilename(filename: string): string | null {
    const normalizedFullString = normalizeFilename(filename);

    for (const [trackId, patterns] of Object.entries(TRACK_MATCHING_PATTERNS)) {
        for (const pattern of patterns) {
            if (normalizedFullString.includes(pattern)) {
                return trackId;
            }
        }
    }

    return null;
}

/**
 * Finds a common track among multiple setup filenames.
 * All filenames must contain an identifier for the same track.
 * @param filenames An array of filenames.
 * @returns The common track ID if all filenames point to the same track, otherwise null.
 */
export function findCommonTrack(filenames: string[]): string | null {
    if (filenames.length === 0) {
        return null;
    }

    // Find the track for the first filename. This is our candidate.
    const firstTrackId = findTrackInFilename(filenames[0]);

    // If no track is found in the first filename, we can't have a common track.
    if (!firstTrackId) {
        return null;
    }

    // Check if all other filenames match the same track.
    for (let i = 1; i < filenames.length; i++) {
        const currentTrackId = findTrackInFilename(filenames[i]);
        if (currentTrackId !== firstTrackId) {
            return null; // A file has a different track or no track, so they are not all common.
        }
    }

    // If the loop completes, all files have the same track.
    return firstTrackId;
}
