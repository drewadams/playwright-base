/**
 * Strips unusable characters from path strings.
 *
 * @param {string} path - The path to strip
 * @returns {string} stripped path - The path that has been stripped
 */
export default function pathStripper(path: string): string {
	try {
		return path.replace(/[/\\?%*:|"<>]/g, "-");
	} catch (e) {
		throw e;
	}
}
