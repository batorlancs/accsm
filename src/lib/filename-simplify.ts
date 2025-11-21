export interface SimplifyMatch {
    type: "race" | "qualify" | "qualify-2" | "wet";
    confidence: number;
}

export interface SimplifyResult {
    originalFilename: string;
    match: SimplifyMatch | null;
    suggestedName: string;
}

// Constants for filename pattern matching
export const SETUP_TYPE_PATTERNS = {
    QUALIFY: {
        full: ["QUALI", "QUALY", "QUALIFY", "QUALIFYING", "QUAL"],
        short: ["Q"],
    },
    QUALIFY_2: {
        full: ["QUALI2", "QUALY2", "QUALIFYING2", "Q2", "QUALIFY2"],
        short: ["Q2"],
    },
    RACE: {
        full: ["RACE", "RACING", "RAC"],
        short: ["R", "RS"],
    },
    WET: {
        full: ["WET"],
        short: ["W"],
    },
} as const;

export const SIMPLIFIED_NAMES = {
    race: "race",
    qualify: "quali",
    "qualify-2": "quali 2",
    wet: "wet",
} as const;

/**
 * Normalizes a filename by removing special characters and splitting into tokens
 */
function normalizeFilename(filename: string): string[] {
    // Remove .json extension and convert to uppercase
    const normalized = filename.replace(/\.json$/i, "").toUpperCase();

    // Split by common separators and filter out empty strings
    return normalized.split(/[_\-\s\.]+/).filter((token) => token.length > 0);
}

/**
 * Checks if a filename contains qualifying setup indicators
 */
function matchQualify(
    tokens: string[],
    fullString: string,
): SimplifyMatch | null {
    // Check for Q2 first (more specific)
    for (const pattern of SETUP_TYPE_PATTERNS.QUALIFY_2.full) {
        if (fullString.toUpperCase().includes(pattern)) {
            return { type: "qualify-2", confidence: 0.9 };
        }
    }

    // Check for full qualifying patterns
    for (const pattern of SETUP_TYPE_PATTERNS.QUALIFY.full) {
        if (fullString.toUpperCase().includes(pattern)) {
            return { type: "qualify", confidence: 0.9 };
        }
    }

    // Check for short patterns (Q, R) in tokens to avoid false matches
    for (const token of tokens) {
        if (SETUP_TYPE_PATTERNS.QUALIFY.short.includes(token)) {
            return { type: "qualify", confidence: 0.7 };
        }
    }

    return null;
}

/**
 * Checks if a filename contains race setup indicators
 */
function matchRace(tokens: string[], fullString: string): SimplifyMatch | null {
    // Check for full race patterns
    for (const pattern of SETUP_TYPE_PATTERNS.RACE.full) {
        if (fullString.toUpperCase().includes(pattern)) {
            return { type: "race", confidence: 0.9 };
        }
    }

    // Check for short patterns (R) in tokens
    for (const token of tokens) {
        if (SETUP_TYPE_PATTERNS.RACE.short.includes(token)) {
            return { type: "race", confidence: 0.7 };
        }
    }

    return null;
}

/**
 * Checks if a filename contains wet setup indicators
 */
function matchWet(tokens: string[], fullString: string): SimplifyMatch | null {
    // Check for wet patterns
    for (const pattern of SETUP_TYPE_PATTERNS.WET.full) {
        if (fullString.toUpperCase().includes(pattern)) {
            return { type: "wet", confidence: 0.8 };
        }
    }

    // Check for short patterns (W) in tokens
    for (const token of tokens) {
        if (SETUP_TYPE_PATTERNS.WET.short.includes(token)) {
            return { type: "wet", confidence: 0.6 };
        }
    }

    return null;
}

/**
 * Analyzes a filename and determines what type of setup it likely is
 */
export function analyzeFilename(filename: string): SimplifyResult {
    const tokens = normalizeFilename(filename);
    const fullString = filename;

    // Try to match different setup types
    const matches = [
        matchQualify(tokens, fullString),
        matchRace(tokens, fullString),
        matchWet(tokens, fullString),
    ].filter((match): match is SimplifyMatch => match !== null);

    // Get the match with highest confidence
    const bestMatch = matches.reduce(
        (best, current) =>
            current.confidence > (best?.confidence ?? 0) ? current : best,
        null as SimplifyMatch | null,
    );

    const suggestedName = bestMatch
        ? SIMPLIFIED_NAMES[bestMatch.type]
        : filename.replace(/\.json$/i, "");

    return {
        originalFilename: filename,
        match: bestMatch,
        suggestedName,
    };
}

/**
 * Checks if the given filenames contain both qualifying and race setups
 */
export function hasQualyAndRaceSetups(filenames: string[]): boolean {
    const results = filenames.map(analyzeFilename);

    const hasQualy = results.some(
        (r) => r.match?.type === "qualify" || r.match?.type === "qualify-2",
    );
    const hasRace = results.some((r) => r.match?.type === "race");

    return hasQualy && hasRace;
}

/**
 * Generates simplified filenames with optional custom name prefix
 */
export function generateSimplifiedNames(
    filenames: string[],
    customName?: string,
): Record<number, string> {
    const results = filenames.map(analyzeFilename);
    const simplifiedNames: Record<number, string> = {};

    results.forEach((result, index) => {
        if (result.match) {
            const baseName = SIMPLIFIED_NAMES[result.match.type];
            const finalName = customName
                ? `(${customName}) ${baseName}`
                : baseName;

            simplifiedNames[index] = `${finalName}.json`;
        }
    });

    return simplifiedNames;
}

