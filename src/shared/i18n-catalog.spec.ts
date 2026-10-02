import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { config, localeCodes } from "~/i18n-config";

/**
 * Guards the compiled-i18n catalogs in i18n/<locale>.json: every locale must
 * translate exactly the keys used in src/, with matching placeholders.
 */

const ROOT = join(import.meta.dirname, "..", "..");
const SRC = join(ROOT, "src");
const DEFAULT_LOCALE = config.defaultLocale.lang;

interface Catalog {
	locale: string;
	fallback?: string;
	name?: string;
	translations: Record<string, unknown>;
}

function sourceFiles(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return sourceFiles(path);
		return /\.tsx?$/.test(entry.name) &&
			!/\.(spec|test)\.tsx?$/.test(entry.name)
			? [path]
			: [];
	});
}

/** Mirrors compiled-i18n's makeKey for `_` tagged templates. */
function extractKeys(code: string): string[] {
	const keys: string[] = [];
	for (const match of code.matchAll(/\b_`/g)) {
		const parts: string[] = [""];
		let depth = 0;
		for (let i = (match.index ?? 0) + 2; i < code.length; i++) {
			const char = code[i];
			if (depth > 0) {
				if (char === "{") depth++;
				else if (char === "}" && --depth === 0) parts.push("");
				continue;
			}
			if (char === "`") break;
			if (char === "$" && code[i + 1] === "{") {
				depth = 1;
				i++;
				continue;
			}
			parts[parts.length - 1] += char;
		}
		const key = parts
			.map((s, i) => `${i}${s.replace(/\$/g, "$$$$")}`)
			.join("$")
			.slice(1);
		// compiled-i18n rejects multi-line keys; this also catches false matches
		if (/[\r\n]/.test(key)) throw new Error(`Invalid i18n key: ${key}`);
		keys.push(key);
	}
	return keys;
}

function placeholders(value: string) {
	return [...value.matchAll(/\$(\d)/g)].map((m) => m[1]).sort();
}

const catalogs = Object.fromEntries(
	localeCodes.map((locale) => [
		locale,
		JSON.parse(
			readFileSync(join(ROOT, "i18n", `${locale}.json`), "utf8"),
		) as Catalog,
	]),
);

const usedKeys = [
	...new Set(
		sourceFiles(SRC).flatMap((file) => extractKeys(readFileSync(file, "utf8"))),
	),
].sort();

describe("extractKeys", () => {
	it("builds compiled-i18n keys from tagged templates", () => {
		expect(
			// "$" + "{" avoids a lint warning about template syntax in strings
			extractKeys(
				"_`nav.home` _`reviews.rating $" + "{a} $" + "{b.c}` _`price $`",
			),
		).toEqual(["nav.home", "reviews.rating $1 $2", "price $$"]);
	});
});

describe("i18n catalogs", () => {
	it("finds translation keys in source", () => {
		expect(usedKeys.length).toBeGreaterThan(100);
	});

	it.each(localeCodes)("%s has valid metadata", (locale) => {
		const catalog = catalogs[locale];
		expect(catalog.locale).toBe(locale);
		expect(catalog.name).toBeTruthy();
		expect(catalog.fallback).toBe(
			locale === DEFAULT_LOCALE ? undefined : DEFAULT_LOCALE,
		);
	});

	it.each(localeCodes)(
		"%s translates exactly the keys used in src/",
		(locale) => {
			expect(Object.keys(catalogs[locale].translations).sort()).toEqual(
				usedKeys,
			);
		},
	);

	it.each(localeCodes)("%s has non-empty, inlinable strings", (locale) => {
		for (const [key, value] of Object.entries(catalogs[locale].translations)) {
			expect(typeof value, key).toBe("string");
			expect((value as string).trim(), key).not.toBe("");
			expect(value, key).not.toMatch(/`|\$\{/);
		}
	});

	it.each(localeCodes)(
		"%s keeps the default locale's placeholders",
		(locale) => {
			const base = catalogs[DEFAULT_LOCALE].translations;
			for (const [key, value] of Object.entries(
				catalogs[locale].translations,
			)) {
				expect(placeholders(value as string), key).toEqual(
					placeholders(base[key] as string),
				);
			}
		},
	);
});
