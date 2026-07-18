/**
 * Slugify utility — generates URL-safe slugs from strings.
 *
 * Features:
 * - Converts to lowercase
 * - Replaces spaces and special chars with hyphens
 * - Removes non-alphanumeric characters
 * - Trims leading/trailing hyphens
 * - Collapses consecutive hyphens
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[&]/g, "and")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Generate a unique slug by checking for collisions in the database.
 *
 * If "tiles" already exists, produces "tiles-2", "tiles-3", etc.
 *
 * @param baseText - The text to slugify
 * @param existsCheck - A function that returns true if the slug already exists
 */
export async function generateUniqueSlug(
    baseText: string,
    existsCheck: (slug: string) => Promise<boolean>
): Promise<string> {
    const base = slugify(baseText);
    let slug = base;
    let counter = 2;

    while (await existsCheck(slug)) {
        slug = `${base}-${counter}`;
        counter++;
    }

    return slug;
}
