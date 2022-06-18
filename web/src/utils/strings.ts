type OrdinalSuffixes = {
  [locale: string]: {
    [rule in Intl.LDMLPluralRule]?: string;
  };
};

const suffixes: OrdinalSuffixes = {
  "en-US": {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  },
};

/**
 * Insert a number and in return you'll get a string with an ordinal.
 * Example: 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", etc...
 *
 * Currently limited to just the "en-US" locale (good for all English).
 * Potential improvements later are to support additional locales.
 *
 * Adapted from MDN's own docs with some modifications.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules#using_options
 * @param count
 * @returns
 */
export function formatOrdinal(count: number) {
  const locale = "en-US";
  const pluralRules = new Intl.PluralRules(locale, { type: "ordinal" });
  const rule = pluralRules.select(count);
  const suffix = suffixes[locale]?.[rule] ?? "";
  return `${count}${suffix}`;
}

/**
 * Takes a grade string (typically 1-12 or K) and returns a nicely formatted
 * ordinal string for display purposes.
 * "1" -> "1st", "3" -> "3rd", "k"/"K" -> "k"/"K" or "k/Kindergarten"
 *
 * Maintaining capitalization of the word "Kindergarten" is a handy convenience,
 * just pass whatever grade with .toLowerCase() or .toUpperCase() to get the
 * desired result.
 *
 * @param grade string grade value, typically a number or "k"
 * @param longK will convert a "k" into "kindergarten"; "K" to "Kindergarten"
 * @returns
 */
export function formatGrade(grade: string, longK = false) {
  const trimmedGrade = grade.trim();

  // If an empty string return unchanged.
  if (!trimmedGrade) {
    return grade;
  }

  // If a "k" or "K".
  if (trimmedGrade.toLowerCase() === "k") {
    return longK ? trimmedGrade + "indergarten" : trimmedGrade;
  }

  // Parse a number.
  const gradeNumber = Number(trimmedGrade);
  if (isNaN(gradeNumber)) {
    return trimmedGrade;
  }

  // Return the ordinal.
  return formatOrdinal(gradeNumber);
}
