import { $, component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import { config } from "~/speak-config";

interface LanguageSwitcherProps {
	buttonClass?: string;
}

export const LanguageSwitcher = component$<LanguageSwitcherProps>(
	({ buttonClass }) => {
		const loc = useLocation();

		// Extract current lang from URL or default
		const currentLang =
			config.supportedLocales.find((l) =>
				loc.url.pathname.startsWith(`/${l.lang}`),
			)?.lang || config.defaultLocale.lang;

		const currentLangShort = currentLang.split("-")[0].toUpperCase();

		return (
			<div class="dropdown dropdown-end">
				<button
					type="button"
					tabIndex={0}
					class={`flex items-center gap-1 text-sm font-medium tracking-wide uppercase transition-colors hover:text-secondary/70 cursor-pointer ${buttonClass || ""}`}
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

				<ul
					tabIndex={-1}
					class="dropdown-content menu bg-base-200 rounded-2xl z-10 w-32 p-2 shadow-lg border-base-content border"
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

						return (
							<li key={locale.lang}>
								<a
									href={locale.lang === currentLang ? "#" : newPath}
									onClick$={$(() => {
										if (locale.lang === currentLang) return;
										trackGoogleAnalyticsEvent("language_changed", {
											from_locale: currentLang,
											to_locale: locale.lang,
										});
									})}
									class={`text-sm ${
										locale.lang === currentLang
											? "font-bold text-primary"
											: "text-primary-accent/70"
									}`}
								>
									{locale.lang.split("-")[0].toUpperCase()}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		);
	},
);
