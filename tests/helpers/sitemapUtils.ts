import axios from "axios";
import fs from "fs";

/**
 * This will get a sitemap and format it into an array of urls.
 * @param  {string} url - sitemap url
 * @returns {Promise<string[]>} Final Data - this is the final sitemap data
 */
const getSitemap = async (url: string): Promise<string[]> => {
	const { data } = await axios.get(url);
	const dataArray = data.split(/(?<=<loc>)(.*)(?=<\/loc>)/);
	let finalData: string[] = [];
	for (const rec of dataArray) {
		if (
			rec.includes("https:") &&
			!rec.includes("shopify") &&
			!rec.includes("uploads")
		) {
			finalData.push(rec);
		}
	}
	return finalData;
};

/**
 * This will generate a json file with all links from a sitemap.
 * @param {string} url - URL of sitemap to get info from
 * @param  {string} sitemapPath - path to sitemap
 */
const generateSitemap = async (
	url: string,
	sitemapPath?: string
): Promise<void> => {
	const appendToSitemap = async (text: string, path: string) => {
		fs.appendFile(path, text, (err) => {
			if (err) throw err;
		});
	};
	const filePath = sitemapPath || `./test-data/sitemap.json`;
	const data = await getSitemap(url);
	if (!fs.existsSync(filePath)) {
		appendToSitemap(`{\n"urls":\n${JSON.stringify(data)}\n}`, filePath);
	}
};

export { getSitemap, generateSitemap };
