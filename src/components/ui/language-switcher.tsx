import {
	$,
	component$,
	useId,
	useOnDocument,
	useSignal,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { trackGoogleAnalyticsEvent } from "~/shared/cookie-consent";
import { config } from "~/speak-config";

export interface LanguageSwitcherProps {
	buttonClass?: string;
}

export const LanguageSwitcher = component$<LanguageSwitcherProps>(
	({ buttonClass }) => {
		const loc = useLocation();
		const t = inlineTranslate();
		const isExpanded = useSignal(false);
		const triggerRef = useSignal<HTMLButtonElement>();
		const menuId = useId();
		const anchorName = `--lang-switcher-${menuId.replaceAll(":", "-")}`;

		// Extract current lang from URL or default
		const currentLang =
			config.supportedLocales.find((l) =>
				loc.url.pathname.startsWith(`/${l.lang}`),
			)?.lang || config.defaultLocale.lang;

		const currentLangShort = currentLang.split("-")[0].toUpperCase();

		// Track popover open/close for aria-expanded
		useOnDocument(
			"toggle",
			$((event: Event) => {
				const target = event.target as HTMLElement | null;
				if (target?.id === menuId) {
					isExpanded.value = (event as ToggleEvent).newState === "open";
				}
			}),
		);

		const trackLanguageChange = $((event: MouseEvent) => {
			if (!(event.target instanceof Element)) return;
			const link = event.target.closest<HTMLAnchorElement>("a[data-locale]");
			const toLocale = link?.dataset.locale;
			if (!toLocale) return;

			trackGoogleAnalyticsEvent("language_changed", {
				from_locale: currentLang,
				to_locale: toLocale,
			});

			// Close the popover after selection
			const menu = document.getElementById(menuId);
			if (menu) (menu as HTMLElement).hidePopover();
		});

		return (
			<>
				<button
					ref={triggerRef}
					type="button"
					popovertarget={menuId}
					style={`anchor-name: ${anchorName}`}
					class={`btn btn-ghost min-h-11 min-w-11 gap-1 px-2 text-sm font-medium tracking-wide uppercase text-primary-content transition-colors duration-150 hover:text-primary-content ${buttonClass || ""}`}
					aria-label={t("app.language.select@@Select language")}
					aria-haspopup="menu"
					aria-expanded={isExpanded.value}
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
					id={menuId}
					popover="auto"
					class="dropdown menu menu-sm z-10 mt-1 w-32 rounded-2xl border border-base-content/20 bg-base-100 p-2 shadow-lg"
					style={`position-anchor: ${anchorName}; inset: auto; top: anchor(bottom)`}
					aria-label={t("app.language.options@@Language options")}
					onClick$={trackLanguageChange}
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
										data-locale={locale.lang}
										class="flex min-h-11 items-center rounded-xl px-3 py-2 text-sm text-base-content transition-colors duration-150 hover:bg-base-200"
									>
										{locale.lang.split("-")[0].toUpperCase()}
									</a>
								)}
							</li>
						);
					})}
				</ul>
			</>
		);
	},
);
