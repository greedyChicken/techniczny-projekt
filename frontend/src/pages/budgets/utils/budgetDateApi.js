/**
 * Serializes a calendar day from the date picker for the API without UTC shift.
 * toISOString() would turn e.g. 1 Apr local into 31 Mar UTC for European timezones.
 */
export function budgetStartDateToApi(date) {
    const d = date instanceof Date ? date : new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}T00:00:00`;
}

/** Inclusive end of the selected calendar day (matches backend BETWEEN checks). */
export function budgetEndDateToApi(date) {
    const d = date instanceof Date ? date : new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}T23:59:59`;
}
