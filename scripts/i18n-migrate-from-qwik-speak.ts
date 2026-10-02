#!/usr/bin/env bun
/**
 * One-off migration from qwik-speak to compiled-i18n.
 *
 * Catalog mode (default):
 *   bun scripts/i18n-migrate-from-qwik-speak.ts [--keep-unused] [--dry-run]
 *   Reads i18n/<locale>/app.json, writes i18n/<locale>.json in compiled-i18n
 *   format, and aborts unless every used translation round-trips byte-for-byte.
 *
 * Codemod mode:
 *   bun scripts/i18n-migrate-from-qwik-speak.ts --codemod [files...]
 *   Rewrites qwik-speak call sites in the given files (default: all of src/).
 *   Idempotent; safe to re-run after rebasing another branch.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..");
const I18N_DIR = join(ROOT, "i18n");
const SRC_DIR = join(ROOT, "src");
const DEFAULT_LOCALE = "en-BE";
const LOCALES = ["en-BE", "nl-BE", "fr-BE", "ru-BE", "uk-BE"] as const;
const LOCALE_NAMES: Record<string, string> = {
	"en-BE": "English",
	"nl-BE": "Nederlands",
	"fr-BE": "Français",
	"ru-BE": "Русский",
	"uk-BE": "Українська",
};
const OLD_PREFIX = "app.";

type Flat = Record<string, string>;

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const fail = (message: string): never => {
	console.error(`✖ ${message}`);
	process.exit(1);
};

/** qwik-speak `{{name}}` params in order of first appearance. */
export const paramNames = (text: string) => [
	...new Set([...text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1])),
];

/** `app.reviews.rating_label` + [rating, max] -> `reviews.rating_label $1 $2` */
export const newKey = (oldKey: string, params: string[]) => {
	const base = oldKey.startsWith(OLD_PREFIX)
		? oldKey.slice(OLD_PREFIX.length)
		: oldKey;
	return [base, ...params.map((_, i) => `$${i + 1}`)].join(" ");
};

/** Escape `$` and map `{{name}}` to positional `$n`. */
export const toCompiledValue = (value: string, params: string[]) =>
	value
		.replaceAll("$", "$$$$")
		.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => {
			const index = params.indexOf(name);
			return index === -1 ? match : `$${index + 1}`;
		});

/** Exact inverse of toCompiledValue, used for the round-trip proof. */
export const fromCompiledValue = (value: string, params: string[]) =>
	value.replace(/\$(\d|\$)/g, (_, token: string) =>
		token === "$" ? "$" : `{{${params[Number(token) - 1]}}}`,
	);

/** Same comparator as compiled-i18n's plugin, so builds do not reorder files. */
const sortObject = <T>(o: Record<string, T>) =>
	Object.fromEntries(
		Object.entries(o).sort(([a], [b]) =>
			a.localeCompare(b, "en", { sensitivity: "base" }),
		),
	);

const flatten = (value: unknown, prefix = "", out: Flat = {}): Flat => {
	if (typeof value === "string") {
		out[prefix] = value;
		return out;
	}
	if (!value || typeof value !== "object")
		fail(`Unsupported value at ${prefix}: ${JSON.stringify(value)}`);
	for (const [k, v] of Object.entries(value as object))
		flatten(v, prefix ? `${prefix}.${k}` : k, out);
	return out;
};

const sourceFiles = (dir: string): string[] =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return sourceFiles(path);
		return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
	});

// `t("app.key@@Default", { a, b: expr })` — default text may contain escaped quotes.
const T_CALL =
	/\bt\(\s*"app\.([\w.]+)@@((?:[^"\\]|\\.)*)"\s*(?:,\s*\{([^}]*)\}\s*)?,?\s*\)/g;
const BARE_KEY = /"app\.([\w.]+)@@(?:[^"\\]|\\.)*"/g;

/** Keys (with inline defaults) referenced in source, old format. */
const usedSourceKeys = () => {
	const used = new Map<string, string>();
	for (const file of sourceFiles(SRC_DIR)) {
		const code = readFileSync(file, "utf8");
		for (const m of code.matchAll(/"(app\.[\w.]+)@@((?:[^"\\]|\\.)*)"/g))
			used.set(m[1], JSON.parse(`"${m[2]}"`));
	}
	return used;
};

