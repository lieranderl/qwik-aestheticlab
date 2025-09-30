import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { HiLanguageSolid } from "@qwikest/icons/heroicons";
import {
	localizePath,
	useDisplayName,
	useSpeakConfig,
	useSpeakLocale,
} from "qwik-speak";

export const ChangeLocale = component$(() => {
	const pathname = useLocation().url.pathname;
	const locale = useSpeakLocale();
	const config = useSpeakConfig();
	const dn = useDisplayName();
	const getPath = localizePath();

	const humanreadble_lang = (lang: string) => {
		const displayName = dn(lang, { type: "language" });
		const displayNameWithoutParentheses = displayName
			.replace(/\s*\(.*?\)\s*/g, " ")
			.trim();
		const capitalizedDisplayName =
			displayNameWithoutParentheses.charAt(0).toUpperCase() +
			displayNameWithoutParentheses.slice(1);
		return capitalizedDisplayName;
	};

	return (
		<div class="dropdown dropdown-end">
			<button
				tabIndex={0}
				type="button"
				class="btn btn-primary btn-ghost text-base-100"
			>
				<HiLanguageSolid class="text-xl" />
				<span class="sm:block hidden">{humanreadble_lang(locale.lang)}</span>
			</button>
			<ul class="dropdown-content menu mt-2 p-2 shadow bg-base-100/96 rounded-box w-36">
				{config.supportedLocales.map((value) => (
					<li key={value.lang}>
						<a
							href={getPath(pathname, value.lang)}
							class="w-full text-left"
							role="menuitem"
							target="_self"
						>
							{humanreadble_lang(value.lang)}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
});
