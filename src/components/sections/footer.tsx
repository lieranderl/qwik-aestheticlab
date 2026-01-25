import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { inlineTranslate } from "qwik-speak";
import { getLocaleNavLink } from "~/shared/locale-navigation";

export const Footer = component$(() => {
	const t = inlineTranslate();
	const location = useLocation();

	/* Shared navigation logic imported from shared/locale-navigation.ts */

	return (
		<footer class="footer sm:footer-horizontal bg-base-content text-base-100 items-center px-4 md:px-8 pb-16">
			<aside class="grid-flow-col items-center gap-4">
				<img
					src="/media/AestheticLabWhite.svg"
					alt="Aesthetic Lab"
					width="200"
					height="60"
					class="h-12 w-auto opacity-90"
				/>
				<p class="font-montserrat text-sm opacity-60">
					{t("app.footer.copyright@@Copyright")} © {new Date().getFullYear()} -{" "}
					{t("app.footer.all_rights@@All right reserved")}
				</p>
			</aside>
			<nav class="grid-flow-col gap-8 md:place-self-center md:justify-self-end items-center font-montserrat text-sm">
				<a
					class="link link-hover hover:text-primary transition-colors"
					href={getLocaleNavLink(location.url.pathname, "privacy-policy")}
				>
					{t("app.privacy.privacy_title@@Privacy Policy")}
				</a>
				<a
					class="link link-hover hover:text-primary transition-colors"
					href={getLocaleNavLink(location.url.pathname, "notice")}
				>
					{t("app.privacy.important_info@@Important Information")}
				</a>
			</nav>
		</footer>
	);
});
