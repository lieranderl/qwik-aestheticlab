import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import { config } from "~/speak-config";

interface LanguageSwitcherProps {
	buttonClass?: string;
}

export const LanguageSwitcher = component$<LanguageSwitcherProps>(
	({ buttonClass }) => {
		const loc = useLocation();
		const t = inlineTranslate();
		const isExpanded = useSignal(false);
		const dropdownRef = useSignal<HTMLDivElement>();
		const triggerRef = useSignal<HTMLButtonElement>();

		// Extract current lang from URL or default
		const currentLang =
			config.supportedLocales.find((l) =>
				loc.url.pathname.startsWith(`/${l.lang}`),
			)?.lang || config.defaultLocale.lang;

		const currentLangShort = currentLang.split("-")[0].toUpperCase();
		const toggleMenu = $(() => {
			isExpanded.value = !isExpanded.value;
		});

		useOnDocument(
			"click",
			$((event) => {
				if (
					isExpanded.value &&
					event.target instanceof Node &&
					!dropdownRef.value?.contains(event.target)
				) {
					isExpanded.value = false;
				}
			}),
		);

		return (
			<div
				ref={dropdownRef}
				class={`dropdown dropdown-end relative ${isExpanded.value ? "dropdown-open" : ""}`}
			>
				<button
					ref={triggerRef}
					type="button"
					class={`btn btn-ghost min-h-11 min-w-11 gap-1 px-2 text-sm font-medium tracking-wide uppercase transition-colors duration-150 hover:text-secondary/70 ${buttonClass || ""}`}
					aria-label={t("app.language.select@@Select language")}
					aria-haspopup="true"
					aria-expanded={isExpanded.value}
					onClick$={toggleMenu}
					onKeyDown$={$((event) => {
						if (event.key === "Escape") isExpanded.value = false;
					})}
				>
					{currentLangShort}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width={1.5}
						stroke="currentColor"
						class="w-4 h-4"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 8.25l-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</button>

				{isExpanded.value ? (
					<ul
						class="dropdown-content menu menu-sm absolute right-0 top-full z-10 mt-1 w-32 rounded-2xl border border-base-content/20 bg-base-100 p-2 shadow-lg"
						aria-label={t("app.language.options@@Language options")}
						onKeyDown$={$((event) => {
							if (event.key !== "Escape") return;
							isExpanded.value = false;
							requestAnimationFrame(() => triggerRef.value?.focus());
						})}
					>
						{config.supportedLocales.map((locale) => {
							// Compute correct path for this locale
							const segments = loc.url.pathname.split("/").filter(Boolean);
							const isFirstSegmentLocale = config.supportedLocales.some(
								(l) => l.lang === segments[0],
							);

							let newPath = "";
							if (isFirstSegmentLocale) {
								segments[0] = locale.lang;
								newPath = `/${segments.join("/")}`;
							} else {
								newPath = `/${locale.lang}/${segments.join("/")}`;
							}

							// Tiny fix for trailing slash or root
							if (newPath.endsWith("//")) newPath = newPath.slice(0, -1);

							const localizedHref = `${newPath}${loc.url.search}${loc.url.hash}`;
							const isCurrent = locale.lang === currentLang;

							return (
								<li key={locale.lang}>
									{isCurrent ? (
										<span
											class="flex min-h-11 cursor-default items-center rounded-xl px-3 py-2 text-sm font-bold text-base-content"
											aria-current="true"
										>
											{locale.lang.split("-")[0].toUpperCase()}
										</span>
									) : (
										<a
											href={localizedHref}
											onClick$={$(() => {
												trackGoogleAnalyticsEvent("language_changed", {
													from_locale: currentLang,
													to_locale: locale.lang,
												});
											})}
											class="flex min-h-11 items-center rounded-xl px-3 py-2 text-sm text-base-content transition-colors duration-150 hover:bg-base-200"
										>
											{locale.lang.split("-")[0].toUpperCase()}
										</a>
									)}
								</li>
							);
						})}
					</ul>
				) : null}
			</div>
		);
	},
);
