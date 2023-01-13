/**
 * Strips unusable characters from path strings and replaces them.
 *
 * @param {string} path - The path to strip
 * @returns {string} stripped path - The path that has been stripped
 */
export default function pathStripper(
	path: string,
	replacementChar: string = "-"
): string {
	try {
		return path.replace(/[/\\?%*:|"<>]/g, replacementChar);
	} catch (e) {
		throw e;
	}
}