function migrateCatalog() {
	const dryRun = flag("--dry-run");
	const keepUnused = flag("--keep-unused");

	const old: Record<string, Flat> = {};
	for (const locale of LOCALES) {
		const file = join(I18N_DIR, locale, "app.json");
		if (!existsSync(file)) fail(`Missing ${relative(ROOT, file)}`);
		old[locale] = flatten(JSON.parse(readFileSync(file, "utf8")));
	}

	const used = usedSourceKeys();
	if (used.size === 0) fail("No qwik-speak keys found in src/");
	for (const [key, inlineDefault] of used) {
		for (const locale of LOCALES)
			if (!old[locale][key]) fail(`${locale} has no value for used key ${key}`);
		const enParams = paramNames(old[DEFAULT_LOCALE][key]);
		const inlineParams = paramNames(inlineDefault);
		if (enParams.join() !== inlineParams.join())
			fail(
				`Param order differs between ${DEFAULT_LOCALE} and inline default for ${key}`,
			);
	}

	const keys = Object.keys(old[DEFAULT_LOCALE]);
	const allKeys = new Set(LOCALES.flatMap((l) => Object.keys(old[l])));
	const migrated = keepUnused
		? [...allKeys]
		: keys.filter((key) => used.has(key));
	const pruned = [...allKeys].filter((key) => !migrated.includes(key)).sort();

	const output: Record<string, Flat> = {};
	for (const locale of LOCALES) output[locale] = {};

	let checked = 0;
	for (const key of migrated) {
		const params = paramNames(old[DEFAULT_LOCALE][key] ?? "");
		const target = newKey(key, params);
		if (/[\r\n]/.test(target)) fail(`Key contains a newline: ${key}`);
		for (const locale of LOCALES) {
			const original = old[locale][key];
			if (original === undefined) continue;
			if (/`|\$\{/.test(original))
				fail(`${locale} ${key}: backtick or \${ breaks inlining`);
			const localeParams = paramNames(original);
			if (localeParams.some((name) => !params.includes(name)))
				fail(`${locale} ${key}: params ${localeParams} not in ${params}`);
			const value = toCompiledValue(original, params);
			if (fromCompiledValue(value, params) !== original)
				fail(`${locale} ${key}: round-trip mismatch`);
			output[locale][target] = value;
			checked++;
		}
	}

	for (const locale of LOCALES) {
		const data = {
			locale,
			...(locale === DEFAULT_LOCALE ? {} : { fallback: DEFAULT_LOCALE }),
			name: LOCALE_NAMES[locale],
			translations: sortObject(output[locale]),
		};
		const file = join(I18N_DIR, `${locale}.json`);
		if (!dryRun) writeFileSync(file, JSON.stringify(data, null, 2));
		console.info(
			`${dryRun ? "would write" : "wrote"} ${relative(ROOT, file)} (${Object.keys(data.translations).length} keys)`,
		);
	}
	console.info(
		`✔ ${checked} translations round-tripped byte-for-byte across ${LOCALES.length} locales`,
	);
	if (pruned.length)
		console.info(
			`Pruned ${pruned.length} unused keys (use --keep-unused to retain):\n  ${pruned.join("\n  ")}`,
		);
}

/** Parse `{ rating, max: expr }` into name -> expression. */
const parseParamObject = (body: string) =>
	new Map(
		body
			.split(",")
			.map((part) => part.trim())
			.filter(Boolean)
			.map((part) => {
				const [name, ...expr] = part.split(":");
				return [name.trim(), expr.length ? expr.join(":").trim() : name.trim()];
			}),
	);

export function codemodSource(code: string) {
	let out = code.replace(
		T_CALL,
		(_match, key: string, inlineDefault: string, paramBody?: string) => {
			const params = paramNames(inlineDefault);
			if (!paramBody) {
				if (params.length) throw new Error(`Missing params for app.${key}`);
				return `_\`${key}\``;
			}
			const exprs = parseParamObject(paramBody);
			const parts = params.map((name) => {
				const expr = exprs.get(name);
				if (!expr) throw new Error(`Param ${name} missing for app.${key}`);
				return ` \${${expr}}`;
			});
			return `_\`${key}${parts.join("")}\``;
		},
	);
	// Keys passed around as data (e.g. nav-links) keep only the new key.
	out = out.replace(BARE_KEY, (_match, key: string) => `"${key}"`);
	out = out.replace(/^[ \t]*const t = inlineTranslate\(\);\r?\n/gm, "");
	out = out.replace(/useSpeakLocale\(\)\.lang/g, "getCurrentLocale()");

	const usesLocale = /getCurrentLocale\(\)/.test(out);
	out = out.replace(
		/import \{([^}]*)\} from "qwik-speak";/,
		(_match, names: string) => {
			const rest = names
				.split(",")
				.map((n) => n.trim())
				.filter(
					(n) =>
						n && n !== "inlineTranslate" && !(usesLocale && n === "useSpeakLocale"),
				);
			const lines = /\b_`/.test(out) ? [`import { _ } from "compiled-i18n";`] : [];
			if (usesLocale && !out.includes('from "~/shared/i18n"'))
				lines.push(`import { getCurrentLocale } from "~/shared/i18n";`);
			if (rest.length)
				lines.push(`import { ${rest.join(", ")} } from "qwik-speak";`);
			return lines.join("\n");
		},
	);
	return out;
}

function runCodemod() {
	const targets = args.filter((a) => !a.startsWith("--"));
	const files = targets.length
		? targets.map((f) => join(process.cwd(), f))
		: sourceFiles(SRC_DIR);
	let changed = 0;
	const leftovers: string[] = [];
	for (const file of files) {
		const code = readFileSync(file, "utf8");
		const next = codemodSource(code);
		if (next !== code) {
			writeFileSync(file, next);
			changed++;
			console.info(`rewrote ${relative(ROOT, file)}`);
		}
		if (/qwik-speak|inlineTranslate|useSpeakLocale|"app\.[\w.]+@@/.test(next))
			leftovers.push(relative(ROOT, file));
	}
	console.info(`✔ ${changed} file(s) rewritten`);
	if (leftovers.length)
		console.warn(
			`Manual follow-up needed (qwik-speak references remain):\n  ${leftovers.join("\n  ")}`,
		);
}

if (import.meta.main) {
	if (flag("--codemod")) runCodemod();
	else migrateCatalog();
}
